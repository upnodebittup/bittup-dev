import { withModuleApi } from '@/core/lib/module-server'
import { NextRequest } from 'next/server'
import { safeEqual } from '@/core/lib/commerce-security'
import { processAsaasEvent } from '@/core/lib/asaas-reconciliation'
import { prisma } from '@/core/lib/prisma'
import { privateJson } from '@/core/lib/request-security'
export const runtime = 'nodejs'
export const maxDuration = 15
async function POST(req: NextRequest) {
  const secret = process.env.ASAAS_WEBHOOK_TOKEN
  const header = req.headers.get('asaas-access-token')
  if (!secret) return privateJson({ error: 'Webhook não configurado.' }, 503)
  if (!header || !safeEqual(header, secret)) return privateJson({ error: 'Notificação não autorizada.' }, 401)
  const body = await req.json().catch(() => null)
  if (!body || typeof body.event !== 'string') return privateJson({ error: 'Notificação inválida.' }, 400)
  if (!body.event.startsWith('PAYMENT_')) return privateJson({ status: 'ignored' })
  const validId = (id: unknown): id is string => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(id)
  // Event IDs are opaque: official examples contain '&', unlike payment IDs.
  if (typeof body.id !== 'string' || !/^[\x21-\x7e]{1,255}$/.test(body.id) ||
      !validId(body.payment?.id) || !/^PAYMENT_[A-Z_]{1,100}$/.test(body.event))
    return privateJson({ error: 'Notificação inválida.' }, 400)
  let stage = 'persist'
  try {
    // Unique provider event ID persists before any remote I/O. No background promise in serverless.
    const receipt = await prisma.asaasWebhookEvent.upsert({
      where: { id: body.id }, update: {},
      create: { id: body.id, event: body.event, paymentId: body.payment.id },
    })
    if (receipt.paymentId !== body.payment.id || receipt.event !== body.event)
      return privateJson({ error: 'Evento incompatível.' }, 409)
    if (receipt.processedAt) return privateJson({ success: true })
    stage = 'process'
    const outcome = await processAsaasEvent(receipt.id, receipt.paymentId)
    console.info({ operation: 'asaas-webhook', outcome })
    return privateJson({ success: true })
  } catch {
    console.error({ operation: 'asaas-webhook', stage, outcome: 'retry' })
    // Keep the receipt pending; provider retries or the manual recovery command can process it.
    return privateJson({ error: 'Não foi possível confirmar a notificação.' }, 503)
  }
}
const modulePOST = withModuleApi('/api/asaas/webhook', POST)
export { modulePOST as POST }
