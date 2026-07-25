// src/client/projects/el-vidracaria.ts

import { Project } from "./types";

export const elVidracaria: Project = {
  slug: "el-vidracaria",

  title: "E & L Vidraçaria",

  subtitle:
    "Site institucional para empresa especializada em vidros e esquadrias.",

  client: "E & L Vidraçaria",

  category: "site",

  service: "Site Institucional",

  year: 2025,

  featured: true,

  url: "https://elvidracaria.com.br/",

  images: {
    card: "/assets/portfolio/el-vidracaria-01.png",
    desktop: "/assets/portfolio/el-vidracaria-02.png",
    mobile: "/assets/portfolio/el-vidracaria-03.png",
  },

  shortDescription:
    "Site institucional desenvolvido para fortalecer a presença digital da empresa e facilitar o contato de novos clientes.",

  challenge:
    "Criar um site moderno que transmitisse confiança, destacasse os serviços e facilitasse o contato pelo WhatsApp.",

  solution:
    "Foi desenvolvida uma estrutura responsiva com foco em velocidade, SEO e apresentação clara dos serviços, utilizando a arquitetura UpNode.",

  results: [
    "Layout moderno",
    "SEO otimizado",
    "Experiência responsiva",
    "Integração com WhatsApp",
    "Carregamento rápido",
    "Arquitetura reutilizável",
  ],

  technologies: [
    "Next.js 16",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Prisma",
    "SEO",
  ],

  color: "#2D8CFF",
};