// src/client/projects/cm-teixeiras.ts

import type { Project } from "./types";

export const cmTeixeiras: Project = {
  slug: "cm-teixeiras",

  title: "CM Teixeiras",

  subtitle:
    "Site institucional com catálogo para empresa de camisas, uniformes e personalizados.",

  client: "CM Teixeiras",

  category: "site",

  service: "Site Institucional com Catálogo",

  year: 2026,

  featured: true,

  url: "https://www.lojateixeiras.com.br/",

  images: {
    card: "/assets/portfolio/loja-cm-teixeiras-01.png",
    desktop: "/assets/portfolio/loja-cm-teixeiras-02.png",
    mobile: "/assets/portfolio/loja-cm-teixeiras-03.png",
  },

  shortDescription:
    "Projeto desenvolvido para apresentar a empresa, organizar suas coleções e fortalecer a presença digital da marca.",

  challenge:
    "Criar uma estrutura profissional que apresentasse os produtos, os serviços personalizados e os diferenciais da empresa sem transformar o site em uma loja virtual complexa.",

  solution:
    "Foi desenvolvido um site institucional com catálogo organizado, páginas de produtos, conteúdo estratégico, integração com WhatsApp e estrutura preparada para SEO e futuras expansões.",

  results: [
    "Catálogo organizado por categorias",
    "Apresentação profissional da marca",
    "Integração direta com WhatsApp",
    "Estrutura preparada para SEO",
    "Experiência responsiva",
    "Blog integrado",
    "Arquitetura pronta para evolução",
  ],

  technologies: [
    "Next.js 16",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Prisma",
    "PostgreSQL",
    "SEO",
    "PWA",
  ],

  color: "#1F4A66",
};