'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import MercadoPagoPayment from '@/core/components/payment/MercadoPagoPayment'
import { Loader2 } from 'lucide-react'

interface Order {
  paymentProvider?: string
  id: string
  total: number
  frete: number
  customerId?: string | null
  fullName: string
  email: string
  cpf: string
  phone: string
  address: Record<string, unknown>
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}


export default function PagamentoPage() {
  const params = useParams()
  const orderId = params?.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar dados do pedido
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Pedido não encontrado')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (!res.ok) throw new Error('Pedido não encontrado')

        const data = await res.json()
        setOrder(data)
      } catch (err) {
        console.error('Erro ao buscar pedido:', err)
        setError('Erro ao carregar pedido')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto py-10 px-4 min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Carregando...</span>
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="max-w-2xl mx-auto py-10 px-4 min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
        <a href="/loja/meus-pedidos" className="text-white hover:underline mb-4 inline-block">
          ← Voltar aos meus pedidos
        </a>
        <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
          {error || 'Pedido não encontrado'}
        </div>
      </main>
    )
  }

  const totalProdutos = order.items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
  const totalGeral = totalProdutos + Number(order.frete)

  return (
    <main className="max-w-2xl mx-auto py-10 px-4 min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <a href={`/loja/pedido/${orderId}`} className="text-white hover:underline mb-4 inline-block">
        ← Voltar ao pedido
      </a>

      <div className="grid md:grid-cols-3 gap-6">
        {/* FORMULÁRIO DE PAGAMENTO */}
        <div className="md:col-span-2">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
            <h1 className="text-2xl font-bold mb-6">Pagamento do Pedido</h1>

            {/* SELETOR DE MÉTODO */}
            {order.paymentProvider === 'mercado_pago' ? <MercadoPagoPayment orderId={order.id} total={totalGeral} email={order.email} /> : <p>Este pedido utiliza uma integração descontinuada. Entre em contato com a loja para continuar.</p>}
          </div>
        </div>

        {/* RESUMO DO PEDIDO */}
        <div>
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

            <div className="space-y-3 text-sm">
              {/* ITEMS */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-[var(--color-text-secondary)]">
                    <span>{item.quantity}x {item.name}</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr className="border-[var(--color-border)]" />

              {/* TOTAIS */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Subtotal:</span>
                  <span className="text-[var(--color-text-primary)] font-medium">R$ {Number(totalProdutos.toFixed(2))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Frete:</span>
                  <span className="text-[var(--color-text-primary)] font-medium">R$ {Number(order.frete).toFixed(2)}</span>
                </div>
              </div>

              <hr className="border-[var(--color-border)]" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-white">R$ {Number(totalGeral.toFixed(2))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
