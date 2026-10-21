// Build without any project .env file or live database/provider connection.
import fs from 'node:fs'
import path from 'node:path'
import {spawnSync} from 'node:child_process'
const root=process.cwd(),target=path.join(root,'.asaas-build')
fs.mkdirSync(target,{recursive:true})
for(const file of ['src','public','package.json','tsconfig.json','next.config.ts','postcss.config.mjs','eslint.config.mjs'])
 fs.cpSync(path.join(root,file),path.join(target,file),{recursive:true})
if(!fs.existsSync(path.join(target,'node_modules')))fs.symlinkSync(path.join(root,'node_modules'),path.join(target,'node_modules'),'junction')
const result=spawnSync(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build','--webpack'],{cwd:target,stdio:'inherit',env:{...process.env,DATABASE_URL:'postgresql://invalid:invalid@127.0.0.1:1/isolated?connect_timeout=1',ASAAS_API_KEY:'synthetic',ASAAS_ENV:'sandbox',AUTH_JWT_SECRET:'synthetic-build-secret-with-at-least-thirty-two-characters',NEXT_TELEMETRY_DISABLED:'1'}})
process.exitCode=result.status??1
