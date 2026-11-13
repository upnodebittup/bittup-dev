import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID, createHmac } from 'node:crypto'
import { prisma } from '../src/core/lib/prisma'
import { encrypt, hash } from '../src/core/lib/mp/security'
import { acceptRelay } from '../src/core/lib/mp/relay-receiver'
import { authenticateRelay, relayDestination, relayHeaders } from '../src/core/lib/mp/relay-auth'

if (!(process.env.BITTUP_MP_ISOLATED_TEST === 'yes' || process.env.UPNODE_MP_ISOLATED_TEST === 'yes') || new URL(process.env.DATABASE_URL!).hostname !== '127.0.0.1') throw Error('Isolated PostgreSQL required')
after(() => prisma.$disconnect())
const secret = 'synthetic-relay-secret-at-least-forty-three-characters'
process.env.MP_RELAY_RECEIVER_ENABLED = 'true'
process.env.MP_RELAY_INSTANCE_ID = 'receiver-test'
process.env.MP_RELAY_SHARED_SECRET = secret
const snapshots = new Map<string, any>()
let outage = false, remoteOutage = false, remoteSends = 0
const remoteSecret = 'synthetic-remote-secret-at-least-forty-three-characters'
globalThis.fetch = async (input, options) => {
  const url = new URL(String(input)), headers = new Headers(options?.headers)
  if (url.hostname === 'artesanaio.example.invalid') {
    remoteSends++
    assert.ok(authenticateRelay(headers, String(options?.body), 'artesanaio-prod', remoteSecret))
    assert.deepEqual(Object.keys(JSON.parse(String(options?.body))).sort(), ['eventKey', 'resourceId'])
    assert.equal(options?.redirect, 'error')
    if (remoteOutage) throw Error('Synthetic outage')
    return Response.json({ outcome: 'ignored' })
  }
  if (url.hostname !== 'api.mercadopago.com') throw Error('External network forbidden')
  if (outage) return Response.json({}, { status: 503 })
  if (url.pathname === '/users/me') return Response.json({ id: 123, nickname: 'Synthetic', site_id: 'MLB', tags: ['test_user'] })
  if (url.pathname.startsWith('/v1/orders/')) {
    const snapshot = snapshots.get(url.pathname.split('/').at(-1)!)
    return snapshot ? Response.json(snapshot) : Response.json({}, { status: 404 })
  }
  throw Error('Unexpected API call')
}
function message(resourceId: string, eventKey = hash(randomUUID())) { return { resourceId, eventKey } }
function request(data: ReturnType<typeof message>, customHeaders?: HeadersInit) {
  const body = JSON.stringify(data)
  return new Request('https://receiver.example.invalid/api/mercado-pago/relay', { method: 'POST', headers: customHeaders ?? relayHeaders('receiver-test', body, secret), body })
}
async function fixture() {
  const account = await prisma.mercadoPagoAccount.upsert({ where: { userId: '123' }, create: { userId: '123', label: 'Synthetic', publicKey: 'synthetic-key', access: encrypt('synthetic-access'), refresh: encrypt('synthetic-refresh'), expiresAt: new Date(Date.now() + 3600000) }, update: {} })
  const order = await prisma.order.create({ data: { fullName: 'Synthetic', email: 'synthetic@example.invalid', cpf: '00000000000', phone: '00000000000', address: {}, total: '1.00', frete: '0.00', statusPagamento: 'pending', paymentProvider: 'mercado_pago' } })
  const resourceId = 'ORD' + randomUUID().replaceAll('-', '')
  const payment = await prisma.mercadoPagoPayment.create({ data: { orderId: order.id, accountId: account.id, requestKey: randomUUID(), fingerprint: 'synthetic', method: 'pix', totalCents: 100, providerId: resourceId } })
  const snapshot = { id: resourceId, user_id: '123', external_reference: payment.id, total_amount: '1.00', country_code: 'BRA', status: 'processed', status_detail: 'accredited', transactions: { payments: [{ amount: '1.00', paid_amount: '1.00', payment_method: {} }] } }
  snapshots.set(resourceId, snapshot)
  return { account, order, payment, snapshot, resourceId }
}

test('Relay HMAC binds body, recipient, freshness and registered HTTPS destination', () => {
  const data = message('ORDSYNTHETIC'), body = JSON.stringify(data), headers = new Headers(relayHeaders('receiver-test', body, secret))
  assert.ok(authenticateRelay(headers, body, 'receiver-test', secret))
  assert.equal(authenticateRelay(headers, body + ' ', 'receiver-test', secret), null)
  assert.equal(authenticateRelay(headers, body, 'other-installation', secret), null)
  assert.equal(authenticateRelay(headers, body, 'receiver-test', secret + 'x'), null)
  assert.equal(authenticateRelay(headers, body, 'receiver-test', secret, Date.now() + 600000), null)
  for (const url of ['http://artesanaio.example.invalid/api/mercado-pago/relay', 'https://127.0.0.1/api/mercado-pago/relay', 'https://unregistered.example.invalid/api/mercado-pago/relay', 'https://artesanaio.example.invalid/other', 'https://user:pass@artesanaio.example.invalid/api/mercado-pago/relay', 'https://artesanaio.example.invalid/api/mercado-pago/relay?key=bad'])
    assert.throws(() => relayDestination(url, ['https://artesanaio.example.invalid']))
})
test('Invalid signature does not persist a nonce; signed request replay is rejected atomically', async () => {
  const data = message('ORDMISSING'), before = await prisma.mercadoPagoRelayNonce.count()
  assert.equal((await acceptRelay(request(data, { 'x-upnode-signature': 'bad' }))).status, 401)
  assert.equal(await prisma.mercadoPagoRelayNonce.count(), before)
  const headers = relayHeaders('receiver-test', JSON.stringify(data), secret)
  const results = await Promise.all([acceptRelay(request(data, headers)), acceptRelay(request(data, headers))])
  assert.deepEqual(results.map(r => r.status).sort(), [200, 409])
})
test('Duplicate and concurrent deliveries reconcile own order once and preserve late-event financial status', async () => {
  const f = await fixture(), data = message(f.resourceId)
  const results = await Promise.all([acceptRelay(request(data)), acceptRelay(request(data))])
  assert.ok(results.every(r => r.status === 200))
  assert.equal(await prisma.upnodeCommissionEntry.count({ where: { orderId: f.order.id, kind: 'commission' } }), 1)
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: f.order.id } })).statusPagamento, 'approved')
  snapshots.set(f.resourceId, { ...f.snapshot, status: 'refunded', transactions: { payments: [{ ...f.snapshot.transactions.payments[0], refunded_amount: '1.00' }] } })
  assert.equal((await acceptRelay(request(message(f.resourceId)))).status, 200)
  snapshots.set(f.resourceId, f.snapshot)
  assert.equal((await acceptRelay(request(message(f.resourceId)))).status, 200)
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: f.order.id } })).statusPagamento, 'refunded')
  assert.equal(await prisma.upnodeCommissionEntry.count({ where: { orderId: f.order.id, kind: 'credit' } }), 1)
})
test('Same seller with foreign external reference never confirms a local order', async () => {
  const f = await fixture(), foreign = 'ORD' + randomUUID().replaceAll('-', '')
  snapshots.set(foreign, { ...f.snapshot, id: foreign, external_reference: 'other-store-payment' })
  const response = await acceptRelay(request(message(foreign)))
  assert.equal(response.status, 200)
  assert.equal((await response.json()).outcome, 'ignored')
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: f.order.id } })).statusPagamento, 'pending')
  assert.equal(await prisma.upnodeCommissionEntry.count({ where: { orderId: f.order.id } }), 0)
})
test('Ownership is recovered by reference when providerId has not yet been persisted', async () => {
  const f = await fixture()
  await prisma.mercadoPagoPayment.update({ where: { id: f.payment.id }, data: { providerId: null } })
  assert.equal((await acceptRelay(request(message(f.resourceId)))).status, 200)
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: f.order.id } })).statusPagamento, 'approved')
})
test('Unavailable local provider retains retry semantics; a fresh signed delivery recovers', async () => {
  const f = await fixture(), data = message(f.resourceId)
  outage = true
  assert.equal((await acceptRelay(request(data))).status, 503)
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: f.order.id } })).statusPagamento, 'pending')
  outage = false
  assert.equal((await acceptRelay(request(data))).status, 200)
  assert.equal(await prisma.upnodeCommissionEntry.count({ where: { orderId: f.order.id, kind: 'commission' } }), 1)
})

import { acceptHubWebhook, recoverRelayHub } from '../src/core/lib/mp/relay-hub'
function originalWebhook(resourceId: string, id: string) {
  const timestamp = String(Date.now()), requestId = randomUUID()
  const signature = createHmac('sha256', process.env.MP_WEBHOOK_SECRET!).update(`id:${resourceId.toLowerCase()};request-id:${requestId};ts:${timestamp};`).digest('hex')
  return new Request('https://hub.example.invalid/api/mercado-pago/webhook?data.id=' + resourceId, { method: 'POST', headers: { 'x-request-id': requestId, 'x-signature': 'ts=' + timestamp + ',v1=' + signature }, body: JSON.stringify({ type: 'order', id, user_id: 'untrusted-routing-value', data: { id: resourceId } }) })
}
test('Hub rejects bad provider signature and refuses acknowledgement without local registry', async () => {
  process.env.MP_RELAY_HUB_ENABLED = 'true'
  process.env.MP_RELAY_ALLOWED_ORIGINS = 'https://artesanaio.example.invalid'
  process.env.MP_RELAY_KEY_ARTESANAIO = remoteSecret
  const before = await prisma.mercadoPagoRelayEvent.count()
  const bad = originalWebhook('ORDMISSING', randomUUID()); bad.headers.set('x-signature', 'invalid')
  assert.equal((await acceptHubWebhook(bad)).status, 401)
  await assert.rejects(acceptHubWebhook(originalWebhook('ORDMISSING', randomUUID())))
  assert.equal(await prisma.mercadoPagoRelayEvent.count(), before)
})
test('Hub durably queues all registered stores, retries outage and serializes competing workers', async () => {
  await prisma.mercadoPagoRelayInstallation.createMany({ data: [
    { id: 'bittup-hub', destination: 'local', secretEnv: '-', local: true },
    { id: 'artesanaio-prod', destination: 'https://artesanaio.example.invalid/api/mercado-pago/relay', secretEnv: 'MP_RELAY_KEY_ARTESANAIO' }
  ] })
  remoteOutage = true
  const f = await fixture(), id = randomUUID()
  assert.equal((await acceptHubWebhook(originalWebhook(f.resourceId, id))).status, 200)
  assert.equal(await prisma.mercadoPagoRelayEvent.count(), 1)
  assert.equal(await prisma.mercadoPagoRelayDelivery.count(), 2)
  const pending = await prisma.mercadoPagoRelayDelivery.findFirstOrThrow({ where: { installationId: 'artesanaio-prod' } })
  assert.equal(pending.status, 'pending'); assert.equal(pending.lastError, 'delivery_failed')
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: f.order.id } })).statusPagamento, 'approved')
  assert.equal((await acceptHubWebhook(originalWebhook(f.resourceId, id))).status, 200)
  assert.equal(await prisma.mercadoPagoRelayDelivery.count(), 2)
  remoteOutage = false
  await prisma.mercadoPagoRelayDelivery.update({ where: { id: pending.id }, data: { nextAttemptAt: new Date(0) } })
  const before = remoteSends
  await Promise.all([recoverRelayHub(), recoverRelayHub()])
  assert.equal(remoteSends - before, 1)
  assert.equal((await prisma.mercadoPagoRelayDelivery.findUniqueOrThrow({ where: { id: pending.id } })).status, 'delivered')
  assert.equal(await prisma.upnodeCommissionEntry.count({ where: { orderId: f.order.id, kind: 'commission' } }), 1)
})
test('Hub does not follow unregistered destinations or expose credentials in persisted error', async () => {
  await prisma.mercadoPagoRelayInstallation.update({ where: { id: 'artesanaio-prod' }, data: { destination: 'https://unregistered.example.invalid/api/mercado-pago/relay' } })
  await assert.rejects(acceptHubWebhook(originalWebhook('ORDMISSING', randomUUID())))
  assert.equal(await prisma.mercadoPagoRelayEvent.count(), 1)
})

test('Invalid verified amount remains pending and cannot create a commission', async () => {
  const f = await fixture(), data = message(f.resourceId)
  snapshots.set(f.resourceId, { ...f.snapshot, total_amount: '2.00' })
  assert.equal((await acceptRelay(request(data))).status, 503)
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: f.order.id } })).statusPagamento, 'pending')
  assert.equal(await prisma.upnodeCommissionEntry.count({ where: { orderId: f.order.id } }), 0)
  snapshots.set(f.resourceId, f.snapshot)
  assert.equal((await acceptRelay(request(data))).status, 200)
})
test('Receiver rejects unknown signed fields and disabled mode without accepting a delivery', async () => {
  const data = { ...message('ORDMISSING'), access_token: 'synthetic-forbidden-field' }, body = JSON.stringify(data)
  const req = () => new Request('https://receiver.example.invalid/api/mercado-pago/relay', { method: 'POST', headers: relayHeaders('receiver-test', body, secret), body })
  assert.equal((await acceptRelay(req())).status, 400)
  process.env.MP_RELAY_RECEIVER_ENABLED = 'false'
  assert.equal((await acceptRelay(req())).status, 404)
  process.env.MP_RELAY_RECEIVER_ENABLED = 'true'
})

test('Expired worker lease is recovered, while active leases and disabled installations are preserved', async () => {
  await prisma.mercadoPagoRelayInstallation.update({ where: { id: 'artesanaio-prod' }, data: { destination: 'https://artesanaio.example.invalid/api/mercado-pago/relay' } })
  const event = await prisma.mercadoPagoRelayEvent.create({ data: { key: hash(randomUUID()), resourceId: 'ORDLEASE' } })
  const delivery = await prisma.mercadoPagoRelayDelivery.create({ data: { eventKey: event.key, installationId: 'artesanaio-prod', nextAttemptAt: new Date(0), leaseUntil: new Date(Date.now() + 120000), leaseToken: 'synthetic-old-worker' } })
  const before = remoteSends
  await recoverRelayHub()
  assert.equal(remoteSends, before)
  await prisma.mercadoPagoRelayDelivery.update({ where: { id: delivery.id }, data: { leaseUntil: new Date(0) } })
  await prisma.mercadoPagoRelayInstallation.update({ where: { id: 'artesanaio-prod' }, data: { enabled: false } })
  await recoverRelayHub()
  assert.equal(remoteSends, before)
  await prisma.mercadoPagoRelayInstallation.update({ where: { id: 'artesanaio-prod' }, data: { enabled: true } })
  await recoverRelayHub()
  assert.equal(remoteSends, before + 1)
  const recovered = await prisma.mercadoPagoRelayDelivery.findUniqueOrThrow({ where: { id: delivery.id } })
  assert.equal(recovered.status, 'delivered'); assert.equal(recovered.leaseToken, null)
})

test('Published webhook entry preserves local Orders processing when hub flag is false or absent', async () => {
  // The react-server unit runtime cannot load the browser navigation context.
  // This public webhook never invokes page redirects; fail if it ever does.
  const { default: Module } = await import('node:module')
  const originalLoad = (Module as any)._load
  ;(Module as any)._load = function(id: string, ...args: unknown[]) {
    if (id === 'next/navigation') return { redirect() { throw Error('Unexpected page redirect') } }
    return originalLoad.call(this, id, ...args)
  }
  let POST: typeof import('../src/app/api/mercado-pago/webhook/route').POST
  try { POST = (await import('../src/app/api/mercado-pago/webhook/route')).POST }
  finally { (Module as any)._load = originalLoad }
  const { NextRequest } = await import('next/server')
  for (const value of [undefined, 'false']) {
    if (value === undefined) delete process.env.MP_RELAY_HUB_ENABLED
    else process.env.MP_RELAY_HUB_ENABLED = value
    const before = await prisma.mercadoPagoRelayEvent.count(), f = await fixture()
    const original = originalWebhook(f.resourceId, randomUUID())
    const body = await original.json(); body.user_id = '123'
    const request = new NextRequest(original.url, { method: 'POST', headers: original.headers, body: JSON.stringify(body) })
    assert.equal((await POST(request)).status, 200)
    assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: f.order.id } })).statusPagamento, 'approved')
    assert.equal(await prisma.upnodeCommissionEntry.count({ where: { orderId: f.order.id, kind: 'commission' } }), 1)
    assert.equal(await prisma.mercadoPagoRelayEvent.count(), before)
  }
})
