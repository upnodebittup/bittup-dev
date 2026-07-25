// prisma/seed.ts
import 'dotenv/config'
import { PrismaClient } from '../src/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🧹 Limpando Paginas...')


  await prisma.customPage.deleteMany()

  console.log('✅ Paginas limpas!')

  // ─────────────────────────────────────────
  // 📄 PÁGINAS CUSTOMIZADAS
  // ─────────────────────────────────────────
await prisma.customPage.createMany({
  data: [
    {
      slug: 'sobre',
      title: 'Sobre a Bittup',
      introText:
        'A Bittup é uma empresa de tecnologia especializada no desenvolvimento de sistemas, sites profissionais e plataformas digitais para pequenos negócios. Criadora do Upnode — a solução completa de presença digital para quem quer aparecer no Google e vender mais.',
      section1Title: 'Tecnologia que trabalha pelo seu negócio',
      section1Text:
        'A Bittup nasceu para resolver um problema real: pequenos negócios com grande potencial que não aparecem no Google, dependem apenas do Instagram e perdem vendas por falta de presença digital. Nossa missão é transformar isso através de sites rápidos, bonitos, otimizados para buscas e com loja virtual integrada — tudo acessível, fácil de gerenciar e pensado para gerar clientes todos os dias. Além do Upnode, desenvolvemos sistemas personalizados para qualquer tipo de negócio.',
    },
    {
      slug: 'personalizado',
      title: 'Soluções sob medida para o seu negócio',
      introText:
        'Cada projeto da Bittup é desenvolvido de acordo com as necessidades, o público e os objetivos do cliente. Do site institucional ao sistema completo — fazemos tudo com foco em resultado.',
      section1Title: 'O que podemos desenvolver para você?',
      section1Text:
        'Sites institucionais, lojas virtuais, blogs com SEO, sistemas de gestão, plataformas com painel administrativo, integrações com meios de pagamento e muito mais. Se você tem uma ideia ou uma necessidade, a Bittup tem a solução. Atendemos artesãs, lojas locais, igrejas, empresas e qualquer negócio que queira crescer no digital.',
      faq: [
        {
          pergunta: 'O que é o Upnode?',
          resposta:
            'O Upnode é a plataforma da Bittup para pequenos negócios: um sistema que entrega site, blog, loja virtual e painel admin em um só lugar, com custo acessível e foco total em aparecer no Google.',
        },
        {
          pergunta: 'Vocês desenvolvem sistemas fora do Upnode?',
          resposta:
            'Sim! Desenvolvemos qualquer tipo de sistema personalizado — desde aplicações internas até plataformas completas com funcionalidades específicas para o seu negócio.',
        },
        {
          pergunta: 'Preciso de conhecimento técnico para usar os sistemas?',
          resposta:
            'Não. Todos os nossos sistemas são desenvolvidos com painéis administrativos intuitivos, pensados para que qualquer pessoa consiga gerenciar sem precisar de suporte técnico constante.',
        },
        {
          pergunta: 'Meu site vai aparecer no Google?',
          resposta:
            'Sim! Todos os sites e plataformas desenvolvidos pela Bittup já saem otimizados para SEO. Com o blog integrado e publicação regular de conteúdo, seu negócio ganha posições no Google de forma orgânica e contínua.',
        },
        {
          pergunta: 'Como funciona o suporte após a entrega?',
          resposta:
            'Oferecemos planos de manutenção mensal que incluem atualizações de conteúdo, correções, novos produtos, posts no blog e monitoramento. Você foca no seu negócio, a gente cuida da tecnologia.',
        },
        {
          pergunta: 'Como solicitar um orçamento?',
          resposta:
            'Entre em contato pelo WhatsApp ou pelo formulário do site. Apresente sua ideia ou necessidade e a gente monta uma proposta personalizada sem compromisso.',
        },
      ],
    },
  ],
})
console.log('✅ Páginas sobre e personalizado criadas — bittup.com.br')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })