import { prisma } from '../src/core/lib/prisma'
import { hash } from 'bcryptjs'
if (process.env.BITTUP_MP_ISOLATED_TEST !== 'yes' || !/@127\.0\.0\.1:\d+\/bittup_mp_/.test(process.env.DATABASE_URL ?? '')) throw Error('Isolated test only')
async function main() {
  await prisma.adminUser.create({ data: { email: 'admin@synthetic.invalid', passwordHash: await hash('synthetic-test-password', 10), role: 'admin' } })
  await prisma.product.create({ data: { id: 'synthetic-product', slug: 'synthetic-product', name: 'Produto Sintético', description: 'Teste local', price: '20.00', stock: 10 } })
}
main().finally(() => prisma.$disconnect())
