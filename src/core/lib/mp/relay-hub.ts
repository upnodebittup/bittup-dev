import 'server-only'
import { randomUUID } from 'node:crypto'
import { prisma } from '@/core/lib/prisma'
import { verifyMercadoPagoWebhook } from '@/core/lib/commerce-security'
import { privateJson } from '@/core/lib/request-security'
import { hash, required } from './security'
import { relayDestination, relayHeaders } from './relay-auth'
import { processRelayMessage } from './relay-receiver'
import { z } from 'zod'

export const relayHubEnabled = () => process.env.MP_RELAY_HUB_ENABLED === 'true'
export const allowedRelayOrigins = () => (process.env.MP_RELAY_ALLOWED_ORIGINS ?? '').split(',').map(s => s.trim()).filter(Boolean)
const notification = z.object({ type: z.literal('order'), id: z.union([z.string(), z.number()]).optional(),
  date_created: z.string().optional(), action: z.string().optional(), data: z.object({ id: z.string().regex(/^ORD[A-Za-z0-9_-]{1,100}$/) }) })

export async function acceptHubWebhook(request: Request) {
  if (!verifyMercadoPagoWebhook(request, required('MP_WEBHOOK_SECRET'))) return privateJson({ error: 'Assinatura inválida.' }, 401)
  const body = notification.parse(await request.json())
  if (new URL(request.url).searchParams.get('data.id') !== body.data.id) return privateJson({ error: 'Recurso divergente.' }, 400)
  const key = hash(JSON.stringify(['order', body.data.id, body.id ?? body.date_created ?? request.headers.get('x-signature'), body.action ?? '']))
  await prisma.$transaction(async tx => {
    const installations = await tx.mercadoPagoRelayInstallation.findMany({ where: { enabled: true } })
    if (installations.filter(i => i.local).length !== 1) throw new Error('Cadastro local incompleto')
    for (const i of installations) if (!i.local) relayDestination(i.destination, allowedRelayOrigins())
    await tx.mercadoPagoRelayEvent.upsert({ where: { key }, create: { key, resourceId: body.data.id }, update: {} })
    await tx.mercadoPagoRelayDelivery.createMany({ data: installations.map(i => ({ eventKey: key, installationId: i.id })), skipDuplicates: true })
  })
  // Acknowledgement depends on durable storage, not availability of a customer site.
  // A bounded first attempt keeps normal notifications prompt; the cron drains failures.
  try { await recoverRelayHub(2) } catch { /* durable deliveries remain pending */ }
  return privateJson({ received: true })
}

export async function recoverRelayHub(limit = 10) {
  if (!relayHubEnabled()) return { delivered: 0, failed: 0 }
  const now = new Date(), deadline = Date.now() + 60000
  const pending = await prisma.mercadoPagoRelayDelivery.findMany({ where: { status: 'pending', nextAttemptAt: { lte: now },
    OR: [{ leaseUntil: null }, { leaseUntil: { lt: now } }], installation: { enabled: true } },
    orderBy: { nextAttemptAt: 'asc' }, take: limit, select: { id: true } })
  let delivered = 0, failed = 0
  for (const row of pending) {
    if (Date.now() > deadline) break
    const leaseToken = randomUUID(), claimTime = new Date()
    const claim = await prisma.mercadoPagoRelayDelivery.updateMany({ where: { id: row.id, status: 'pending', nextAttemptAt: { lte: claimTime },
      OR: [{ leaseUntil: null }, { leaseUntil: { lt: claimTime } }] },
      data: { leaseToken, leaseUntil: new Date(Date.now() + 120000), attempts: { increment: 1 } } })
    if (!claim.count) continue
    const delivery = await prisma.mercadoPagoRelayDelivery.findUniqueOrThrow({ where: { id: row.id }, include: { installation: true, event: true } })
    try {
      const message = { eventKey: delivery.eventKey, resourceId: delivery.event.resourceId }
      let outcome: string
      if (!delivery.installation.enabled) throw new Error('Instalação desativada')
      if (delivery.installation.local) outcome = await processRelayMessage(message)
      else {
        const destination = relayDestination(delivery.installation.destination, allowedRelayOrigins())
        if (!/^MP_RELAY_KEY_[A-Z0-9_]+$/.test(delivery.installation.secretEnv)) throw new Error('Chave inválida')
        const body = JSON.stringify(message)
        const response = await fetch(destination, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(8000), cache: 'no-store',
          headers: relayHeaders(delivery.installation.id, body, required(delivery.installation.secretEnv)), body })
        if (!response.ok) throw new Error('Destino indisponível')
        const result = z.object({ outcome: z.enum(['processed', 'ignored']) }).parse(await response.json())
        outcome = result.outcome
      }
      await prisma.mercadoPagoRelayDelivery.updateMany({ where: { id: row.id, leaseToken },
        data: { status: 'delivered', outcome, deliveredAt: new Date(), leaseUntil: null, leaseToken: null, lastError: null } })
      delivered++
    } catch {
      // No provider bodies, URLs, signatures, account data or credentials in logs/errors.
      await prisma.mercadoPagoRelayDelivery.updateMany({ where: { id: row.id, leaseToken }, data: { leaseUntil: null, leaseToken: null,
        lastError: 'delivery_failed', nextAttemptAt: new Date(Date.now() + Math.min(3600000, 30000 * 2 ** Math.min(delivery.attempts, 7))) } })
      failed++
    }
  }
  await prisma.mercadoPagoRelayNonce.deleteMany({ where: { expiresAt: { lt: new Date() } } })
  return { delivered, failed }
}
