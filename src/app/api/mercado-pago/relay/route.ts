import { acceptRelay } from '@/core/lib/mp/relay-receiver'
import { privateJson } from '@/core/lib/request-security'
export const runtime = 'nodejs'
export const maxDuration = 90
export async function POST(request: Request) {
  try { return await acceptRelay(request) }
  catch { return privateJson({ error: 'Entrega inválida ou indisponível.' }, 503) }
}
