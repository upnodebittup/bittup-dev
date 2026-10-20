import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { createHmac } from 'node:crypto'
const require = createRequire(import.meta.url)
const ts = require('typescript')
const jwt = require('jsonwebtoken')
const { NextRequest } = require('next/server')
const { Decimal } = require('@prisma/client/runtime/client')
const root = path.resolve(import.meta.dirname, '..')
// No dotenv, database client or real provider is loaded by this harness.
process.env.AUTH_JWT_SECRET = 'synthetic-test-secret-with-at-least-32-characters'
process.env.MERCADO_PAGO_WEBHOOK_SECRET = 'synthetic-mp-webhook-secret'
process.env.MP_CLIENT_ID = 'synthetic-client'
process.env.MP_CLIENT_SECRET = 'synthetic-secret'
process.env.MP_TOKEN_ENCRYPTION_KEY = 'a'.repeat(64)
process.env.MP_BASE_URL = 'https://shop.example.invalid'
process.env.MP_WEBHOOK_SECRET = 'synthetic-webhook'
process.env.MP_PAYMENTS_ENABLED = 'true'
process.env.MP_ENVIRONMENT = 'test'
process.env.MP_WEBHOOK_CONFIGURED = 'true'
process.env.MERCADO_PAGO_ACCESS_TOKEN = 'synthetic-access-token'
process.env.NEXT_PUBLIC_SITE_URL = 'https://shop.example.invalid'
let cookieJar = new Map(), db = {}, provider = async () => { throw new Error('Unexpected provider call') }
globalThis.fetch = async () => { throw new Error('Real network disabled in security tests') }
let cache = new Map(), ip = 0, configOverride = null, contentOverride = null, seoOverride = null, siteOverride = null
function load(relative) {
  let file = path.resolve(root, relative)
  if (!fs.existsSync(file) && file.endsWith('.ts')) { const stem=file.slice(0,-3);file=fs.existsSync(stem+'.tsx')?stem+'.tsx':path.join(stem,'index.ts') }
  if (cache.has(file)) return cache.get(file).exports
  const module = { exports: {} }; cache.set(file, module)
  const source = fs.readFileSync(file, 'utf8')
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText
  const localRequire = name => {
    if (name === '@/client/config/seo.config' && seoOverride) return { seoConfig: seoOverride }
    if (name === '@/client/config/site.config' && siteOverride) return { siteConfig: siteOverride }
    if (name === '@/client/config/modules.config' && configOverride) return { modulesConfig: configOverride }
    if (name === '@/client/config/content.config' && contentOverride) return contentOverride
    if (name === 'next/image') return { __esModule: true, default: () => null }
    if (name === 'server-only') return {}
    if (name === 'next/navigation') return { notFound: () => { throw new Error('NEXT_NOT_FOUND') }, usePathname: () => '/', useRouter: () => ({ push() {} }) }
    if (name === '@/core/lib/prisma') return { prisma: db, default: db }
    if (name === '@/generated/client') return { Prisma: { Decimal, PrismaClientKnownRequestError: class extends Error {} } }
    if (name === 'next/headers') return { cookies: async () => ({ get: name => cookieJar.has(name) ? { value: cookieJar.get(name) } : undefined }) }
    if (name === '@/core/lib/cloudinary') return { uploadFilesToCloudinary: () => { throw new Error('Unexpected upload') } }
    if (name.startsWith('@/')) return load('src/' + name.slice(2) + '.ts')
    if (name.startsWith('.')) return load(path.relative(root, path.resolve(path.dirname(file), name)) + '.ts')
    return require(name)
  }
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(localRequire, module, module.exports)
  return module.exports
}
function reset() { cache = new Map(); cookieJar = new Map(); db = {}; configOverride = null; contentOverride = null; seoOverride = null; siteOverride = null; provider = async () => { throw new Error('Unexpected provider call') } }
function request(url, method = 'GET', body, headers = {}) {
  return new NextRequest('https://shop.example.invalid' + url, { method,
    headers: { 'content-type': 'application/json', 'x-forwarded-for': 'test-' + ++ip, ...headers },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }) })
}
const order = () => ({ id: 'order-one', email: 'buyer@example.invalid', cpf: '00000000000',
  fullName: 'Synthetic Buyer', phone: '00000000000', customerId: 'cus_test',
  address: { street: 'Synthetic Street', number: '1', neighborhood: 'Test', city: 'Test', state: 'SP', zipCode: '00000000' },
  total: new Decimal('20.00'), frete: new Decimal('5.00'), statusPagamento: 'pending',
  items: [{ productId: 'product-one', name: 'Synthetic product', price: new Decimal('10'), quantity: 2 }] })
function grant(id = 'order-one') { cookieJar.set('order_access', jwt.sign({ orders: [id] }, process.env.AUTH_JWT_SECRET, { audience: 'order-access', expiresIn: '1h' })) }

test('admin rejects absent, forged, expired, wrong algorithm and non-admin tokens', async () => {
  reset(); const { authenticateAdmin } = load('src/core/lib/admin-access.ts')
  db.adminUser = { findUnique: async () => ({ id: 'admin-one', email: 'admin@example.invalid', role: 'admin' }) }
  assert.equal((await authenticateAdmin(undefined)).status, 401)
  assert.equal((await authenticateAdmin('forged')).status, 401)
  const claims = { id: 'admin-one', email: 'admin@example.invalid', role: 'admin' }
  assert.equal((await authenticateAdmin(jwt.sign(claims, process.env.AUTH_JWT_SECRET, { expiresIn: -1 }))).status, 401)
  assert.equal((await authenticateAdmin(jwt.sign(claims, process.env.AUTH_JWT_SECRET, { algorithm: 'HS384', expiresIn: '1h' }))).status, 401)
  assert.equal((await authenticateAdmin(jwt.sign({ ...claims, role: 'buyer' }, process.env.AUTH_JWT_SECRET, { expiresIn: '1h' }))).status, 403)
  const token = jwt.sign(claims, process.env.AUTH_JWT_SECRET, { expiresIn: '1h' })
  assert.equal((await authenticateAdmin(token)).status, 200)
  db.adminUser.findUnique = async () => null
  assert.equal((await authenticateAdmin(token)).status, 401)
})

test('all admin APIs, product creation, uploads, client accounts and diagnostic deny anonymous requests', async () => {
  reset()
  const paths = ['admin/products', 'admin/products/[id]', 'admin/orders', 'admin/pages/[id]', 'admin/blog/posts',
    'admin/blog/posts/[id]', 'admin/blog/categories', 'admin/blog/categories/[id]', 'products', 'cloudinary/upload']
  for (const route of paths) {
    const api = load('src/app/api/' + route + '/route.ts')
    for (const method of ['GET', 'POST', 'PATCH', 'DELETE']) {
      if (!api[method] || (route === 'products' && method === 'GET')) continue
      const response = await api[method](request('/api/' + route, method, method === 'GET' ? undefined : {}), { params: Promise.resolve({ id: 'test' }) })
      assert.equal(response.status, 401, route + ' ' + method)
      assert.equal(response.headers.get('cache-control'), 'private, no-store')
    }
  }
})

test('withAdmin allows a real admin and rejects cross-site writes', async () => {
  reset(); db.adminUser = { findUnique: async () => ({ id: 'a', email: 'a@example.invalid', role: 'admin' }) }
  const token = jwt.sign({ id: 'a', email: 'a@example.invalid', role: 'admin' }, process.env.AUTH_JWT_SECRET, { expiresIn: '1h' })
  const { withAdmin } = load('src/core/lib/admin-access.ts')
  const secured = withAdmin(async () => new Response('ok'))
  assert.equal((await secured(request('/api/admin/products', 'POST', {}, { cookie: 'auth_token=' + token }))).status, 200)
  assert.equal((await secured(request('/api/admin/products', 'POST', {}, { cookie: 'auth_token=' + token, origin: 'https://evil.example.invalid' }))).status, 403)
})

test('email + CPF returns summaries and grants matching orders only, including over 20 results', async () => {
  reset(); const one = order(); let query
  db.order = { findMany: async input => { query = input; return Array.from({ length: 25 }, (_, i) => ({ id: 'found-' + i, total: '20', statusPagamento: 'pending', createdAt: new Date() })) },
    findUnique: async ({ where }) => where.id === 'unrelated' ? { email: 'other@example.invalid', cpf: '11111111111' } : one }
  const api = load('src/app/api/orders/find/route.ts')
  const response = await api.POST(request('/api/orders/find', 'POST', { email: 'BUYER@example.invalid', cpf: '000.000.000-00' }))
  assert.equal(response.status, 200); assert.equal((await response.json()).length, 25)
  assert.equal(query.where.email.mode, 'insensitive'); assert.equal(query.where.cpf.in[0], '00000000000')
  cookieJar.set('order_access', response.cookies.get('order_access').value)
  const access = load('src/core/lib/order-access.ts')
  assert.equal(await access.canAccessOrder('found-0'), true)
  assert.equal(await access.canAccessOrder('unrelated'), false)
  const empty = await api.POST(request('/api/orders/find', 'POST', { email: '', cpf: 'x' }))
  assert.equal(empty.status, 400)
})

test('no results replace previous grants; expired or wrong-audience cookies deny access', async () => {
  reset(); grant(); db.order = { findMany: async () => [] }
  const api = load('src/app/api/orders/find/route.ts')
  const response = await api.POST(request('/api/orders/find', 'POST', { email: 'nobody@example.invalid', cpf: '00000000000' }))
  cookieJar.set('order_access', response.cookies.get('order_access').value)
  const { canAccessOrder } = load('src/core/lib/order-access.ts')
  assert.equal(await canAccessOrder('order-one'), false)
  for (const options of [{ audience: 'order-access', expiresIn: -1 }, { audience: 'other', expiresIn: '1h' }]) {
    cookieJar.set('order_access', jwt.sign({ orders: ['order-one'] }, process.env.AUTH_JWT_SECRET, options))
    assert.equal(await canAccessOrder('order-one'), false)
  }
})

test('order list, direct ID, legacy ID lookup and PATCH deny unauthorized requests without DB reads', async () => {
  reset(); const api = load('src/app/api/orders/[id]/route.ts')
  assert.equal((await api.GET(request('/api/orders/order-one'), { params: Promise.resolve({ id: 'order-one' }) })).status, 404)
  assert.equal((await api.PATCH(request('/api/orders/order-one', 'PATCH', { statusPagamento: 'approved', total: 1 }))).status, 403)
  assert.equal((await load('src/app/api/orders/route.ts').GET(request('/api/orders'))).status, 401)
  assert.equal((await load('src/app/api/orders/find/route.ts').GET(request('/api/orders/find?orderId=order-one'))).status, 404)
  grant(); db.order = { findUnique: async () => order() }
  const response = await api.GET(request('/api/orders/order-one'), { params: Promise.resolve({ id: 'order-one' }) })
  assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'private, no-store')
})

test('signed shipping rejects tampering, different CEP, quantities and expired quotes', () => {
  reset(); const security = load('src/core/lib/commerce-security.ts')
  const token = security.signShippingQuote('00000000', 2, '5.00', 1)
  assert.equal(security.verifyShippingQuote(token, '00000000', 2, 5), 5)
  assert.throws(() => security.verifyShippingQuote(token, '00000000', 2, 0))
  assert.throws(() => security.verifyShippingQuote(token, '11111111', 2, 5))
  assert.throws(() => security.verifyShippingQuote(token, '00000000', 3, 5))
  assert.throws(() => security.verifyShippingQuote(token + 'x', '00000000', 2, 5))
})

test('checkout rejects nonpositive/fractional quantity and ignores browser prices; reserves aggregate stock', async () => {
  reset(); const security = load('src/core/lib/commerce-security.ts'); const api = load('src/app/api/orders/route.ts')
  const item = { productId: 'product-one', quantity: 1, price: 0.01, size: { name: '' }, color: { name: '' } }
  const buyer = order(); let saved, reserve
  const product = { id: item.productId, name: 'Server product', price: new Decimal('10'), stock: 2, colors: [], sizes: [], categories: [] }
  const tx = { $executeRaw: async()=>0, paymentSettings: {findUnique:async()=>({account:{access:'synthetic',confirmedAt:new Date()}})}, product: { findMany: async () => [product], updateMany: async input => { reserve = input; return { count: 1 } } },
    order: { create: async ({ data }) => { saved = data; return { id: 'new-order' } } } }
  db.$transaction = async fn => fn(tx)
  const body = { ...buyer, items: [item, item], frete: 5, quoteToken: security.signShippingQuote('00000000', 2, '5.00', 1) }
  for (const quantity of [0, -1, 1.5]) assert.equal((await api.POST(request('/api/orders', 'POST', { ...body, items: [{ ...item, quantity }] }))).status, 400)
  const response = await api.POST(request('/api/orders', 'POST', body))
  assert.equal(response.status, 200); assert.equal(String(saved.total), '20'); assert.equal(saved.statusPagamento, 'pending')
  assert.equal(reserve.where.stock.gte, 2); assert.equal(reserve.data.stock.decrement, 2)
  assert.ok(response.cookies.get('order_access'))
  tx.product.updateMany = async () => ({ count: 0 })
  assert.equal((await api.POST(request('/api/orders', 'POST', body))).status, 400)
})

test('legacy Checkout Pro cannot create new charges', async () => {
  reset(); grant(); let calls=0
  globalThis.fetch = async () => { calls++; throw Error('No Checkout Pro') }
  const api = load('src/app/api/mercado-pago/preference/route.ts')
  assert.equal((await api.POST(request('/api/mercado-pago/preference', 'POST', { orderId: 'order-one' }))).status, 410)
  assert.equal(calls,0)
})

test('Mercado Pago uses official manifest signature, checks currency/value and ignores redelivery', async () => {
  reset(); const current = order(); let updates = 0
  db.order = { findUnique: async () => current, updateMany: async ({ data }) => { updates++; current.statusPagamento = data.statusPagamento; return { count: 1 } } }
  globalThis.fetch = async () => Response.json({ id: 123, status: 'approved', external_reference: current.id, transaction_amount: 25, currency_id: 'BRL' })
  const api = load('src/app/api/mercado-pago/webhook/route.ts')
  const tsValue = '1742505638683', requestId = 'synthetic-request'
  const signature = createHmac('sha256', process.env.MERCADO_PAGO_WEBHOOK_SECRET).update(`id:123;request-id:${requestId};ts:${tsValue};`).digest('hex')
  const headers = { 'x-signature': `ts=${tsValue},v1=${signature}`, 'x-request-id': requestId }
  const body = { type: 'payment', data: { id: '123' } }
  assert.equal((await api.POST(request('/api/mercado-pago/webhook?data.id=123', 'POST', body))).status, 401)
  for (let i = 0; i < 2; i++) assert.equal((await api.POST(request('/api/mercado-pago/webhook?data.id=123', 'POST', body, headers))).status, 200)
  assert.equal(updates, 1)
  assert.equal((await api.POST(request('/api/mercado-pago/webhook?data.id=999', 'POST', body, headers))).status, 401)
})

test('lookup abuse limiter and cross-origin writes do not require an external service', () => {
  reset(); const { allowAttempt, mutationGuard } = load('src/core/lib/request-security.ts')
  assert.equal(allowAttempt('synthetic-limit', 2), true); assert.equal(allowAttempt('synthetic-limit', 2), true)
  assert.equal(allowAttempt('synthetic-limit', 2), false)
  assert.equal(mutationGuard(request('/api/orders/find', 'POST', {}, { origin: 'https://evil.example.invalid' }), 'lookup').status, 403)
})

test('legitimate login issues admin cookie; wrong password and non-admin role are rejected', async () => {
  reset(); const bcrypt = require('bcryptjs')
  const user = { id: 'a', email: 'admin@example.invalid', role: 'admin', passwordHash: await bcrypt.hash('synthetic-password', 4) }
  db.adminUser = { findFirst: async () => user, findUnique: async () => user }
  db.accessLog = { create: async () => ({}) }
  const api = load('src/app/api/auth/login/route.ts')
  const response = await api.POST(request('/api/auth/login', 'POST', { email: user.email, password: 'synthetic-password' }))
  assert.equal(response.status, 200); assert.ok(response.cookies.get('auth_token'))
  assert.equal((await api.POST(request('/api/auth/login', 'POST', { email: user.email, password: 'wrong' }))).status, 401)
  user.role = 'buyer'
  assert.equal((await api.POST(request('/api/auth/login', 'POST', { email: user.email, password: 'synthetic-password' }))).status, 401)
})

test('disabled commerce APIs return 404 before parsing input, database/authentication or providers', async () => {
  reset(); configOverride = { store: { enabled: false }, blog: true, portfolio: false, services: false, pwa: false }
  const paths = ['products', 'categorias', 'orders', 'orders/[id]', 'orders/find', 'frete',
    'mercado-pago/preference', 'mercado-pago/webhook']
  for (const path of paths) {
    const api = load('src/app/api/' + path + '/route.ts')
    for (const method of ['GET', 'POST', 'PATCH', 'DELETE']) if (api[method]) {
      const req = new NextRequest('https://shop.example.invalid/api/' + path, { method,
        ...(method === 'GET' ? {} : { body: '{invalid-json' }) })
      const response = await api[method](req, { params: Promise.resolve({ id: 'test' }) })
      assert.equal(response.status, 404, path + ' ' + method); assert.equal(response.headers.get('cache-control'), 'no-store')
    }
  }
  assert.equal((await load('src/app/api/admin/products/route.ts').POST(request('/api/admin/products', 'POST', {}))).status, 404)
  assert.equal((await load('src/app/api/admin/orders/route.ts').GET(request('/api/admin/orders'))).status, 401)
})

test('blog switch blocks public pages and CMS mutations, retaining authenticated history reads', async () => {
  reset(); configOverride = { store: { enabled: true, checkout: true }, blog: false, portfolio: false, services: false, pwa: false }
  const api = load('src/app/api/admin/blog/posts/route.ts')
  assert.equal((await api.POST(request('/api/admin/blog/posts', 'POST', {}))).status, 404)
  assert.equal((await api.GET(request('/api/admin/blog/posts'))).status, 401)
  const page = load('src/app/(site)/blog/page.tsx').default
  await assert.rejects(page(), /NEXT_NOT_FOUND/)
})

test('disabled modules disappear from public navigation and home avoids blog queries', async () => {
  reset(); configOverride = { store: { enabled: false }, blog: false, portfolio: false, services: false, pwa: false }
  const React = require('react'), { renderToStaticMarkup } = require('react-dom/server')
  const { CartProvider } = load('src/core/context/CartContext.tsx')
  const Header = load('src/client/components/Header.tsx').default
  const html = renderToStaticMarkup(React.createElement(CartProvider, null, React.createElement(Header)))
  assert.ok(!/href="\/(loja|blog|portfolio|servicos)/.test(html)); assert.ok(html.includes('wa.me'))
  const home = await load('src/client/home/HomePage.tsx').default()
  const homeHtml = renderToStaticMarkup(home)
  assert.ok(!/href="\/(loja|blog)/.test(homeHtml)); assert.ok(homeHtml.includes('wa.me'))
})

test('sitemap omits disabled sources without touching commercial/blog models', async () => {
  reset(); configOverride = { store: { enabled: false }, blog: false, portfolio: true, services: true, pwa: true }
  contentOverride = { portfolioEntries: [{ slug: 'synthetic-project', title: 'Test', description: 'Test', content: 'Test' }], serviceEntries: [{ slug: 'synthetic-service', title: 'Test', description: 'Test', content: 'Test' }] }
  db.customPage = { findMany: async () => [{ slug: 'sobre' }] }
  const sitemap = await load('src/app/sitemap.ts').default()
  const urls = sitemap.map(entry => entry.url)
  assert.ok(urls.some(url => url.endsWith('/portfolio/synthetic-project')))
  assert.ok(urls.some(url => url.endsWith('/servicos/synthetic-service')))
 assert.ok(!urls.some(url => ['/loja/carrinho', '/loja/checkout', '/loja/pedido', '/api/'].some(prefix => url.includes(prefix))));
})

test('active sitemap includes dynamic published posts/catalog but excludes operational URLs', async () => {
  reset(); db = { customPage: { findMany: async () => [] }, product: { findMany: async () => [{ slug: 'synthetic-product', name: 'Test', description: 'Test', price: 10, stock: 1, images: [] }] },
    category: { findMany: async () => [] }, post: { findMany: async ({ where }) => { assert.equal(where.published, true); return [{ slug: 'synthetic-post', title: 'Test', content: 'Test', published: true }] } }, blogCategory: { findMany: async () => [] } }
  const urls = (await load('src/app/sitemap.ts').default()).map(entry => entry.url)
  assert.ok(urls.some(url => url.endsWith('/loja/produto/synthetic-product')))
  assert.ok(urls.some(url => url.endsWith('/blog/synthetic-post')))
  assert.ok(!urls.some(url => /\/(pedido|checkout|carrinho|meus-pedidos)/.test(url)))
})

test('portfolio/services are real optional routes with client-owned content', async () => {
  reset(); configOverride = { store: { enabled: false }, blog: false, portfolio: false, services: false, pwa: false }
  assert.throws(() => load('src/app/(site)/portfolio/page.tsx').default(), /NEXT_NOT_FOUND/)
  assert.throws(() => load('src/app/(site)/servicos/page.tsx').default(), /NEXT_NOT_FOUND/)
  reset(); configOverride = { store: { enabled: false }, blog: false, portfolio: true, services: true, pwa: false }
  const projectSlug = load('src/client/projects/index.ts').projects[0].slug
  assert.ok(load('src/app/(site)/portfolio/page.tsx').default())
  assert.ok(await load('src/app/(site)/portfolio/[slug]/page.tsx').default({ params: Promise.resolve({ slug: projectSlug }) }))
  await assert.rejects(load('src/app/(site)/servicos/[slug]/page.tsx').default({ params: Promise.resolve({ slug: 'missing' }) }), /NEXT_NOT_FOUND/)
})

test('BittUp enables all six modules and retains its manifest and presentation routes', () => {
  reset(); const config = load('src/client/config/modules.config.ts').modulesConfig; const enabled = load('src/core/lib/module-config.ts').moduleEnabled;
  for (const module of ['store','checkout','blog','services','portfolio','pwa']) assert.equal(enabled(config,module), true);
  const manifest = load('src/app/manifest.ts').default(); assert.equal(manifest.name, 'BittUp'); assert.equal(manifest.icons.length, 3);
  reset(); configOverride = {...config, pwa:false}; assert.throws(() => load('src/app/manifest.ts').default(), /NEXT_NOT_FOUND/);
})

test('Serwist cache policy rejects commerce, private responses and disabled module documents', () => {
 reset(); const policy = load('src/core/pwa/cache-policy.ts');
 for (const path of ['/loja','/loja/carrinho','/loja/checkout','/loja/meus-pedidos','/loja/pedido/id','/api/orders','/admin','/pedido/id','//foreign.test','/sobre?session=test']) assert.equal(policy.canPrepareOfflinePath(path),false,path);
 for (const path of ['/','/sobre','/servicos','/portfolio','/processo']) assert.equal(policy.canPrepareOfflinePath(path),true,path);
 assert.equal(policy.canStoreResponse(new Response('public')),true);
 for(const headers of [{'cache-control':'private, no-store'},{'set-cookie':'session=synthetic'},{vary:'Cookie'},{vary:'Authorization'}]) assert.equal(policy.canStoreResponse(new Response('private',{headers})),false);
 reset(); configOverride = {store:{enabled:false},blog:false,portfolio:false,services:false,pwa:true};const off=load('src/core/pwa/cache-policy.ts');for(const path of ['/loja','/blog','/portfolio','/servicos'])assert.equal(off.canPrepareOfflinePath(path),false);assert.equal(off.canPrepareOfflinePath('/sobre'),true);
})

test('actual Serwist worker selects NetworkOnly for private requests and purges legacy page caches', async () => {
 reset(); let options;const callbacks={};const removed=[];const scope={location:{origin:'https://bittup.example.invalid'},__SW_MANIFEST:[{url:'/loja/pedido/private'}, {url:'/offline'},{url:'/_next/static/test.js'}],addEventListener:(name,fn)=>callbacks[name]=fn};
 class Strategy {constructor(options){this.options=options}}
 class NetworkOnly extends Strategy {}
 class Serwist {constructor(value){options=value} addEventListeners(){}}
 const code=ts.transpileModule(fs.readFileSync(path.join(root,'src/app/sw.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext('(function(require,exports){'+code+'\n})',{self:scope,URL,Response,caches:{keys:async()=>['pages','pages-rsc','other-app', 'bittup-public-v2-obsolete'],delete:async name=>removed.push(name)}})((name)=>name==='serwist'?{Serwist,NetworkOnly,NetworkFirst:Strategy,CacheFirst:Strategy,ExpirationPlugin:Strategy}:load('src/core/pwa/cache-policy.ts'),{});
 assert.deepEqual(Array.from(options.precacheEntries,e=>e.url),['/offline','/_next/static/test.js']);
 for(const path of ['/api/orders','/loja/checkout','/loja/pedido/id','/pedido/id','/admin']){const request=new Request(scope.location.origin+path);assert.equal(options.runtimeCaching[0].matcher({request,url:new URL(request.url)}),true)}
 const authRequest=new Request(scope.location.origin+'/sobre',{headers:{authorization:'Bearer synthetic'}});assert.equal(options.runtimeCaching[0].matcher({request:authRequest,url:new URL(authRequest.url)}),true);
 for (const init of [{headers:{rsc:'1'}},{referrer:scope.location.origin+'/loja/checkout'}]) {const request=new Request(scope.location.origin+'/sobre',init);assert.equal(options.runtimeCaching[0].matcher({request,url:new URL(request.url)}),true)}
 const privateFallback=new Request(scope.location.origin+'/loja/pedido/id');assert.equal(options.fallbacks.entries[0].matcher({request:privateFallback}),false);
 const publicRequest=new Request(scope.location.origin+'/sobre');assert.equal(options.runtimeCaching[0].matcher({request:publicRequest,url:new URL(publicRequest.url)}),false);
 let activated;callbacks.activate({waitUntil:p=>activated=p});await activated;assert.ok(removed.includes('pages'));assert.ok(removed.includes('pages-rsc'));assert.ok(!removed.includes('other-app'));
})

function seoFixture() {
  return { indexing: true, products: { mode: 'all', reviewedSlugs: [], requireInStock: false, requireImage: false },
    records: { pages: {}, products: {}, posts: {}, categories: {}, blogCategories: {} }, identity: { verified: false, sameAs: [], address: null } }
}
const seoProduct = (slug = 'synthetic-product') => ({ slug, name: 'Synthetic product', description: 'Real test description', price: '10.00', stock: 0, images: [{ url: '/logo-horizontal.png' }] })
const seoPost = (slug = 'synthetic-post') => ({ slug, title: 'Synthetic article', content: '<h2>Subtitle</h2><p>Test content</p>', published: true,
  updatedAt: new Date('2026-01-02T12:00:00Z'), createdAt: new Date('2026-01-01T12:00:00Z'), excerpt: 'Excerpt', coverImage: '/logo-horizontal.png' })

test('canonical remains on configured origin, strips queries/fragments and rejects foreign hosts/credentials', () => {
  reset(); siteOverride = { ...load('src/client/config/site.config.ts').siteConfig, nome: 'Synthetic Brand', seo: { url: 'https://seo.example.invalid', titulo: 'Synthetic', descricao: 'Description', ogImage: '/logo.png' } }
  const seo = load('src/core/lib/seo.ts')
  assert.equal(seo.canonicalUrl('/blog/test?tracking=1#anchor'), 'https://seo.example.invalid/blog/test')
  assert.throws(() => seo.canonicalUrl('https://another.example.invalid/blog/test'))
  assert.throws(() => seo.canonicalUrl('//another.example.invalid/blog/test'))
  assert.throws(() => seo.canonicalUrl('https://user:password@seo.example.invalid/test'))
  assert.equal(seo.publicImageUrl('javascript:alert(1)'), undefined)
  const metadata = seo.pageMetadata({ title: 'Article', description: '<p>Visible description</p>', path: '/blog/test', article: true })
  assert.equal(metadata.alternates.canonical, 'https://seo.example.invalid/blog/test')
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical); assert.equal(metadata.openGraph.type, 'article')
  assert.equal(metadata.twitter.card, 'summary_large_image'); assert.equal(metadata.description, 'Visible description')
  assert.ok(metadata.title.absolute.endsWith('Synthetic Brand'))
})

test('index policy is editorial and does not impose an in-stock/allowlist requirement by default', () => {
  reset(); seoOverride = seoFixture(); const seo = load('src/core/lib/seo.ts'), product = seoProduct()
  assert.equal(seo.isIndexableProduct(product), true)
  seoOverride.products.requireInStock = true; assert.equal(seo.isIndexableProduct(product), false)
  seoOverride.products.requireInStock = false; seoOverride.products.mode = 'reviewed'
  assert.equal(seo.isIndexableProduct(product), false)
  seoOverride.products.reviewedSlugs = [product.slug]; assert.equal(seo.isIndexableProduct(product), true)
  seoOverride.records.products[product.slug] = { published: false }; assert.equal(seo.isIndexableProduct(product), false)
  seoOverride.records.products[product.slug] = { index: false }; assert.equal(seo.isIndexableProduct(product), false)
  assert.equal(seo.isIndexablePost({ ...seoPost(), published: false }), false)
  assert.equal(seo.isIndexablePost(seoPost()), true)
  seoOverride.records.posts['synthetic-post'] = { index: false }; assert.equal(seo.isIndexablePost(seoPost()), false)
  for (const route of ['/admin', '/api/orders', '/loja/checkout', '/loja/carrinho', '/loja/meus-pedidos', '/loja/pedido/test', '/pedido/test', '/offline']) assert.equal(seo.isIndexablePath(route), false)
})

test('business schemas require verified identity; address is never inferred from a city string', () => {
  reset(); seoOverride = seoFixture(); const seo = load('src/core/lib/seo.ts')
  assert.equal(seo.organizationSchema(), null); assert.equal(seo.websiteSchema(), null); assert.equal(seo.localBusinessSchema(), null)
  seoOverride.identity.verified = true
  assert.equal(seo.organizationSchema()['@type'], 'Organization'); assert.equal(seo.websiteSchema()['@type'], 'WebSite')
  assert.equal(seo.localBusinessSchema(), null)
  seoOverride.identity.address = { streetAddress: 'Synthetic address', addressLocality: 'Test city', addressCountry: 'BR' }
  const local = seo.localBusinessSchema()
  assert.equal(local.address.streetAddress, 'Synthetic address'); assert.equal(local['@id'], seo.organizationSchema()['@id'])
  for (const key of ['aggregateRating', 'review', 'openingHours', 'geo', 'priceRange']) assert.ok(!(key in local))
})

test('Product and BlogPosting markup reflect visible real values, omit invented publication dates and safely serialize', () => {
  reset(); const seo = load('src/core/lib/seo.ts'), product = seoProduct()
  const schema = seo.productSchema(product)
  assert.equal(schema.offers.price, '10.00'); assert.equal(schema.offers.availability, 'https://schema.org/OutOfStock')
  assert.equal(seo.productSchema({ ...product, images: [] }), null)
  assert.equal(seo.productSchema({ ...product, price: 'NaN' }), null)
  const article = seo.blogPostingSchema(seoPost())
  assert.equal(article.dateModified, '2026-01-02T12:00:00.000Z'); assert.ok(!('datePublished' in article)); assert.ok(!('author' in article))
  assert.equal(seo.blogPostingSchema({ ...seoPost(), published: false }), null)
  const serialized = seo.serializeJsonLd({ title: '</script><script>alert(1)</script>\u2028' })
  assert.ok(!serialized.includes('<')); assert.ok(!serialized.includes('\u2028'))
  assert.equal(JSON.parse(serialized).title, '</script><script>alert(1)</script>\u2028')
  assert.equal(seo.realDate('not-a-date'), undefined); assert.equal(seo.realDate('2026-02-31'), undefined); assert.equal(seo.realDate('42'), undefined)
})

test('sitemap filters drafts/noindex, empty categories and nonreviewed products while keeping static URLs on query failures', async () => {
  reset(); seoOverride = seoFixture(); seoOverride.products.mode = 'reviewed'; seoOverride.products.reviewedSlugs = ['approved']
  seoOverride.records.posts['noindex'] = { index: false }
  const approved = { ...seoProduct('approved'), updatedAt: new Date('2026-01-01T00:00:00Z') }, unreviewed = seoProduct('unreviewed')
  db = { customPage: { findMany: async () => [{ slug: 'sobre', title: 'About', updatedAt: 'invalid' }] },
    product: { findMany: async () => [approved, unreviewed] }, category: { findMany: async () => [
      { slug: 'empty', name: 'Empty', products: [] }, { slug: 'eligible', name: 'Eligible', products: [approved] }] },
    post: { findMany: async () => [seoPost('published'), { ...seoPost('draft'), published: false }, seoPost('noindex')] },
    blogCategory: { findMany: async () => [{ slug: 'empty-blog', name: 'Empty', posts: [] }] } }
  const api = load('src/app/sitemap.ts'), first = await api.default(), urls = first.map(entry => entry.url)
  assert.ok(urls.some(url => url.endsWith('/loja/produto/approved')))
  for (const slug of ['unreviewed', 'draft', 'noindex', 'empty-blog', '/empty']) assert.ok(!urls.some(url => url.endsWith(slug)), slug)
  assert.ok(!('lastModified' in first.find(entry => entry.url.endsWith('/sobre'))))
  db.product.findMany = async () => { throw new Error('Synthetic failure') }
  const second = await api.default()
  assert.ok(second.some(entry => entry.url.endsWith('/loja'))); assert.ok(second.some(entry => entry.url.endsWith('/blog/published')))
  assert.equal(new Set(second.map(entry => entry.url)).size, second.length)
})

test('robots allows noindex pages to be crawled and uses only the configured domain', () => {
  reset(); const robots = load('src/app/robots.ts').default()
  assert.equal(robots.rules.allow, '/'); assert.deepEqual(robots.rules.disallow, ['/api/'])
  assert.ok(robots.sitemap.endsWith('/sitemap.xml')); assert.ok(!JSON.stringify(robots).includes('/admin/'))
})

test('record metadata consumes PostSEO and missing product/blog category/article return notFound', async () => {
  reset(); const post = { ...seoPost(), seo: { metaTitle: 'Own title', metaDesc: 'Own description', keywords: 'one,two' }, category: null }
  db.post = { findFirst: async () => post }
  const article = load('src/app/(site)/blog/[slug]/page.tsx')
  const metadata = await article.generateMetadata({ params: Promise.resolve({ slug: post.slug }) })
  assert.ok(metadata.title.absolute.startsWith('Own title')); assert.equal(metadata.description, 'Own description'); assert.deepEqual(metadata.keywords, ['one', 'two'])
  db.post.findFirst = async () => null
  await assert.rejects(article.generateMetadata({ params: Promise.resolve({ slug: 'missing' }) }), /NEXT_NOT_FOUND/)
  db.product = { findUnique: async () => null }; db.blogCategory = { findUnique: async () => null }
  await assert.rejects(load('src/app/(site)/loja/produto/[slug]/page.tsx').generateMetadata({ params: Promise.resolve({ slug: 'missing' }) }), /NEXT_NOT_FOUND/)
  await assert.rejects(load('src/app/(site)/blog/categoria/[slug]/page.tsx').generateMetadata({ params: Promise.resolve({ slug: 'missing' }) }), /NEXT_NOT_FOUND/)
})

test('HTML/Markdown keep headings and safe links without scripts, events or unsafe protocols', () => {
  reset(); const React = require('react'), { renderToStaticMarkup } = require('react-dom/server')
  const { ContentBody, safeContentHref } = load('src/core/components/ContentBody.tsx')
  const html = renderToStaticMarkup(React.createElement(ContentBody, { content: '<h1>Title</h1><h3>Subtitle</h3><a href="/sobre" onclick="evil()">About</a><a href="jav&#97;script:alert(1)">Unsafe</a><script>evil()</script><img src=x onerror=evil()>' }))
  assert.ok(html.includes('<h2>Title</h2>')); assert.ok(html.includes('<h3>Subtitle</h3>')); assert.ok(html.includes('href="/sobre"'))
  for (const value of ['<script', 'onclick', 'onerror', 'javascript:', '<img']) assert.ok(!html.includes(value))
  assert.equal(safeContentHref('data:text/html,evil'), undefined)
  const markdown = renderToStaticMarkup(React.createElement(ContentBody, { format: 'markdown', content: '## Subtitle\n[About](/sobre)' }))
  assert.ok(markdown.includes('<h2>Subtitle</h2>')); assert.ok(markdown.includes('href="/sobre"'))
})

test('Service metadata/schema use actual entry fields and do not invent pricing or address', () => {
  reset(); configOverride = { store: { enabled: false }, blog: false, portfolio: true, services: true, pwa: false }
  const entry = { slug: 'service', title: 'Visible service title', description: 'Visible description', content: 'Visible content', seo: { title: 'Own metadata title' } }
  const { entryMetadata, serviceSchema } = load('src/core/lib/content-seo.ts')
  assert.ok(entryMetadata(entry, '/servicos').title.absolute.startsWith('Own metadata title'))
  const schema = serviceSchema(entry)
  assert.equal(schema['@type'], 'Service'); assert.equal(schema.name, entry.title)
  for (const key of ['offers', 'areaServed', 'aggregateRating', 'address']) assert.ok(!(key in schema))
  assert.equal(serviceSchema({ ...entry, published: false }), null)
})

test('related links only refer to existing published records and respect disabled modules', async () => {
  reset(); configOverride = { store: { enabled: true, checkout: true }, blog: true, portfolio: false, services: true, pwa: false }
  contentOverride = { serviceEntries: [{ slug: 'service', title: 'Visible service', content: 'Content' }, { slug: 'draft-service', title: 'Draft', published: false }], portfolioEntries: [] }
  db.product = { findUnique: async ({ where }) => where.slug === 'product' ? seoProduct('product') : null }
  db.post = { findFirst: async () => null }
  const { RelatedContent } = load('src/core/components/RelatedContent.tsx')
  const html = require('react-dom/server').renderToStaticMarkup(await RelatedContent({ related: { products: ['product', 'missing'], services: ['service', 'draft-service'], posts: ['missing-post'] } }))
  assert.ok(html.includes('/loja/produto/product')); assert.ok(html.includes('/servicos/service'))
  assert.ok(!html.includes('missing')); assert.ok(!html.includes('draft-service'))
  reset(); configOverride = { store: { enabled: false }, blog: false, portfolio: false, services: false, pwa: false }
  assert.equal(await load('src/core/components/RelatedContent.tsx').RelatedContent({ related: { products: ['product'], services: ['service'], posts: ['post'] } }), null)
})

test('BittUp sitemap keeps actual services/projects and processo when dynamic sources fail', async () => {
 reset(); db = {}; const entries = await load('src/app/sitemap.ts').default(); const urls = entries.map(entry => entry.url);
 for (const project of load('src/client/projects/index.ts').projects) assert.ok(urls.includes('https://bittup.com.br/portfolio/' + project.slug));
 for (const slug of load('src/client/services/services.config.ts').serviceSlugs) assert.ok(urls.includes('https://bittup.com.br/servicos/' + slug));
 assert.ok(urls.includes('https://bittup.com.br/processo')); assert.ok(urls.includes('https://bittup.com.br/sobre'));
 assert.ok(!urls.some(url => ['/loja/carrinho', '/loja/checkout', '/loja/pedido', '/api/'].some(prefix => url.includes(prefix))));
 assert.ok(entries.every(entry => !entry.lastModified));
})


test('recovered portfolio has 18 distinct projects, original records and nine model demos', () => {
  reset(); const { projects, getProjectsByCategory } = load('src/client/projects/index.ts');
  assert.equal(projects.length, 18); assert.equal(new Set(projects.map(project => project.slug)).size, 18);
  for (const slug of ['jornada-da-transformacao', 'el-vidracaria', 'cm-teixeiras', 'maribela', 'geicy-croche', 'artesanaio', 'resgatando-anas', 'diario-de-sentimentos', 'jornada-da-protagonista']) assert.ok(projects.some(project => project.slug === slug));
  const models = getProjectsByCategory('modelos'); assert.equal(models.length, 9);
  for (const project of models) { assert.ok(project.url.startsWith('/modelos/')); const html = fs.readFileSync(path.join(root, 'public', project.url), 'utf8'); assert.match(html, /<!doctype html>/i); }
  const missing = [];
  for (const project of projects) for (const image of Object.values(project.images)) {
    const file = path.join(root, 'public', image);
    if (!fs.existsSync(file)) { missing.push(image); continue; }
    assert.equal(fs.readFileSync(file).subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  }
  assert.deepEqual(missing, ['/assets/portfolio/resgatando-anas-03.png']);
  const filter = require('react-dom/server').renderToStaticMarkup(require('react').createElement(load('src/client/projects/ProjectFilter.tsx').default, {value:'modelos',onChange(){}}));
  assert.match(filter, /Modelos/);
})

test('all 18 portfolio records retain canonical metadata, breadcrumbs and real 404 handling', async () => {
  reset(); const { projects } = load('src/client/projects/index.ts'); const route = load('src/app/(site)/portfolio/[slug]/page.tsx');
  for (const project of projects) {
    const params = Promise.resolve({slug:project.slug}); const metadata = await route.generateMetadata({params});
    assert.equal(metadata.alternates.canonical, 'https://bittup.com.br/portfolio/' + project.slug);
    assert.ok(metadata.title.absolute.includes(project.title)); assert.equal(metadata.robots.index, true);
    const page = await route.default({params}); const children = require('react').Children.toArray(page.props.children);
    const breadcrumb = children.find(child => child.props?.items); assert.ok(breadcrumb); assert.equal(breadcrumb.props.items.at(-1).path, '/portfolio/' + project.slug);
  }
  await assert.rejects(route.generateMetadata({params:Promise.resolve({slug:'missing-project'})}), /NEXT_NOT_FOUND/);
})

test('offline preparation includes all 18 project pages without enabling financial caches', () => {
  reset(); const { projects } = load('src/client/projects/index.ts'); const page = load('src/app/(site)/preparar-offline/page.tsx').default();
  const routes = page.props.routes; for (const project of projects) assert.ok(routes.includes('/portfolio/' + project.slug));
  assert.equal(routes.filter(route => route.startsWith('/portfolio/')).length, 18);
  assert.ok(!routes.some(route => ['/loja', '/api', '/admin', '/pedido'].some(prefix => route.startsWith(prefix))));
  assert.equal(new Set(routes).size, routes.length);
})


test('remote links page preserves noindex/WhatsApp and respects service and portfolio modules', () => {
  reset(); const React = require('react'), {renderToStaticMarkup} = require('react-dom/server');
  const active = load('src/app/(standalone)/links/page.tsx'); const html = renderToStaticMarkup(React.createElement(active.default));
  assert.ok(html.includes('href="/portfolio"')); assert.ok(html.includes('href="/servicos"')); assert.ok(html.includes('https://wa.me/5521982708329'));
  assert.ok(!html.includes('/lp/intensivao')); assert.equal(active.metadata.robots.index, false);
  assert.equal(active.metadata.alternates.canonical, 'https://bittup.com.br/links');
  assert.equal(load('src/core/lib/seo.ts').isIndexablePath('/links'), false);
  assert.equal(load('src/core/pwa/cache-policy.ts').canPrepareOfflinePath('/links'), false);
  reset(); configOverride = {store:{enabled:true,checkout:true},blog:true,portfolio:false,services:false,pwa:true};
  const disabledHtml = renderToStaticMarkup(React.createElement(load('src/app/(standalone)/links/page.tsx').default));
  assert.ok(!disabledHtml.includes('href="/portfolio"')); assert.ok(!disabledHtml.includes('href="/servicos"')); assert.ok(disabledHtml.includes('https://wa.me/5521982708329'));
  for (const filename of ['card-instagram.png','card-portfolio.png','card-servicos.png','card-site.png','card-whatsapp.png']) assert.ok(fs.existsSync(path.join(root,'public/assets/cards-links',filename)));
})


test('manifest and Apple touch icon reference real PNGs with truthful dimensions', () => {
 reset(); const manifest = load('src/app/manifest.ts').default();
 for (const icon of manifest.icons) {
   const file = path.join(root, 'public', icon.src); assert.ok(fs.existsSync(file), icon.src);
   const png = fs.readFileSync(file); assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
   assert.equal(icon.sizes, png.readUInt32BE(16) + 'x' + png.readUInt32BE(20));
 }
 const maskable = manifest.icons.find(icon => icon.purpose === 'maskable');
 assert.equal(maskable.src, '/logo-bittup-vertical.png'); assert.equal(maskable.sizes, '500x500');
 const {siteConfig} = load('src/client/config/site.config.ts'); assert.ok(fs.existsSync(path.join(root, 'public', siteConfig.pwa.appleTouchIcon)));
})

function inbox() {
  const rows = new Map()
  return {
    upsert: async ({where, create}) => { if (!rows.has(where.id)) rows.set(where.id, {...create, processedAt:null}); return rows.get(where.id) },
    update: async ({where, data}) => { Object.assign(rows.get(where.id), data); return rows.get(where.id) },
  }
}

test('MP encryption detects tampering and separates BittUp credentials',()=>{
  reset(); process.env.MP_TOKEN_ENCRYPTION_KEY=Buffer.alloc(32,7).toString('base64')
  const {encrypt,decrypt}=load('src/core/lib/mp/security.ts')
  const sealed=encrypt('synthetic-secret'); assert.equal(decrypt(sealed),'synthetic-secret')
  assert.equal(sealed.includes('synthetic-secret'),false)
  const bytes=Buffer.from(sealed,'base64');bytes[20]^=1
  assert.throws(()=>decrypt(bytes.toString('base64')))
})
test('MP money, settlement states and Sao Paulo weekly credits match Lab rules',()=>{
  reset();const {centsFromMoney,financialState,weekStart,totals}=load('src/core/lib/mp/accounting.ts')
  assert.equal(centsFromMoney('25.10'),2510);assert.throws(()=>centsFromMoney('25.1'))
  assert.equal(financialState('processed','accredited'),'paid');assert.equal(financialState('processed','partially_refunded'),'reversed')
  for(const status of ['created','failed','canceled','action_required'])assert.equal(financialState(status,'pending'),'unpaid')
  assert.equal(weekStart(new Date('2026-10-19T02:59:00Z')).toISOString(),'2026-10-12T03:00:00.000Z')
  assert.equal(weekStart(new Date('2026-10-19T03:00:00Z')).toISOString(),'2026-10-19T03:00:00.000Z')
  assert.deepEqual(totals([{kind:'credit',cents:-100,salesCents:0,refundCents:2500}],0),{salesCents:0,refundCents:2500,feesCents:0,adjustments:-100,openingCredit:0,dueCents:0,closingCredit:-100})
})
test('MP payload includes shipping-derived amount, credit token and no split or Checkout Pro',()=>{
  reset();process.env.MP_ENVIRONMENT='test'
  const {orderPayload}=load('src/core/lib/mp/client.ts')
  const pix=orderPayload('payment-id',2510,'buyer@testuser.com','pix')
  assert.equal(pix.total_amount,'25.10');assert.equal(pix.payer.first_name,'APRO')
  const card=orderPayload('payment-id',2510,'buyer@testuser.com','card',{token:'synthetic',payment_method_id:'master'})
  assert.deepEqual(card.transactions.payments[0].payment_method,{id:'master',type:'credit_card',token:'synthetic',installments:1})
  for(const key of ['application_fee','marketplace_fee','back_urls','init_point'])assert.equal(key in card,false)
  process.env.MP_ENVIRONMENT='live';assert.equal('first_name' in orderPayload('p',100,'b@example.invalid','pix').payer,false)
})
test('MP admin settings, OAuth and payment queries require existing grants and reject CSRF',async()=>{
  reset();const api=load('src/app/api/mercado-pago/[...path]/route.ts')
  for(const path of ['settings','oauth/callback'])assert.equal((await api.GET(request('/api/mercado-pago/'+path))).status,401)
  for(const path of ['oauth/start','oauth/disconnect','oauth/confirm','settings'])assert.equal((await api.POST(request('/api/mercado-pago/'+path,'POST',{}))).status,401)
  assert.equal((await api.GET(request('/api/mercado-pago/payment?orderId=unknown'))).status,404)
  db.adminUser={findUnique:async()=>({id:'a',email:'a@example.invalid',role:'admin'})}
  const token=jwt.sign({id:'a',email:'a@example.invalid',role:'admin'},process.env.AUTH_JWT_SECRET,{expiresIn:'1h'})
  assert.equal((await api.POST(request('/api/mercado-pago/settings','POST',{provider:'mercado_pago'},{cookie:'auth_token='+token,origin:'https://evil.example.invalid'}))).status,403)
})
