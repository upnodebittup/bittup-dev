import { spawn } from 'node:child_process'
import path from 'node:path'
const root = process.cwd(), target = path.resolve(process.env.MP_TEST_APP_DIR ?? '')
if (process.env.BITTUP_MP_ISOLATED_TEST !== 'yes' || !target.startsWith(path.resolve(root, '.mp-validation') + path.sep)) throw Error('Isolated app required')
const child = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'dev', target, '--webpack', '--hostname', 'localhost', '--port', '3219'], { stdio: 'inherit', env: process.env, windowsHide: true })
process.on('SIGTERM', () => child.kill()); child.on('exit', code => process.exit(code ?? 1))
