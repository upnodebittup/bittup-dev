// Operator-only provisioning. No public registration endpoint or seller tokens.
import { prisma } from '../src/core/lib/prisma'
import { relayDestination, relayId, relaySecret } from '../src/core/lib/mp/relay-auth'

async function main() {
  if (process.env.MP_RELAY_PROVISIONING !== 'yes') throw new Error('Provisionamento não autorizado')
  const [id, destination, secretEnv, localFlag] = process.argv.slice(2)
  relayId(id ?? '')
  const local = localFlag === '--local'
  if (localFlag && !local) throw new Error('Opção inválida')
  if (local) {
    if (id !== process.env.MP_RELAY_INSTANCE_ID || destination !== 'local' || secretEnv !== '-') throw new Error('Cadastro local inválido')
  } else {
    relayDestination(destination, (process.env.MP_RELAY_ALLOWED_ORIGINS ?? '').split(',').map(s => s.trim()))
    if (!/^MP_RELAY_KEY_[A-Z0-9_]+$/.test(secretEnv ?? '')) throw new Error('Nome de chave inválido')
    relaySecret(process.env[secretEnv])
  }
  await prisma.mercadoPagoRelayInstallation.upsert({ where: { id }, create: { id, destination, secretEnv, local }, update: { destination, secretEnv, local, enabled: true } })
  console.log('Instalação autorizada cadastrada. Nenhum token de vendedor transferido.')
}
main().catch(() => { console.error('Cadastro não concluído. Confira a configuração segura.'); process.exitCode = 1 }).finally(() => prisma.$disconnect())
