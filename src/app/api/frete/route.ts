import { withModuleApi } from '@/core/lib/module-server'
import { mutationGuard, privateJson } from '@/core/lib/request-security'
import { signShippingQuote } from '@/core/lib/commerce-security'
import { prisma } from '@/core/lib/prisma'
import { physicalQuantity } from '@/core/lib/digital-products'
// src/app/api/frete/route.ts
import { NextResponse } from 'next/server'

interface MelhorEnvioResponse {
  id: number
  name: string
  price?: string
  delivery_time?: number
  error?: string
}

async function POST(request: Request) {
  const guard = mutationGuard(request, 'shipping')
  if (guard) return guard
  if (!process.env.AUTH_JWT_SECRET) return privateJson({ error: 'Frete indisponível.' }, 503)
  try {
    const { cepDestino: inputZip, quantidade: inputQuantity, items } = await request.json()
    let quantidade = inputQuantity
    if (items !== undefined) {
      if (!Array.isArray(items) || !items.length || items.length > 100) return privateJson({ error: 'Itens inválidos.' }, 400)
      const quantities = new Map<string, number>()
      for (const item of items) {
        if (typeof item?.productId !== 'string' || !Number.isSafeInteger(item.quantity) || item.quantity <= 0) return privateJson({ error: 'Itens inválidos.' }, 400)
        const quantity = (quantities.get(item.productId) ?? 0) + item.quantity
        if (!Number.isSafeInteger(quantity)) return privateJson({ error: 'Quantidade inválida.' }, 400)
        quantities.set(item.productId, quantity)
      }
      const products = await prisma.product.findMany({ where: { id: { in: [...quantities.keys()] } }, select: { id: true, categories: { select: { slug: true } } } })
      if (products.length !== quantities.size) return privateJson({ error: 'Produto inválido.' }, 400)
      quantidade = physicalQuantity(products, quantities)
      if (quantidade === 0) return privateJson([{ id: 0, name: 'Produto digital — sem frete', price: '0.00', delivery_time: 0, requiresShipping: false, quoteToken: signShippingQuote('', 0, '0.00', 0) }])
    }
    const cepDestino = typeof inputZip === 'string' ? inputZip.replace(/\D/g, '') : ''
    if (!/^\d{8}$/.test(cepDestino) || !Number.isSafeInteger(quantidade) || quantidade <= 0) return privateJson({ error: 'CEP ou quantidade inválidos.' }, 400)
    if (!process.env.MELHOR_ENVIO_TOKEN) return privateJson({ error: 'Frete indisponível.' }, 503)

    const response = await fetch(
      'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        },
        body: JSON.stringify({
          from: { postal_code: '25935506' },
          to: { postal_code: cepDestino },
          products: [
            {
              id: '1',
              quantity: quantidade,
              weight: 0.2,
              width: 20,
              height: 5,
              length: 20,
              insurance_value: 100,
            },
          ],
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: 'Erro na API' }, { status: 400 })
    }

    // 🎯 FILTRO FINAL (PAC + SEDEX válidos)
    const resultado = data
      .filter((service: MelhorEnvioResponse) => {
        const nome = service.name?.toLowerCase() || ''

        const isPacOrSedex =
          nome === 'pac' || nome === 'sedex'

        const hasError =
          service.error &&
          service.error.includes('não atende')

        return isPacOrSedex && !hasError && !service.error && service.price && Number.isFinite(Number(service.price)) && Number(service.price) >= 0
      })
      .map((service: MelhorEnvioResponse) => ({
        id: service.id,
        name: service.name,
        price: Number(service.price).toFixed(2),
        delivery_time: service.delivery_time,
        requiresShipping: true,
        quoteToken: signShippingQuote(cepDestino, quantidade, Number(service.price).toFixed(2), service.id),
      }))

    return NextResponse.json(resultado)
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
const modulePOST = withModuleApi('/api/frete', POST)
export { modulePOST as POST }
