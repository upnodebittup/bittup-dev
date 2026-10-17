import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
const root=process.cwd(), target=path.join(root,'.asaas-validation')
fs.mkdirSync(target,{recursive:true})
for(const file of ['src','public','package.json','tsconfig.json','next.config.ts','postcss.config.mjs'])
  fs.cpSync(path.join(root,file),path.join(target,file),{recursive:true})
if(!fs.existsSync(path.join(target,'node_modules'))) fs.symlinkSync(path.join(root,'node_modules'),path.join(target,'node_modules'),'junction')
fs.copyFileSync('tests/fixtures/prisma.ts',path.join(target,'src/core/lib/prisma.ts'))
fs.copyFileSync('tests/fixtures/asaas.ts',path.join(target,'src/core/lib/asaas.ts'))
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev',target,'--webpack','--hostname','localhost','--port','3217'],{
  stdio:'inherit',env:{...process.env,DATABASE_URL:'postgresql://invalid:invalid@127.0.0.1:1/isolated',AUTH_JWT_SECRET:'synthetic-secret-with-more-than-thirty-two-characters',ASAAS_ENV:'sandbox',ASAAS_API_KEY:'synthetic',ASAAS_WEBHOOK_TOKEN:'synthetic-webhook-token',NEXT_PUBLIC_SITE_URL:'http://localhost:3217',NEXT_TELEMETRY_DISABLED:'1'}
})
process.on('SIGTERM',()=>child.kill());child.on('exit',code=>process.exit(code??1))
