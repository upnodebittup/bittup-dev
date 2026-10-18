import { withModuleApi } from '@/core/lib/module-server'
import { NextRequest } from 'next/server'
import { asaasFetch, AsaasError, logAsaasFailure, type AsaasCustomer } from '@/core/lib/asaas'
import { prisma } from '@/core/lib/prisma'
import { canAccessOrder } from '@/core/lib/order-access'
import { mutationGuard, privateJson } from '@/core/lib/request-security'

export const runtime = 'nodejs'
export const maxDuration = 120
async function POST(req: NextRequest) {
  const guard = mutationGuard(req, 'asaas-customer')
  if (guard) return guard
  const body = await req.json().catch(() => null)
  let stage = 'authorization'
  try {
    if (typeof body?.orderId !== 'string' || !await canAccessOrder(body.orderId)) return privateJson({ error: 'Pedido não encontrado.' }, 404)
    stage = 'database'
    const customerId = await prisma.$transaction(async tx => {
      // Serialize concurrent customer creation for the same order, across instances.
      await tx.$queryRaw`SELECT id FROM "Order" WHERE id = ${body.orderId} FOR UPDATE`
      const order = await tx.order.findUnique({ where: { id: body.orderId } })
      if (!order) throw new Error('Missing order')
      if (order.paymentProvider === 'mercado_pago') throw new Error('Outro provedor')
      if (order.customerId) return order.customerId
      const address = order.address as Record<string, string>
      stage = 'customer-lookup'
      // Reconcile a previous timeout/rollback using this order, never arbitrary CPF matches.
      const existing = await asaasFetch<{ data: Array<AsaasCustomer & { externalReference?: string; deleted?: boolean }>; hasMore: boolean }>(
        '/customers?externalReference=' + encodeURIComponent(order.id) + '&limit=100', 'GET', undefined, 15_000)
      if (!Array.isArray(existing?.data) || typeof existing.hasMore !== 'boolean' || existing.hasMore || existing.data.length > 1)
        throw new AsaasError('invalid_response')
      const found = existing.data[0]
      if (existing.data.length && (!found || typeof found !== 'object')) throw new AsaasError('invalid_response')
      if (found && (!found.id || found.deleted || found.externalReference !== order.id ||
        found.cpfCnpj?.replace(/\D/g, '') !== order.cpf.replace(/\D/g, '') ||
        found.email?.trim().toLowerCase() !== order.email.trim().toLowerCase())) throw new AsaasError('invalid_response')
      stage = 'customer-create'
      const customer = found || await asaasFetch<AsaasCustomer>('/customers', 'POST', {
        name: order.fullName, email: order.email, cpfCnpj: order.cpf.replace(/\D/g, ''),
        mobilePhone: order.phone.replace(/\D/g, ''), address: address.street,
        addressNumber: address.number, province: address.neighborhood,
        postalCode: address.zipCode.replace(/\D/g, ''), externalReference: order.id,
      })
      if (!customer?.id || typeof customer.id !== 'string') throw new AsaasError('invalid_response')
      stage = 'database-save'
      await tx.order.update({ where: { id: order.id }, data: { customerId: customer.id } })
      return customer.id
    }, { timeout: 90_000 })
    return privateJson({ success: true, customerId })
  } catch (error) {
    logAsaasFailure('customer', error, stage)
    return privateJson({ error: 'Não foi possível cadastrar o pagador.' }, 502)
  }
}

const modulePOST = withModuleApi('/api/asaas/create-customer', POST)
export { modulePOST as POST }
