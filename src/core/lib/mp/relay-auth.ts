import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { isIP } from 'node:net'
import { z } from 'zod'

export const relayPath = '/api/mercado-pago/relay'
export const relayMessage = z.object({ eventKey: z.string().regex(/^[a-f0-9]{64}$/), resourceId: z.string().regex(/^ORD[A-Za-z0-9_-]{1,100}$/) }).strict()
export type RelayMessage = z.infer<typeof relayMessage>
export function relayId(value: string) {
  if (!/^[a-z0-9_-]{3,80}$/.test(value)) throw new Error('Identidade de instalação inválida')
  return value
}
export function relaySecret(value: string | undefined) {
  if (!value || value.length < 43) throw new Error('Segredo de entrega não configurado')
  return value
}
export function relayDestination(value: string, allowedOrigins: string[]) {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash ||
      url.pathname !== relayPath || isIP(url.hostname) || url.hostname.includes(':') ||
      !url.hostname.includes('.') || /\.(localhost|local|internal)$/.test(url.hostname) ||
      !allowedOrigins.includes(url.origin)) throw new Error('Destino não autorizado')
  return url.toString()
}
function manifest(recipient: string, timestamp: string, nonce: string, body: string) {
  return JSON.stringify(['upnode-mp-relay-v1', 'POST', relayPath, recipient, timestamp, nonce, body])
}
export function relayHeaders(recipient: string, body: string, secret: string, now = Date.now()) {
  relayId(recipient); relaySecret(secret)
  const timestamp = String(now), nonce = randomUUID()
  return { 'content-type': 'application/json', 'x-upnode-recipient': recipient, 'x-upnode-timestamp': timestamp,
    'x-upnode-nonce': nonce, 'x-upnode-signature': createHmac('sha256', secret).update(manifest(recipient, timestamp, nonce, body)).digest('hex') }
}
export function authenticateRelay(headers: Headers, body: string, recipient: string, secret: string, now = Date.now()) {
  relayId(recipient); relaySecret(secret)
  const timestamp = headers.get('x-upnode-timestamp') ?? '', nonce = headers.get('x-upnode-nonce') ?? ''
  const signature = headers.get('x-upnode-signature') ?? ''
  if (headers.get('x-upnode-recipient') !== recipient || !/^\d{13}$/.test(timestamp) ||
      Math.abs(now - Number(timestamp)) > 300000 || !/^[a-f0-9-]{36}$/.test(nonce) || !/^[a-f0-9]{64}$/.test(signature)) return null
  const expected = createHmac('sha256', secret).update(manifest(recipient, timestamp, nonce, body)).digest()
  if (!timingSafeEqual(expected, Buffer.from(signature, 'hex'))) return null
  return { nonce, expiresAt: new Date(now + 600000) }
}
