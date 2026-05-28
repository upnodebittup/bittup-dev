
import 'dotenv/config'
import { PrismaClient } from '../src/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🧹 Limpando banco administrativo...')

  await prisma.adminUser.deleteMany()

  console.log('🔐 Criando admin (sem mexer no resto do banco)...')

  const email = 'admin@bittup.com.br'
  const password = '@bittup1234.'

  // opcional: evita duplicar admin se rodar mais de uma vez
  const existing = await prisma.adminUser.findUnique({
    where: { email },
  })

  if (existing) {
    console.log(`⚠️ Admin já existe: ${email}`)
    return
  }

  await prisma.adminUser.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: 'admin',
    },
  })

  console.log(`✅ Admin criado: ${email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })