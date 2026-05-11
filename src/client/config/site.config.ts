// src/client/config/site.config.ts
// Configuração visual e institucional — BITTUP

export const siteConfig = {
  nome: "BittUp",

  // ───────────────── LOGO ─────────────────
  logoHorizontal: "/logo-bittup-horizontal.png",
  logoVertical: "/logo-bittup-vertical.png",
  logoAlt: "Logo BittUp - Sua Empresa no Google",

  // ───────────────── WHATSAPP ─────────────────
  whatsapp: "5521982708329",
  whatsappDisplay: "(21) 98270-8329",
  whatsappMensagem:
    "Olá! Vim pelo site da BittUp e quero colocar minha empresa no Google.",

  // ───────────────── HEADER ─────────────────
  headerCta: "Saiba Mais",

  // ───────────────── REDES SOCIAIS ─────────────────
  instagram: "@bitt_up_",
  facebook: "bitt.up.web",
  tiktok: "",

  cidade: "Rio de Janeiro, RJ",

  // ───────────────── NAVEGAÇÃO DESKTOP ─────────────────
  navLinks: [
    { label: "Início", href: "/" },
    { label: "Vantagens", href: "/#advantages" },
    { label: "Sobre", href: "/#aboutbittup" },
    { label: "Portfólio", href: "/portfolio" },
    { label: "Contato", href: "https://wa.me/5521982708329" },
  ],

  // ───────────────── NAVEGAÇÃO MOBILE ─────────────────
  mobileNavLinks: [
    { label: "Início", href: "/" },
    { label: "Vantagens", href: "/#advantages" },
    { label: "Sobre", href: "/#aboutbittup" },
    { label: "Portfólio", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Contato", href: "https://wa.me/5521982708329" },
  ],

  // ───────────────── BENEFÍCIOS ─────────────────
  benefits: [
    {
      title: "Atendimento 100% humano",
      description:
        "Você fala direto no WhatsApp. Nada de robô, nada de enrolação.",
    },
    {
      title: "Soluções ágeis e profissionais",
      description:
        "Sites completos, com domínio e hospedagem inclusos, prontos pra trazer resultado.",
    },
    {
      title: "Presença digital profissional",
      description:
        "Seu negócio aparece no Google com mais autoridade, confiança e chance de fechar novos clientes.",
    },
  ],

  // ───────────────── FOOTER LINKS ─────────────────
  footerNavLinks: [
    { label: "Início", href: "/" },
    { label: "Vantagens", href: "/#advantages" },
    { label: "Sobre", href: "/#aboutbittup" },
    { label: "Portfólio", href: "/portfolio" },
    { label: "Contato", href: "https://wa.me/5521982708329" },
  ],

  // ───────────────── FOOTER ─────────────────
  footerDescription:
    "Criando presença digital para quem quer ser visto de verdade. Fale direto no WhatsApp e comece hoje mesmo.",

  copyrightTagline: "BittUp • Sua empresa no Google",

  // ───────────────── SEO ─────────────────
  seo: {
    titulo: "BittUp | Sua Empresa no Google",
    descricao:
      "Seja encontrado no Google com um site profissional, rápido e acessível. A BittUp cuida de tudo: domínio, hospedagem e design pronto pra gerar clientes.",
    url: "https://bittup.com.br",
    ogImage: "/og-image.png",
    keywords: [
      "bittup",
      "sua empresa no google",
      "criação de sites",
      "site profissional",
      "empresa no google",
      "site para pequenos negócios",
      "presença digital",
      "domínio e hospedagem",
      "site para negócio local",
      "site acessível",
      "rio de janeiro",
    ],
  },

  // ───────────────── TEMA VISUAL ─────────────────
  theme: {
    // FUNDOS
    bgPrimary: "#03131D",
    bgSecondary: "#051A26",
    bgTertiary: "#0A2230",
    bgCard: "#0C1F2B",
    bgHover: "#102938",
    overlay: "#020B12",

    // TEXTOS
    textPrimary: "#F4F8FB",
    textSecondary: "#A9BAC7",
    textTertiary: "#7F96A8",
    textMuted: "#607587",
    textLight: "#FFFFFF",
    textHeroMuted: "#C7D6E2",

    // CORES PRINCIPAIS
    accent: "#12324A",
    accentHover: "#0057D8",
    accentLight: "#2D8CFF",

    // SECUNDÁRIA
    secondary: "#12324A",
    secondaryHover: "#18415F",
    secondaryLight: "#1E5378",

    // STATUS
    success: "#13a300",
    info: "#2EA8FF",
    warning: "#F4B942",
    error: "#FF5C74",

    // BORDAS
    border: "#163041",
    borderLight: "#1E3C50",

    // ADMIN
    adminBg: "#081722",
    adminText: "#F4F8FB",
    adminBorder: "#163041",
  },
};