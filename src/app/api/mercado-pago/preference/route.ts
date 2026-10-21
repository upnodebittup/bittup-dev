import { withModuleApi } from '@/core/lib/module-server'
import { privateJson } from '@/core/lib/request-security'
// Historical webhooks remain supported. New Checkout Pro sessions are retired.
export const POST = withModuleApi('/api/mercado-pago/preference', async () =>
  privateJson({ error: 'Utilize o checkout transparente do pedido.' }, 410))
