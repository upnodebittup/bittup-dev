// src/client/projects/diario-sentimentos.ts

import type { Project } from "./types";

export const diarioSentimentos: Project = {
  slug: "diario-de-sentimentos",

  title: "Diário de Sentimentos",

  subtitle:
    "Aplicação web desenvolvida para registrar emoções, reflexões e acompanhar o bem-estar emocional.",

  client: "Projeto Próprio",

  category: "sistema",

  service: "Sistema Web",

  year: 2026,

  featured: true,

  url: "https://diario-de-sentimentos.vercel.app/",

  images: {
    card: "/assets/portfolio/diario-de-sentimentos-01.png",
    desktop: "/assets/portfolio/diario-de-sentimentos-02.png",
    mobile: "/assets/portfolio/diario-de-sentimentos-03.png",
  },

  shortDescription:
    "Sistema web desenvolvido para registrar sentimentos, organizar reflexões pessoais e acompanhar a evolução emocional através de uma interface moderna e intuitiva.",

  challenge:
    "Criar uma aplicação com foco na experiência do usuário, permitindo registrar sentimentos de forma simples, rápida e agradável, mantendo uma arquitetura preparada para crescimento.",

  solution:
    "Foi desenvolvido um sistema completo utilizando a arquitetura da UpNode, com foco em organização das informações, interface responsiva, desempenho e uma base preparada para receber novas funcionalidades futuramente.",

  results: [
    "Interface moderna e intuitiva",
    "Experiência totalmente responsiva",
    "Arquitetura modular",
    "Estrutura preparada para evolução",
    "SEO otimizado",
    "Alta performance",
    "Código reutilizável",
    "Base escalável",
  ],

  technologies: [
    "Next.js 16",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Prisma",
    "PostgreSQL",
    "PWA",
    "SEO",
  ],

  color: "#6C63FF",
};