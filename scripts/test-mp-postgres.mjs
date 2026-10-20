// Starts a disposable localhost PostgreSQL. Never reads project .env credentials.
import EmbeddedPostgres from 'embedded-postgres'
import { randomBytes } from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs'
import { spawn } from 'node:child_process'
import net from 'node:net'
const root = process.cwd(), name = 'bittup_mp_' + randomBytes(6).toString('hex')
const directory = path.resolve(root, '.mp-validation', name)
if (!directory.startsWith(path.resolve(root, '.mp-validation') + path.sep)) throw Error('Unsafe test path')
fs.mkdirSync(directory, { recursive: true })
const listener = net.createServer()
await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve))
const port = listener.address().port, password = randomBytes(24).toString('hex')
await new Promise(resolve => listener.close(resolve))
const pg = new EmbeddedPostgres({ databaseDir: path.join(directory, 'data'), user: 'postgres', password, port, persistent: true,
  initdbFlags: ['--encoding=UTF8'], postgresFlags: ['-h', '127.0.0.1'], onLog(message) { fs.appendFileSync(path.join(directory, 'postgres.log'), String(message)) }, onError() {} })
function run(args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd: root, env, stdio: 'inherit', windowsHide: true })
    child.on('error', reject); child.on('exit', code => code === 0 ? resolve() : reject(Error('Test command failed: ' + code)))
  })
}
const env = { ...process.env, DATABASE_URL: `postgresql://postgres:${password}@127.0.0.1:${port}/${name}`, BITTUP_MP_ISOLATED_TEST: 'yes',
  MP_TOKEN_ENCRYPTION_KEY: randomBytes(32).toString('base64'), MP_CLIENT_ID: '12345', MP_CLIENT_SECRET: 'synthetic-secret', MP_BASE_URL: 'http://localhost:3219',
  MP_ENVIRONMENT: 'test', MP_TEST_SELLER_IDS: '123,456', MP_PAYMENTS_ENABLED: 'true', MP_PUBLIC_KEY: 'synthetic-public-key', MP_WEBHOOK_SECRET: 'synthetic-webhook', MP_WEBHOOK_CONFIGURED: 'true',
  AUTH_JWT_SECRET: 'synthetic-test-secret-with-more-than-thirty-two-characters', NEXT_PUBLIC_SITE_URL: 'http://localhost:3219', NEXT_TELEMETRY_DISABLED: '1' }
let failed = false
try {
  await pg.initialise(); await pg.start(); await pg.createDatabase(name)
  console.log('PostgreSQL local descartável iniciado; sem banco externo.')
  await run(['node_modules/prisma/build/index.js', 'migrate', 'deploy'], env)
  if (process.argv.includes('--browser')) {
    await run(['--conditions=react-server', '--import', 'tsx', 'scripts/seed-mp-test.ts'], env)
    const target = path.join(directory, 'app')
    fs.mkdirSync(target)
    for (const file of ['src', 'public', 'package.json', 'tsconfig.json', 'next.config.ts', 'postcss.config.mjs']) fs.cpSync(path.join(root, file), path.join(target, file), { recursive: true })
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(target, 'node_modules'), 'junction')
    const client = path.join(target, 'src/core/lib/mp/client.ts')
    fs.writeFileSync(client, "import { mpTestFetch } from './test-fetch'\n" + fs.readFileSync(client, 'utf8').replace('const response = await fetch(', 'const response = await mpTestFetch('))
    fs.copyFileSync(path.join(root, 'tests/fixtures/mp-fetch.ts'), path.join(target, 'src/core/lib/mp/test-fetch.ts'))
    await run(['node_modules/@playwright/test/cli.js', 'test', '--config', 'playwright.mp.config.ts', ...(process.argv.includes('--navigation') ? ['admin-navigation.spec.ts'] : [])], { ...env, MP_TEST_APP_DIR: target, PLAYWRIGHT_BROWSERS_PATH: path.join(root, '.playwright-browsers') })
  } else await run(['--conditions=react-server', '--import', 'tsx', '--test', 'tests/mp-db.test.ts'], env)
} catch (error) { failed = true; console.error(error?.message ?? 'PostgreSQL não iniciou; confira postgres.log na pasta descartável.'); process.exitCode = 1 }
finally {
  let timer
  await Promise.race([pg.stop().catch(() => {}), new Promise(resolve => { timer = setTimeout(resolve, 5000) })])
  clearTimeout(timer)
  console.log('PostgreSQL de teste encerrado. Dados somente na pasta ignorada .mp-validation.')
  if (failed) process.exitCode = 1
}
