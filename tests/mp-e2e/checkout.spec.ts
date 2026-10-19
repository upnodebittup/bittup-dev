import { test, expect } from '@playwright/test'
import { createHmac, randomUUID } from 'node:crypto'
import jwt from 'jsonwebtoken'
import pg from 'pg'
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
test.afterAll(() => pool.end())

test('Produto digital dispensa endereço e frete, com classificação consultada no banco', async ({ page }) => {
  await page.goto('/loja/produto/synthetic-digital')
  await page.getByRole('button', { name: 'Adicionar ao carrinho', exact: true }).click()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('loja-roupas-cart') ?? '[]')[0]?.quantity)).toBe(1)
  await page.goto('/loja/checkout')
  await expect(page.getByText('Pedido com produtos digitais: sem frete e sem endereço de entrega.')).toBeVisible()
  await expect(page.getByLabel('CEP', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Não se aplica — produto digital')).toBeVisible()
  for (const [name, value] of Object.entries({ fullName: 'Comprador Digital', email: 'digital@example.invalid', cpf: '00000000000', phone: '11999999999' }))
    await page.locator(`[name="${name}"]`).fill(value)
  await page.screenshot({ path: '.mp-validation/checkout-digital.png', fullPage: true })
  await page.getByRole('button', { name: 'Finalizar Pedido', exact: true }).click()
  await expect(page).toHaveURL(/\/loja\/pedido\/[^/]+\/pagamento/)
  const id = new URL(page.url()).pathname.split('/')[3]
  const order = (await pool.query('SELECT total,frete,address FROM "Order" WHERE id=$1', [id])).rows[0]
  expect(Number(order.total)).toBe(10); expect(Number(order.frete)).toBe(0)
  expect(order.address.zipCode).toBe('')
})
const entryCount = async (orderId: string, kind?: string) => (await pool.query('SELECT count(*)::int AS n FROM "UpnodeCommissionEntry" WHERE "orderId"=$1 AND ($2::text IS NULL OR kind=$2)', [orderId, kind ?? null])).rows[0].n
test('OAuth, confirmação, checkout real BittUp com PG local, PIX/cartão e webhook de provedor simulado', async ({ page, browser }) => {
  await page.route('**/api/mercado-pago/oauth/start', async route => {
    const response = await route.fetch({ maxRedirects: 0 })
    expect(response.status()).toBe(303)
    const location = new URL(response.headers().location)
    expect(location.origin).toBe('https://auth.mercadopago.com.br')
    const state = location.searchParams.get('state')!
    await route.fulfill({ status: 303, headers: { location: `http://localhost:3219/api/mercado-pago/oauth/callback?state=${state}&code=synthetic-code` } })
  })
  await page.route('https://sdk.mercadopago.com/js/v2', route => route.fulfill({ contentType: 'application/javascript', body: `window.MercadoPago=class { constructor(key){window.__mpPublicKey=key} bricks(){return {create:async(kind,id,settings)=>{const host=document.getElementById(id);host.innerHTML='<label>Cartão sintético<input aria-label="Cartão sintético" /></label><button type="button">Pagar com cartão sintético</button>';host.querySelector('button').onclick=()=>settings.callbacks.onSubmit({token:'synthetic-token',payment_method_id:'master',payer:{identification:{type:'CPF',number:'00000000000'}}});settings.callbacks.onReady();return {unmount(){host.innerHTML=''}}}}}}` }))
  await page.goto('/admin/login')
  await page.locator('input[type=email]').fill('admin@synthetic.invalid')
  await page.locator('input[type=password]').fill('synthetic-test-password')
  const loggedIn = page.waitForResponse(response => response.url().endsWith('/api/auth/login') && response.request().method() === 'POST')
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  expect((await loggedIn).status()).toBe(200)
  await page.goto('/admin/configuracoes/pagamentos')
  await page.getByRole('button', { name: 'Conectar Mercado Pago', exact: true }).click()
  await expect(page.getByText('Conta Mercado Pago conectada', { exact: false })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Conectar Mercado Pago', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Confirmar esta conta como recebedora' }).click()
  await expect(page.getByText('Conta recebedora confirmada.')).toBeVisible()
  await page.getByLabel('Provedor de pagamento').selectOption('mercado_pago')
  await expect.poll(async () => (await (await page.request.get('/api/mercado-pago/settings')).json()).provider).toBe('mercado_pago')
  await page.route('**/api/frete', async route => {
    const data = route.request().postDataJSON()
    const quoteToken = jwt.sign({ zip: data.cepDestino, quantity: data.quantidade, price: '5.00', serviceId: 1 }, process.env.AUTH_JWT_SECRET!, { algorithm: 'HS256', audience: 'shipping-quote', expiresIn: '20m' })
    await route.fulfill({ json: [{ price: '5.00', quoteToken }] })
  })
  for (const method of ['PIX', 'CREDIT_CARD']) {
    await page.goto('/loja/produto/synthetic-product')
    await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
    await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('loja-roupas-cart') ?? '[]')[0]?.quantity)).toBe(2)
    await page.goto('/loja/checkout')
    for (const [name, value] of Object.entries({ fullName: 'Comprador Sintetico', email: 'buyer@testuser.com', cpf: '00000000000', phone: '11999999999', 'address.street': 'Rua Teste', 'address.number': '1', 'address.neighborhood': 'Teste', 'address.city': 'São Paulo', 'address.state': 'SP', 'address.zipCode': '01001000' }))
      await page.locator(`[name="${name}"]`).fill(value)
    await page.getByRole('button', { name: 'Finalizar Pedido', exact: true }).click()
    await expect(page).toHaveURL(/\/loja\/pedido\/[^/]+\/pagamento/)
    const orderId = new URL(page.url()).pathname.split('/')[3]
    const order = (await pool.query('SELECT * FROM "Order" WHERE id=$1', [orderId])).rows[0]
    expect(Number(order.total)).toBe(40); expect(Number(order.frete)).toBe(5); expect(order.paymentProvider).toBe('mercado_pago')
    if (method === 'PIX') {
      await page.getByRole('button', { name: 'Pix Instantâneo', exact: true }).click()
      await page.getByRole('button', { name: 'Gerar QR Code PIX', exact: true }).click()
      await expect(page.getByLabel('PIX copia e cola')).toBeVisible()
    } else {
      await page.getByRole('button', { name: 'Cartão de Crédito', exact: false }).click()
      await expect.poll(() => page.evaluate(() => (window as Window & { __mpPublicKey?: string }).__mpPublicKey)).toBe('synthetic-oauth-key')
      await page.getByRole('button', { name: 'Pagar com cartão sintético' }).click()
    }
    await expect.poll(async () => (await pool.query('SELECT count(*)::int AS n FROM "MercadoPagoPayment" WHERE "orderId"=$1 AND "providerId" IS NOT NULL', [orderId])).rows[0].n).toBe(1)
    const payment = (await pool.query('SELECT * FROM "MercadoPagoPayment" WHERE "orderId"=$1', [orderId])).rows[0]
    expect(payment.totalCents).toBe(4500)
    expect(await entryCount(orderId)).toBe(0)
    const ts = String(Date.now()), requestId = randomUUID(), id = payment.providerId!
    const signature = createHmac('sha256', process.env.MP_WEBHOOK_SECRET!).update(`id:${id.toLowerCase()};request-id:${requestId};ts:${ts};`).digest('hex')
    const send = () => page.request.post('/api/mercado-pago/webhook?data.id=' + id, { headers: { 'x-request-id': requestId, 'x-signature': `ts=${ts},v1=${signature}` }, data: { id: 'evt-' + id, type: 'order', user_id: '123', data: { id } } })
    expect((await send()).status()).toBe(200); expect((await send()).status()).toBe(200)
    await expect(page.getByText('Pagamento aprovado!', { exact: true })).toBeVisible()
    await expect(page.getByLabel('PIX copia e cola')).toHaveCount(0)
    expect(await entryCount(orderId, 'commission')).toBe(1)
    const anonymous = await browser.newContext()
    expect((await anonymous.request.get('http://localhost:3219/api/mercado-pago/payment?orderId=' + orderId)).status()).toBe(404)
    await anonymous.close()
  }
  expect((await pool.query('SELECT stock FROM "Product" WHERE id=$1', ['synthetic-product'])).rows[0].stock).toBe(6)
  const zip = '01001000', quantity = 4
  const quoteToken = jwt.sign({ zip, quantity, price: '5.00', serviceId: 1 }, process.env.AUTH_JWT_SECRET!, { algorithm: 'HS256', audience: 'shipping-quote', expiresIn: '20m' })
  const stockInput = { fullName: 'Comprador Sintetico', email: 'buyer@testuser.com', cpf: '00000000000', phone: '11999999999',
    address: { street: 'Rua Teste', number: '1', neighborhood: 'Teste', city: 'São Paulo', state: 'SP', zipCode: zip }, frete: 5, quoteToken,
    items: [{ productId: 'synthetic-product', quantity, price: 0.01, color: { name: 'Não selecionado' }, size: { name: 'Não selecionado' } }] }
  const races = await Promise.all([page.request.post('/api/orders', { data: stockInput }), page.request.post('/api/orders', { data: stockInput })])
  expect(races.map(r => r.status()).sort()).toEqual([200, 400])
  expect((await pool.query('SELECT stock FROM "Product" WHERE id=$1', ['synthetic-product'])).rows[0].stock).toBe(2)
  await page.goto('/admin/configuracoes/pagamentos')
  await page.getByRole('button', { name: 'Desconectar conta Mercado Pago' }).click()
  await expect(page.getByRole('button', { name: 'Conectar Mercado Pago', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Desconectar conta Mercado Pago' })).toHaveCount(0)
  await page.screenshot({ path: '.mp-validation/painel-pagamentos.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
  await page.screenshot({ path: '.mp-validation/painel-pagamentos-mobile.png', fullPage: true })
})
