// prisma/seed.ts

import "dotenv/config";

import { PrismaClient } from "../src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categoriesData = [
  {
    name: "Sites e Landing Pages",
    slug: "sites-e-landing-pages",
  },
  {
    name: "Lojas e Sistemas",
    slug: "lojas-e-sistemas",
  },
  {
    name: "SEO e Conteúdo",
    slug: "seo-e-conteudo",
  },
  {
    name: "Manutenção e Suporte",
    slug: "manutencao-e-suporte",
  },
];

const productsData = [
  {
    name: "Landing Page de Alta Conversão",
    slug: "landing-page-de-alta-conversao",
    description:
      "Página estratégica para campanhas, eventos, produtos ou serviços, com design personalizado, WhatsApp, formulário, SEO básico e integração com métricas.",
    price: "1997.00",
    image: "/assets/produtos/servico-landing-page.png",
    categories: ["sites-e-landing-pages"],
    sizes: ["Projeto completo"],
  },
  {
    name: "Site Institucional Profissional",
    slug: "site-institucional-profissional",
    description:
      "Site responsivo para apresentar sua empresa, serviços, diferenciais e canais de contato, com estrutura profissional e otimização básica para o Google.",
    price: "2997.00",
    image: "/assets/produtos/servico-site-institucional.png",
    categories: ["sites-e-landing-pages"],
    sizes: ["Projeto completo"],
  },
  {
    name: "Site Institucional com Blog SEO",
    slug: "site-institucional-com-blog-seo",
    description:
      "Site institucional completo com blog, categorias, painel administrativo e estrutura preparada para publicação de conteúdos e crescimento no Google.",
    price: "3443.00",
    image: "/assets/produtos/servico-site-com-blog.png",
    categories: ["sites-e-landing-pages", "seo-e-conteudo"],
    sizes: ["Projeto completo"],
  },
  {
    name: "Loja Virtual Profissional",
    slug: "loja-virtual-profissional",
    description:
      "Loja virtual com catálogo, carrinho, checkout, pagamentos, pedidos, painel administrativo e cadastro inicial de produtos.",
    price: "4997.00",
    image: "/assets/produtos/servico-loja-virtual.png",
    categories: ["lojas-e-sistemas"],
    sizes: ["Projeto completo"],
  },
  {
    name: "Site Completo com Blog e Loja",
    slug: "site-completo-com-blog-e-loja",
    description:
      "Estrutura completa com site institucional, blog otimizado para SEO, loja virtual, painel administrativo, pagamentos e gestão de conteúdo.",
    price: "6997.00",
    image: "/assets/produtos/servico-site-completo.png",
    categories: [
      "sites-e-landing-pages",
      "lojas-e-sistemas",
      "seo-e-conteudo",
    ],
    sizes: ["Projeto completo"],
  },
  {
    name: "Sistema Web Personalizado",
    slug: "sistema-web-personalizado",
    description:
      "Sistema desenvolvido sob medida com login, painel administrativo, cadastros, relatórios, área do cliente, automações e integrações.",
    price: "7997.00",
    image: "/assets/produtos/servico-sistema-web.png",
    categories: ["lojas-e-sistemas"],
    sizes: ["A partir de"],
  },
  {
    name: "Manutenção Técnica Mensal",
    slug: "manutencao-tecnica-mensal",
    description:
      "Manutenção mensal com atualizações, monitoramento, correções técnicas, backups e pequenos ajustes no site.",
    price: "297.00",
    image: "/assets/produtos/servico-manutencao.png",
    categories: ["manutencao-e-suporte"],
    sizes: ["Mensal"],
  },
  {
    name: "Otimização SEO Técnica",
    slug: "otimizacao-seo-tecnica",
    description:
      "Auditoria e otimização de títulos, descrições, velocidade, sitemap, indexação, links internos, imagens e estrutura técnica do site.",
    price: "1497.00",
    image: "/assets/produtos/servico-seo-tecnico.png",
    categories: ["seo-e-conteudo"],
    sizes: ["Otimização completa"],
  },
  {
    name: "Gestão de SEO Mensal",
    slug: "gestao-de-seo-mensal",
    description:
      "Acompanhamento mensal de palavras-chave, Google Search Console, melhorias internas, análise de desempenho e relatório de resultados.",
    price: "997.00",
    image: "/assets/produtos/servico-gestao-de-seo.png",
    categories: ["seo-e-conteudo", "manutencao-e-suporte"],
    sizes: ["Mensal"],
  },
  {
    name: "Pacote com 4 Artigos SEO",
    slug: "pacote-com-4-artigos-seo",
    description:
      "Produção de quatro artigos com pesquisa de palavras-chave, estrutura SEO, links internos, imagens, formatação e publicação no blog.",
    price: "997.00",
    image: "/assets/produtos/servico-artigos-seo.png",
    categories: ["seo-e-conteudo"],
    sizes: ["4 artigos"],
  },
];

async function main() {
  console.log("🧹 Apagando produtos antigos...");

  await prisma.productImage.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.size.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("✅ Produtos, imagens, cores, tamanhos e categorias apagados!");
  console.log("🚀 Iniciando cadastro dos produtos...");

  const categoryIds = new Map<string, string>();

  for (const category of categoriesData) {
    const savedCategory = await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
      },
      create: category,
    });

    categoryIds.set(category.slug, savedCategory.id);
  }

   for (const product of productsData) {
  const categories = product.categories.map((slug) => {
    const id = categoryIds.get(slug);

    if (!id) {
      throw new Error(`Categoria não encontrada: ${slug}`);
    }

    return { id };
  });

  await prisma.product.upsert({
    where: {
      slug: product.slug,
    },

    update: {
      name: product.name,
      description: product.description,
      price: product.price,
      handmade: false,
      stock: 99,

      categories: {
        set: categories,
      },

      images: {
        deleteMany: {},
        create: [
          {
            url: product.image,
          },
        ],
      },

      colors: {
        deleteMany: {},
        create: [
          {
            name: "Personalizado",
            hex: "#2D8CFF",
          },
        ],
      },

      sizes: {
        deleteMany: {},
        create: product.sizes.map((name) => ({
          name,
        })),
      },
    },

    create: {
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      handmade: false,
      stock: 99,

      categories: {
        connect: categories,
      },

      images: {
        create: [
          {
            url: product.image,
          },
        ],
      },

      colors: {
        create: [
          {
            name: "Personalizado",
            hex: "#2D8CFF",
          },
        ],
      },

      sizes: {
        create: product.sizes.map((name) => ({
          name,
        })),
      },
    },
  });

  console.log(`✅ ${product.name}`);
}
  console.log("");
  console.log("🎉 Produtos cadastrados com sucesso!");
}

main()
  .catch((error) => {
    console.error("❌ Erro ao executar o seed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });