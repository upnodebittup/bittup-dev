// src/client/projects/artesanaio.ts

import type { Project } from "./types";

export const artesanaio: Project = {
  slug: "artesanaio",

  title: "Artesana.io",

  subtitle:
    "Plataforma digital desenvolvida para conectar artesãos e valorizar produtos artesanais.",

  client: "Artesana.io",

  category: "sistema",

  service: "Plataforma Web",

  year: 2026,

  featured: false,

  url: "https://artesanaio.com.br/",

  images: {
    card: "/assets/portfolio/artesanaio-01.png",
    desktop: "/assets/portfolio/artesanaio-02.png",
    mobile: "/assets/portfolio/artesanaio-03.png",
  },

  shortDescription:
    "Plataforma desenvolvida para reunir artesãos, apresentar produtos e oferecer uma experiência moderna para divulgação e crescimento do artesanato nacional.",

  challenge:
    "Criar uma plataforma escalável capaz de organizar conteúdos, destacar criadores e oferecer uma experiência intuitiva tanto para visitantes quanto para administradores.",

  solution:
    "Foi desenvolvida uma plataforma moderna baseada na arquitetura UpNode, com foco em escalabilidade, performance, experiência responsiva e organização de conteúdos, preparada para receber novos módulos conforme a evolução do projeto.",

  results: [
    "Arquitetura modular",
    "Experiência totalmente responsiva",
    "Estrutura preparada para expansão",
    "SEO otimizado",
    "Performance elevada",
    "Painel administrativo",
    "Componentização reutilizável",
    "Base preparada para novas funcionalidades",
  ],

  technologies: [
    "Next.js 16",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Prisma",
    "PostgreSQL",
    "Cloudinary",
    "SEO",
    "PWA",
  ],

  color: "#C58B3A",
};