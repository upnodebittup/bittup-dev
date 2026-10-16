import { modulesConfig } from '@/client/config/modules.config'
import { routeEnabled } from '@/core/lib/module-config'
export const CACHE_PREFIX = 'bittup-public-v2-'
export const CACHE_VERSION = CACHE_PREFIX + JSON.stringify(modulesConfig)
export function isPrivatePath(path: string) {
  return ['/admin', '/api', '/loja', '/pedido', '/carrinho', '/checkout', '/minha-conta', '/login', '/cadastro', '/preparar-offline', '/serwist'].some(prefix => path === prefix || path.startsWith(prefix + '/'))
}
export function canPrepareOfflinePath(path: string): boolean {
  if (!modulesConfig.pwa || !path.startsWith('/') || path.startsWith('//') || /[?#]/.test(path) || isPrivatePath(path) || !routeEnabled(modulesConfig, path)) return false
  return ['/', '/sobre', '/processo', '/offline'].includes(path) || ['/servicos', '/portfolio', '/blog'].some(prefix => path === prefix || path.startsWith(prefix + '/'))
}
export function canStoreResponse(response: Response) {
  return response.status === 200 && !response.headers.has('set-cookie') && !/(private|no-store|no-cache)/i.test(response.headers.get('cache-control') || '') && !/cookie|authorization/i.test(response.headers.get('vary') || '')
}
