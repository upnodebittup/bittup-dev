import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac, randomUUID } from 'node:crypto'
import { prisma } from '../src/core/lib/prisma'
import { createPayment, paymentView, synchronizePayment } from '../src/core/lib/mp/orders'
import { closeWeek, reconcile } from '../src/core/lib/mp/ledger'
import { acceptWebhook, processEvent, recover } from '../src/core/lib/mp/webhooks'
import { decrypt, encrypt, hash, MERCHANT } from '../src/core/lib/mp/security'
import { publicKeyFor } from '../src/core/lib/mp/client'
import { finishOAuth, startOAuth, disconnectAccount } from '../src/core/lib/mp/oauth'
import { weekStart } from '../src/core/lib/mp/accounting'
import { readFile } from 'node:fs/promises'
import pg from 'pg'

if (process.env.BITTUP_MP_ISOLATED_TEST !== 'yes' || new URL(process.env.DATABASE_URL!).hostname !== '127.0.0.1' || !new URL(process.env.DATABASE_URL!).pathname.startsWith('/bittup_mp_')) throw Error('Isolated database required')
after(() => prisma.$disconnect())
const snapshots = new Map<string, any>(), idempotency = new Map<string, any>()
let creates = 0, failResponse = false, rejectValidation = false, accountUser = '123'
globalThis.fetch = async (url, options) => {
  const path = new URL(String(url)).pathname
  if (path === '/users/me') return Response.json({ id: Number(accountUser), nickname: 'Vendedor Sintético', site_id: 'MLB', tags: ['test_user'] })
  if (path === '/oauth/token') return Response.json({ access_token: 'synthetic-access', refresh_token: 'synthetic-refresh', public_key: 'synthetic-key-' + accountUser, user_id: Number(accountUser), expires_in: 3600 })
  if (path === '/v1/orders' && options?.method === 'POST') {
    if (rejectValidation) { rejectValidation = false; return Response.json({ error: 'synthetic-validation' }, { status: 422 }) }
    const body = JSON.parse(String(options.body)), key = (options.headers as Record<string, string>)['X-Idempotency-Key']
    assert.equal(body.transactions.payments[0].amount, body.total_amount)
    assert.equal('application_fee' in body, false)
    if (!idempotency.has(key)) {
      creates++
      const snap = { id: 'ORDTEST' + creates, user_id: accountUser, external_reference: body.external_reference, total_amount: body.total_amount, country_code: 'BRA',
        status: 'action_required', status_detail: 'waiting_transfer', transactions: { payments: [{ amount: body.total_amount, payment_method: { qr_code: 'SYNTHETIC-PIX' } }] } }
      idempotency.set(key, snap); snapshots.set(snap.id, snap)
    }
    if (failResponse) { failResponse = false; throw Error('Response lost after remote creation') }
    return Response.json(idempotency.get(key))
  }
  if (path.startsWith('/v1/orders/')) {
    const snap = snapshots.get(path.split('/').at(-1)!)
    if (snap) return Response.json(snap)
  }
  throw Error('Unexpected financial network call: ' + path)
}
async function account(userId = '123') {
  return prisma.mercadoPagoAccount.upsert({ where: { userId }, create: { userId, label: 'Synthetic', access: encrypt('synthetic-access'), refresh: encrypt('synthetic-refresh'), expiresAt: new Date(Date.now() + 3600000), confirmedAt: new Date() },
    update: { access: encrypt('synthetic-access'), refresh: encrypt('synthetic-refresh'), expiresAt: new Date(Date.now() + 3600000), confirmedAt: new Date() } })
}
async function order() {
  return prisma.order.create({ data: { fullName: 'Synthetic Buyer', email: 'buyer@testuser.com', cpf: '00000000000', phone: '11999999999', address: {}, total: '20.00', frete: '5.00', statusPagamento: 'pending', paymentProvider: 'mercado_pago' } })
}
function approved(snapshot: any) { return { ...snapshot, status: 'processed', status_detail: 'accredited', transactions: { payments: [{ ...snapshot.transactions.payments[0], paid_amount: snapshot.total_amount }] } } }
function webhook(snapshot: any, eventId: string = randomUUID()) {
  const ts = String(Date.now()), requestId = randomUUID()
  const signature = createHmac('sha256', process.env.MP_WEBHOOK_SECRET!).update(`id:${snapshot.id.toLowerCase()};request-id:${requestId};ts:${ts};`).digest('hex')
  return new Request(`https://bittup.example.invalid/api/mercado-pago/webhook?data.id=${snapshot.id}`, { method: 'POST', headers: { 'x-request-id': requestId, 'x-signature': `ts=${ts},v1=${signature}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'order', id: eventId, user_id: snapshot.user_id, data: { id: snapshot.id } }) })
}
test('PostgreSQL: additive migration preserves existing Asaas order and stock', async () => {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    await client.query('BEGIN; CREATE SCHEMA migration_preservation; SET LOCAL search_path TO migration_preservation;')
    await client.query(await readFile('prisma/migrations/20260424013927_init/migration.sql', 'utf8'))
    await client.query(await readFile('prisma/migrations/20261017000100_asaas_webhook_inbox/migration.sql', 'utf8'))
    await client.query(`INSERT INTO "Order" (id,"fullName",email,cpf,phone,address,total,frete,"statusPagamento","customerId") VALUES ('old-asaas','Synthetic','b@example.invalid','00000000000','11999999999','{}',20,5,'approved','cus_old')`)
    await client.query(`INSERT INTO "Product" (id,name,slug,description,price,stock,"updatedAt") VALUES ('old-product','Synthetic','old-product','Synthetic',20,7,now())`)
    await client.query(await readFile('prisma/migrations/20261018000100_mercado_pago_orders/migration.sql', 'utf8'))
    await client.query(`INSERT INTO "PaymentSettings" (id,provider,"creditCents") VALUES ('historical','asaas',0)`)
    await client.query(await readFile('prisma/migrations/20261020000100_mercado_pago_only/migration.sql', 'utf8'))
    assert.equal((await client.query(`SELECT provider FROM "PaymentSettings" WHERE id='historical'`)).rows[0].provider, 'mercado_pago')
    const { rows } = await client.query('SELECT "paymentProvider",total,frete,"statusPagamento","customerId" FROM "Order" WHERE id=\'old-asaas\'')
    assert.deepEqual(rows[0], { paymentProvider: 'asaas', total: '20.00', frete: '5.00', statusPagamento: 'approved', customerId: 'cus_old' })
    assert.equal((await client.query('SELECT stock FROM "Product" WHERE id=\'old-product\'')).rows[0].stock, 7)
  } finally { await client.query('ROLLBACK'); await client.end() }
})
test('PostgreSQL: OAuth PKCE/session binding, consumed state, reconnection and disconnect', async () => {
  const request = new Request('http://localhost:3219/api/mercado-pago/oauth/start', { headers: { cookie: 'auth_token=synthetic-session' } })
  const response = await startOAuth(request), location = new URL(response.headers.get('location')!)
  assert.equal(location.searchParams.get('code_challenge_method'), 'S256')
  const state = location.searchParams.get('state')!
  const stored = await prisma.mercadoPagoOAuthAttempt.findUniqueOrThrow({ where: { hash: hash(state) } })
  assert.notEqual(stored.verifier, decrypt(stored.verifier))
  const callback = (cookie: string) => new Request(`http://localhost:3219/api/mercado-pago/oauth/callback?state=${state}&code=synthetic-code`, { headers: { cookie: 'auth_token=' + cookie } })
  await assert.rejects(finishOAuth(callback('another-session')))
  assert.equal((await finishOAuth(callback('synthetic-session'))).status, 303)
  await assert.rejects(finishOAuth(callback('synthetic-session')))
  const expiredState = 'a'.repeat(43)
  await prisma.mercadoPagoOAuthAttempt.create({ data: { hash: hash(expiredState), sessionHash: hash('synthetic-session'), verifier: encrypt('synthetic-verifier'), expiresAt: new Date(Date.now() - 1000) } })
  await assert.rejects(finishOAuth(new Request(`http://localhost:3219/api/mercado-pago/oauth/callback?state=${expiredState}&code=synthetic-code`, { headers: { cookie: 'auth_token=synthetic-session' } })))
  const settings = await prisma.paymentSettings.findUniqueOrThrow({ where: { id: MERCHANT }, include: { account: true } })
  assert.equal(settings.account?.publicKey, 'synthetic-key-123')
  assert.equal(await publicKeyFor(settings.account!.id), 'synthetic-key-123')
  assert.equal(settings.account?.confirmedAt, null)
  await disconnectAccount()
  assert.equal((await prisma.mercadoPagoAccount.findUniqueOrThrow({ where: { id: settings.accountId! } })).access, null)
})
test('PostgreSQL: duplicate checkout, webhook, refund credit and immutable weekly statements', async () => {
  const seller = await account()
  await prisma.paymentSettings.update({ where: { id: MERCHANT }, data: { accountId: seller.id, provider: 'mercado_pago' } })
  const local = await order(), input = { orderId: local.id, requestKey: randomUUID(), method: 'pix' }
  const result = await Promise.all([createPayment(input), createPayment(input)])
  assert.equal(result[0]?.id, result[1]?.id)
  assert.equal(creates, 1)
  assert.equal(await prisma.upnodeCommissionEntry.count(), 0)
  await assert.rejects(createPayment({ ...input, requestKey: randomUUID() }))
  await assert.rejects(createPayment({ ...input, total: 0.01 }))
  const payment = await prisma.mercadoPagoPayment.findFirstOrThrow({ where: { orderId: local.id } })
  assert.equal(payment.totalCents, 2500) // includes the signed order's shipping
  assert.equal(payment.requestBody, null)
  let snapshot = approved(snapshots.get(payment.providerId!)); snapshots.set(snapshot.id, snapshot)
  const event = webhook(snapshot, 'same-event')
  const responses = await Promise.all([acceptWebhook(event.clone()), acceptWebhook(event.clone())])
  assert.deepEqual(responses.map(r => r.status), [200, 200])
  assert.equal(await prisma.upnodeCommissionEntry.count({ where: { kind: 'commission', orderId: local.id } }), 1)
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: local.id } })).statusPagamento, 'approved')
  assert.equal((await paymentView(local.id))?.qrCode, null)
  await assert.rejects(reconcile(seller.id, { ...snapshot, user_id: '456' }))
  await assert.rejects(reconcile(seller.id, { ...snapshot, total_amount: '0.01' }))
  await assert.rejects(reconcile(seller.id, { ...snapshot, external_reference: 'unknown-order' }))
  const end = new Date(weekStart().getTime() - 7 * 86400000), old = new Date(end.getTime() - 1000)
  await prisma.upnodeCommissionEntry.updateMany({ where: { orderId: local.id }, data: { createdAt: old } })
  const statement = await closeWeek(end)
  assert.equal(statement.dueCents, 100); assert.equal(statement.salesCents, 2500); assert.equal(statement.status, 'billing_disabled')
  assert.equal((await closeWeek(end)).id, statement.id)
  snapshot = { ...snapshot, status_detail: 'partially_refunded', transactions: { payments: [{ ...snapshot.transactions.payments[0], refunded_amount: '5.00' }] } }
  await Promise.all([reconcile(seller.id, snapshot), reconcile(seller.id, snapshot)])
  snapshot = { ...snapshot, status: 'refunded', status_detail: 'refunded' }
  await reconcile(seller.id, snapshot)
  await reconcile(seller.id, approved(snapshot)) // stale approval cannot undo reversal
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: local.id } })).statusPagamento, 'refunded')
  const ledger = await prisma.upnodeCommissionEntry.findMany({ where: { orderId: local.id } })
  assert.equal(ledger.reduce((n, e) => n + e.cents, 0), 0)
  assert.equal(ledger.reduce((n, e) => n + e.refundCents, 0), 2500)
  assert.equal(ledger.filter(e => e.kind === 'credit').length, 1)
  assert.equal((await prisma.upnodeWeeklyStatement.findUniqueOrThrow({ where: { id: statement.id } })).dueCents, 100)
  await prisma.upnodeCommissionEntry.updateMany({ where: { orderId: local.id, statementId: null }, data: { createdAt: new Date(end.getTime() + 1000) } })
  const nextWeek = await closeWeek(weekStart())
  assert.equal(nextWeek.dueCents, 0); assert.equal(nextWeek.closingCredit, -100); assert.equal(nextWeek.refundCents, 2500)
})
test('PostgreSQL: lost provider response recovers same idempotent intent and card is token-only', async () => {
  const seller = await account(), local = await order()
  const input = { orderId: local.id, requestKey: randomUUID(), method: 'card', token: 'synthetic-card-token', payment_method_id: 'master', identification: { type: 'CPF', number: '00000000000' } }
  failResponse = true
  const before = creates
  await assert.rejects(createPayment(input))
  const payment = await prisma.mercadoPagoPayment.findFirstOrThrow({ where: { orderId: local.id } })
  assert.ok(payment.requestBody)
  assert.equal(payment.requestBody!.includes('synthetic-card-token'), false)
  const body = JSON.parse(decrypt(payment.requestBody!))
  assert.equal(body.transactions.payments[0].payment_method.installments, 1)
  assert.equal(body.transactions.payments[0].payment_method.type, 'credit_card')
  assert.equal(body.total_amount, '25.00')
  await Promise.all([synchronizePayment(payment.id), synchronizePayment(payment.id)])
  assert.equal(creates - before, 1)
  assert.ok((await prisma.mercadoPagoPayment.findUniqueOrThrow({ where: { id: payment.id } })).providerId)
  const snapshot = approved(snapshots.get('ORDTEST' + creates))
  await reconcile(seller.id, snapshot)
  assert.equal(await prisma.upnodeCommissionEntry.count({ where: { orderId: local.id, kind: 'commission' } }), 1)
})
test('PostgreSQL: historical accounts stay bound across replacement; failed inbox survives disconnect', async () => {
  const seller = await account(), other = await account('456'), local = await order()
  const result = await createPayment({ orderId: local.id, requestKey: randomUUID(), method: 'pix' })
  const row = await prisma.mercadoPagoPayment.findUniqueOrThrow({ where: { id: result!.id } })
  const snapshot = approved(snapshots.get(row.providerId!)); snapshots.set(snapshot.id, snapshot)
  await prisma.paymentSettings.update({ where: { id: MERCHANT }, data: { accountId: other.id } })
  assert.equal((await acceptWebhook(webhook(snapshot))).status, 200)
  assert.equal((await prisma.mercadoPagoPayment.findUniqueOrThrow({ where: { id: row.id } })).accountId, seller.id)
  await prisma.mercadoPagoAccount.update({ where: { id: seller.id }, data: { access: null } })
  assert.equal((await acceptWebhook(webhook(snapshot, 'retry-after-disconnect'))).status, 503)
  const pending = await prisma.mercadoPagoWebhookEvent.findFirstOrThrow({ where: { status: 'failed' } })
  await account()
  await processEvent(pending.key)
  assert.equal((await prisma.mercadoPagoWebhookEvent.findUniqueOrThrow({ where: { key: pending.key } })).status, 'processed')
  const wrongSignature = webhook(snapshot)
  wrongSignature.headers.set('x-signature', 'ts=123,v1=invalid')
  assert.equal((await acceptWebhook(wrongSignature)).status, 401)
})
test('PostgreSQL: definitive rejection allows a fresh card token without commission', async () => {
  const seller = await account()
  await prisma.paymentSettings.update({ where: { id: MERCHANT }, data: { accountId: seller.id } })
  const local = await order()
  const input = { orderId: local.id, requestKey: randomUUID(), method: 'card', token: 'invalid-synthetic-token', payment_method_id: 'master' }
  rejectValidation = true
  await assert.rejects(createPayment(input))
  const failed = await prisma.mercadoPagoPayment.findFirstOrThrow({ where: { orderId: local.id } })
  assert.equal(failed.status, 'failed'); assert.equal(failed.requestBody, null)
  assert.equal(await prisma.upnodeCommissionEntry.count({ where: { orderId: local.id } }), 0)
  const retried = await createPayment({ ...input, requestKey: randomUUID(), token: 'new-synthetic-token' })
  assert.notEqual(retried?.id, failed.id)
})
test('PostgreSQL: automatic recovery drains durable failures without another charge', async () => {
  const event = await prisma.mercadoPagoWebhookEvent.findFirstOrThrow()
  await prisma.mercadoPagoWebhookEvent.update({ where: { key: event.key }, data: { status: 'failed', processedAt: null } })
  const before = creates
  const result = await recover()
  assert.ok(result.processed >= 1); assert.equal(result.failed, 0); assert.equal(creates, before)
  assert.equal((await prisma.mercadoPagoWebhookEvent.findUniqueOrThrow({ where: { key: event.key } })).status, 'processed')
})

test('PostgreSQL: digital category skips freight/address; mixed carts quote physical units and reject forged free freight', async () => {
  // Next's page redirect import needs the browser React runtime, absent in this
  // react-server test process. Public POST routes never invoke this page helper.
  const { default: Module } = await import('node:module')
  const originalLoad = (Module as any)._load
  ;(Module as any)._load = function(id: string, ...args: unknown[]) {
    if (id === 'next/navigation') return { redirect() { throw Error('Unexpected page redirect') } }
    if (id === 'next/headers') return { cookies: async () => ({ get: () => undefined }) }
    return originalLoad.call(this, id, ...args)
  }
  let shipping: typeof import('../src/app/api/frete/route').POST
  let checkout: typeof import('../src/app/api/orders/route').POST
  try {
    shipping = (await import('../src/app/api/frete/route')).POST
    checkout = (await import('../src/app/api/orders/route')).POST
  } finally { (Module as any)._load = originalLoad }
  const { NextRequest } = await import('next/server')
  const category = await prisma.category.upsert({ where: { slug: 'produto-digital' }, create: { name: 'Produto digital (sem frete)', slug: 'produto-digital' }, update: {} })
  const digital = await prisma.product.create({ data: { name: 'Digital', slug: 'digital-test', description: 'Synthetic', price: 10, stock: 20, categories: { connect: { id: category.id } } } })
  const physical = await prisma.product.create({ data: { name: 'Physical', slug: 'physical-test', description: 'Synthetic', price: 20, stock: 20 } })
  const checkoutAccount = await account()
  await prisma.paymentSettings.upsert({ where: { id: MERCHANT }, create: { id: MERCHANT, provider: 'mercado_pago', accountId: checkoutAccount.id }, update: { provider: 'mercado_pago', accountId: checkoutAccount.id } })
  const request = (path: string, body: unknown) => new NextRequest('http://localhost:3219/api/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const buyer = { fullName: 'Synthetic Digital', email: 'digital@example.invalid', cpf: '00000000000', phone: '11999999999' }
  const line = (id: string, quantity: number) => ({ productId: id, quantity, size: { name: '' }, color: { name: '' } })
  const digitalItems = [line(digital.id, 3)]
  const quoteResponse = await shipping(request('frete', { items: digitalItems }))
  assert.equal(quoteResponse.status, 200)
  const [freeQuote] = await quoteResponse.json()
  assert.equal(freeQuote.price, '0.00'); assert.equal(freeQuote.requiresShipping, false)
  const digitalResponse = await checkout(request('orders', { ...buyer, items: digitalItems, frete: 999, digitalOnly: false }))
  assert.equal(digitalResponse.status, 200)
  const digitalOrder = await prisma.order.findUniqueOrThrow({ where: { id: (await digitalResponse.json()).orderId } })
  assert.equal(Number(digitalOrder.frete), 0); assert.equal(Number(digitalOrder.total), 30)
  assert.equal((digitalOrder.address as any).zipCode, '')
  const mixed = [line(digital.id, 5), line(physical.id, 2)]
  const address = { street: 'Synthetic', number: '1', neighborhood: 'Test', city: 'Test', state: 'SP', zipCode: '01001000' }
  const forged = await checkout(request('orders', { ...buyer, address, items: mixed, frete: 0, quoteToken: freeQuote.quoteToken, digitalOnly: true }))
  assert.equal(forged.status, 400)
  assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: physical.id } })).stock, 20)
  const previousFetch = globalThis.fetch
  const previousToken = process.env.MELHOR_ENVIO_TOKEN
  let shippedQuantity = 0
  process.env.MELHOR_ENVIO_TOKEN = 'synthetic-shipping'
  globalThis.fetch = async (url, options) => {
    if (String(url).includes('melhorenvio.com.br')) {
      shippedQuantity = JSON.parse(String(options?.body)).products[0].quantity
      return Response.json([{ id: 1, name: 'PAC', price: '7.00', delivery_time: 3 }])
    }
    return previousFetch(url, options)
  }
  try {
    const response = await shipping(request('frete', { items: mixed, cepDestino: address.zipCode, quantidade: 999 }))
    assert.equal(response.status, 200); assert.equal(shippedQuantity, 2)
    const [quote] = await response.json()
    const orderResponse = await checkout(request('orders', { ...buyer, address, items: mixed, frete: 7, quoteToken: quote.quoteToken }))
    assert.equal(orderResponse.status, 200)
    const order = await prisma.order.findUniqueOrThrow({ where: { id: (await orderResponse.json()).orderId } })
    assert.equal(Number(order.total), 90); assert.equal(Number(order.frete), 7)
    const noAddress = await checkout(request('orders', { ...buyer, items: [line(physical.id, 1)], digitalOnly: true }))
    assert.equal(noAddress.status, 400)
  } finally {
    globalThis.fetch = previousFetch
    if (previousToken === undefined) delete process.env.MELHOR_ENVIO_TOKEN
    else process.env.MELHOR_ENVIO_TOKEN = previousToken
  }
})

test('PostgreSQL: card uses OAuth account key instead of stale global key and retains the nested rejection reason', async () => {
  accountUser = '123'
  const a = await account()
  await prisma.mercadoPagoAccount.update({ where: { id: a.id }, data: { publicKey: null } })
  const previousKey = process.env.MP_PUBLIC_KEY
  process.env.MP_PUBLIC_KEY = 'wrong-key-from-test-environment'
  try {
    assert.equal(await publicKeyFor(a.id), 'synthetic-key-123')
    await prisma.paymentSettings.update({ where: { id: MERCHANT }, data: { accountId: a.id, provider: 'mercado_pago' } })
    const o = await order()
    const payment = await createPayment({ orderId: o.id, requestKey: randomUUID(), method: 'card', token: 'synthetic-card', payment_method_id: 'master' })
    const row = await prisma.mercadoPagoPayment.findUniqueOrThrow({ where: { id: payment!.id } })
    const snapshot = snapshots.get(row.providerId!)
    const rejected = { ...snapshot, status: 'failed', status_detail: 'failed', transactions: { payments: [{ ...snapshot.transactions.payments[0], status_detail: 'invalid_card_token' }] } }
    await reconcile(a.id, rejected)
    assert.equal((await paymentView(o.id))?.detail, 'invalid_card_token')
    assert.equal(await prisma.upnodeCommissionEntry.count({ where: { orderId: o.id } }), 0)
  } finally { process.env.MP_PUBLIC_KEY = previousKey }
})
