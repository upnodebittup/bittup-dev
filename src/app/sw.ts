/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { Serwist, NetworkOnly, NetworkFirst, CacheFirst, ExpirationPlugin, type PrecacheEntry, type SerwistGlobalConfig } from 'serwist'
import { canPrepareOfflinePath, canStoreResponse, CACHE_PREFIX, CACHE_VERSION, isPrivatePath } from '@/core/pwa/cache-policy'
declare global { interface WorkerGlobalScope extends SerwistGlobalConfig { __SW_MANIFEST: Array<PrecacheEntry | string> | undefined } }
declare const self: ServiceWorkerGlobalScope
const safeResponse = { cacheWillUpdate: async ({ response }: { response: Response }) => canStoreResponse(response) ? response : null }
function privateRequest(request: Request, url: URL) {
  if (request.method !== 'GET' || url.origin !== self.location.origin || isPrivatePath(url.pathname) || request.headers.has('authorization') || request.headers.has('rsc') || request.headers.has('next-router-prefetch')) return true
  try { return !!request.referrer && isPrivatePath(new URL(request.referrer).pathname) } catch { return true }
}
const serwist = new Serwist({
  // Precache only compiled public assets and the neutral fallback, never documents carrying sessions.
  precacheEntries: (self.__SW_MANIFEST || []).filter(entry => { const path = new URL(typeof entry === 'string' ? entry : entry.url, self.location.origin).pathname; return path === '/offline' || path.startsWith('/_next/static/') || path.startsWith('/pwa/') }),
  precacheOptions: { cleanupOutdatedCaches: true }, skipWaiting: true, clientsClaim: true, navigationPreload: true, disableDevLogs: true, cacheId: 'upnode-pwa',
  runtimeCaching: [
    { matcher: ({ request, url }) => privateRequest(request, url), handler: new NetworkOnly() },
    { matcher: ({ request, url }) => request.mode === 'navigate' && !url.search && canPrepareOfflinePath(url.pathname), handler: new NetworkFirst({ cacheName: CACHE_VERSION + '-documents', plugins: [safeResponse, new ExpirationPlugin({ maxEntries: 80, maxAgeSeconds: 86400 * 7 })] }) },
    { matcher: ({ request, url }) => url.origin === self.location.origin && ['image', 'style', 'script', 'font'].includes(request.destination) && !isPrivatePath(url.pathname), handler: new CacheFirst({ cacheName: CACHE_VERSION + '-assets', plugins: [safeResponse, new ExpirationPlugin({ maxEntries: 250, maxAgeSeconds: 86400 * 30 })] }) },
    { matcher: () => true, handler: new NetworkOnly() },
  ],
  fallbacks: { entries: [{ url: '/offline', matcher: ({ request }) => !privateRequest(request, new URL(request.url)) && request.destination === 'document' && canPrepareOfflinePath(new URL(request.url).pathname) }] },
})
// Remove caches created by the previous broad defaultCache policy, including financial documents.
const legacy = ['google-fonts-webfonts', 'google-fonts-stylesheets', 'static-font-assets', 'next-static-js-assets', 'static-audio-assets', 'static-video-assets', 'static-image-assets', 'next-image', 'static-js-assets', 'static-style-assets', 'next-data', 'static-data-assets', 'apis', 'others', 'cross-origin', 'pages', 'pages-rsc', 'pages-rsc-prefetch']
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => (key.startsWith(CACHE_PREFIX) && !key.startsWith(CACHE_VERSION)) || legacy.includes(key)).map(key => caches.delete(key))))))
serwist.addEventListeners()
