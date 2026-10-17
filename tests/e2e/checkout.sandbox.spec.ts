import {test,expect} from '@playwright/test'
// Explicit opt-in. This test creates sandbox-only records; it never synthesizes a webhook.
test('Sandbox: criar cobrança PIX e aguardar entrega real do webhook',async({page})=>{
  test.skip(process.env.BITTUP_SANDBOX_TESTS!=='yes','Sandbox não habilitado explicitamente')
  expect(process.env.ASAAS_ENV).toBe('sandbox')
  expect(process.env.BITTUP_TEST_DATABASE_CONFIRMED).toBe('yes')
  const base=new URL(process.env.BITTUP_SANDBOX_BASE_URL!)
  expect(['127.0.0.1','localhost','bittup-dev.vercel.app']).toContain(base.hostname)
  expect(base.hostname==='bittup-dev.vercel.app' ? base.protocol==='https:' : ['http:','https:'].includes(base.protocol)).toBe(true)
  expect(Boolean(process.env.BITTUP_SANDBOX_ADMIN_COOKIE)).toBe(true)
  // Preflight the application's actual runtime before any order/payment creation.
  // Native fetch keeps the administrator cookie out of Playwright traces.
  const preflight=await fetch(new URL('/api/asaas/validate-key',base),{headers:{cookie:'auth_token='+process.env.BITTUP_SANDBOX_ADMIN_COOKIE},signal:AbortSignal.timeout(15000),redirect:'error'})
  expect(preflight.ok).toBeTruthy()
  const runtime=await preflight.json()
  expect(runtime.valid===true && runtime.environment==='sandbox').toBe(true)
  expect(Boolean(process.env.ASAAS_API_KEY && process.env.DATABASE_URL && process.env.BITTUP_SANDBOX_TEST_CPF && process.env.BITTUP_TEST_PRODUCT_SLUG?.startsWith('sandbox-'))).toBe(true)
  const {PrismaClient}=await import('../../src/generated/client')
  const {PrismaPg}=await import('@prisma/adapter-pg')
  const {Pool}=await import('pg')
  const pool=new Pool({connectionString:process.env.DATABASE_URL})
  const db=new PrismaClient({adapter:new PrismaPg(pool)})
  try {
    const product=await db.product.findFirst({where:{slug:process.env.BITTUP_TEST_PRODUCT_SLUG}})
    expect(product).toBeTruthy()
    await page.goto('/loja')
    await page.locator(`a[href="/loja/produto/${product!.slug}"]`).click()
    // Use a dedicated fixture product without color/size variants.
    await page.getByRole('button',{name:'Adicionar ao carrinho'}).click()
    await page.goto('/loja/checkout')
    for(const [name,value] of Object.entries({fullName:'Comprador Sandbox BittUp',email:'sandbox@example.invalid',cpf:process.env.BITTUP_SANDBOX_TEST_CPF!,phone:'11999999999','address.street':'Rua Teste','address.number':'1','address.neighborhood':'Centro','address.city':'São Paulo','address.state':'SP','address.zipCode':'01001000'}))
      await page.locator(`[name="${name}"]`).fill(value)
    await page.getByRole('button',{name:'Finalizar Pedido',exact:true}).click()
    await expect(page).toHaveURL(/\/loja\/pedido\/[^/]+\/pagamento/)
    const orderId=page.url().split('/pedido/')[1].split('/')[0]
    const responsePromise=page.waitForResponse(r=>r.url().endsWith('/api/asaas/create-payment')&&r.request().method()==='POST')
    await page.getByRole('button',{name:'Pix Instantâneo',exact:true}).click()
    await page.getByRole('button',{name:'Gerar QR Code PIX',exact:true}).click()
    const response=await responsePromise;expect(response.ok()).toBeTruthy()
    const {paymentId}=await response.json()
    // Verify the payment against Sandbox directly. Never follow a configurable production host.
    const provider=await fetch('https://api-sandbox.asaas.com/v3/payments/'+encodeURIComponent(paymentId),{headers:{access_token:process.env.ASAAS_API_KEY!,'User-Agent':'BittUp-tests/1.0'},signal:AbortSignal.timeout(15000)})
    expect(provider.ok).toBeTruthy();const payment=await provider.json()
    const order=await db.order.findUniqueOrThrow({where:{id:orderId},include:{items:true}})
    expect(payment.externalReference).toBe(orderId);expect(payment.customer).toBe(order.customerId)
    expect(payment.value).toBe(Number(order.total)+Number(order.frete??0))
    // Simulate settlement at the provider, then wait for a REAL provider webhook delivery.
    const confirmed=await fetch('https://api-sandbox.asaas.com/v3/sandbox/payment/'+encodeURIComponent(paymentId)+'/confirm',{
      method:'POST',headers:{access_token:process.env.ASAAS_API_KEY!,'User-Agent':'BittUp-tests/1.0'},signal:AbortSignal.timeout(15000)})
    expect(confirmed.ok).toBeTruthy()
    await expect.poll(async()=>(await db.order.findUniqueOrThrow({where:{id:orderId}})).statusPagamento,{timeout:120000,intervals:[3000]}).toBe('approved')
    const receipt=await db.asaasWebhookEvent.findFirst({where:{paymentId,processedAt:{not:null},outcome:'applied'}})
    expect(receipt).toBeTruthy()
    await page.goto('/loja/pedido/'+orderId)
    await expect(page.getByText('Pagamento aprovado!',{exact:true})).toBeVisible()
  } finally {await db.$disconnect();await pool.end()}
})
