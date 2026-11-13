import 'server-only'
import { prisma } from '@/core/lib/prisma'
import { privateJson } from '@/core/lib/request-security'
import { accessFor, readOrder, MpHttpError } from './client'
import { hash } from './security'
import { processEvent } from './webhooks'
import { authenticateRelay, relayMessage, type RelayMessage } from './relay-auth'

// Neither a seller ID nor a forwarded status is evidence of ownership.
// Resolve against historical payment/account bindings and the authenticated Orders API.
export async function processRelayMessage(message: RelayMessage): Promise<'processed' | 'ignored'> {
  const key = hash('upnode-relay:' + message.eventKey)
  const prior = await prisma.mercadoPagoWebhookEvent.findUnique({ where: { key } })
  if (prior) {
    if (prior.resourceId !== message.resourceId) throw new Error('Evento divergente')
    if (prior.status !== 'processed') await processEvent(key)
    return 'processed'
  }
  const payment = await prisma.mercadoPagoPayment.findUnique({ where: { providerId: message.resourceId } })
  const accounts = payment
    ? [await prisma.mercadoPagoAccount.findUniqueOrThrow({ where: { id: payment.accountId } })]
    : await prisma.mercadoPagoAccount.findMany({ orderBy: { createdAt: 'asc' } })
  let unavailable = false
  for (const account of accounts) {
    if (!account.access) { unavailable = true; continue }
    try {
      const snapshot = await readOrder(message.resourceId, await accessFor(account.id))
      if (snapshot.id !== message.resourceId || snapshot.user_id !== account.userId) throw new Error('Conta divergente')
      const own = await prisma.mercadoPagoPayment.findUnique({ where: { id: snapshot.external_reference } })
      if (!own || own.accountId !== account.id || (own.providerId && own.providerId !== snapshot.id)) continue
      await prisma.mercadoPagoWebhookEvent.createMany({ data: [{ key, resourceId: snapshot.id, userId: account.userId }], skipDuplicates: true })
      await processEvent(key)
      return 'processed'
    } catch (error) {
      if (!payment && error instanceof MpHttpError && error.status === 404) continue
      unavailable = true
    }
  }
  if (unavailable || payment) throw new Error('Verificação local pendente')
  return 'ignored'
}

export async function acceptRelay(request: Request) {
  if (process.env.MP_RELAY_RECEIVER_ENABLED !== 'true') return privateJson({ error: 'Não encontrado.' }, 404)
  if (Number(request.headers.get('content-length') ?? 0) > 2048) return privateJson({ error: 'Mensagem inválida.' }, 413)
  const body = await request.text()
  if (Buffer.byteLength(body) > 2048) return privateJson({ error: 'Mensagem inválida.' }, 413)
  const auth = authenticateRelay(request.headers, body, process.env.MP_RELAY_INSTANCE_ID ?? '', process.env.MP_RELAY_SHARED_SECRET ?? '')
  if (!auth) return privateJson({ error: 'Entrega não autorizada.' }, 401)
  let json: unknown
  try { json = JSON.parse(body) } catch { return privateJson({ error: 'Mensagem inválida.' }, 400) }
  const parsed = relayMessage.safeParse(json)
  if (!parsed.success) return privateJson({ error: 'Mensagem inválida.' }, 400)
  await prisma.mercadoPagoRelayNonce.deleteMany({ where: { expiresAt: { lt: new Date() } } })
  // Atomic uniqueness is the replay barrier, including concurrent requests.
  const inserted = await prisma.mercadoPagoRelayNonce.createMany({ data: [auth], skipDuplicates: true })
  if (inserted.count !== 1) return privateJson({ error: 'Entrega repetida.' }, 409)
  try { return privateJson({ outcome: await processRelayMessage(parsed.data) }) }
  catch { return privateJson({ error: 'Entrega pendente de recuperação.' }, 503) }
}
