import 'server-only'
import { asaasFetch, type AsaasPayment } from '@/core/lib/asaas'
import { prisma } from '@/core/lib/prisma'
import { normalizedAsaasStatus } from '@/core/lib/commerce-security'
import { applyVerifiedPayment } from '@/core/lib/payment-security'

export async function reconcileAsaasPayment(paymentId: string) {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(paymentId)) throw new Error('Invalid payment ID')
  // Never trust the event's financial fields. A late event reads current provider state.
  const payment = await asaasFetch<AsaasPayment>('/payments/' + encodeURIComponent(paymentId), 'GET', undefined, 4_000)
  if (payment.id !== paymentId || typeof payment.customer !== 'string')
    throw new Error('Invalid provider binding')
  if (!payment.externalReference) return 'unrelated'
  const order = await prisma.order.findUnique({ where: { id: payment.externalReference } })
  // Other integrations may share the account; acknowledge those events without touching orders.
  if (!order) return 'unrelated'
  const status = normalizedAsaasStatus(payment.status)
  if (!status) return 'unsupported'
  if (!await applyVerifiedPayment(order.id, payment.value, status, payment.customer))
    throw new Error('Incompatible payment')
  return 'applied'
}

export async function processAsaasEvent(id: string, paymentId: string) {
  const outcome = await reconcileAsaasPayment(paymentId)
  await prisma.asaasWebhookEvent.update({ where: { id }, data: { processedAt: new Date(), outcome } })
  return outcome
}
