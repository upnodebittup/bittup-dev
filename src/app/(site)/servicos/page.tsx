// src/app/(site)/servicos/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CodeXml,
  Globe2,
  LayoutTemplate,
  MessageCircle,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Zap,
} from "lucide-react";

import { siteConfig } from "@/client/config/site.config";

export const metadata: Metadata = {
  title: "Serviços de Desenvolvimento Web | BittUp",
  description:
    "Conheça os serviços da BittUp: sites institucionais, landing pages, lojas virtuais e sistemas web personalizados para empresas.",
  alternates: {
    canonical: `${siteConfig.seo.url}/servicos`,
  },
  openGraph: {
    title: "Serviços de Desenvolvimento Web | BittUp",
    description:
      "Sites institucionais, landing pages, lojas virtuais e sistemas web desenvolvidos para fortalecer a presença digital da sua empresa.",
    url: `${siteConfig.seo.url}/servicos`,
    siteName: siteConfig.nome,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: "Serviços de desenvolvimento web da BittUp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Serviços de Desenvolvimento Web | BittUp",
    description:
      "Soluções digitais profissionais para empresas que querem crescer online.",
    images: [siteConfig.seo.ogImage],
  },
};

const services = [
  {
    icon: Globe2,
    title: "Sites Institucionais",
    description:
      "Sites profissionais para apresentar sua empresa, seus serviços, diferenciais e canais de contato com clareza e autoridade.",
    href: "/servicos/sites-institucionais",
    features: [
      "Design personalizado e responsivo",
      "Estrutura preparada para SEO",
      "Integração com WhatsApp",
      "Domínio e hospedagem",
      "Painel administrativo opcional",
    ],
  },
  {
    icon: LayoutTemplate,
    title: "Landing Pages",
    description:
      "Páginas estratégicas desenvolvidas para campanhas, eventos, lançamentos, captação de leads e vendas.",
    href: "/servicos/landing-pages",
    features: [
      "Estrutura focada em conversão",
      "Botões e chamadas estratégicas",
      "Formulários de captação",
      "Integração com ferramentas externas",
      "Otimização para anúncios",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Lojas Virtuais",
    description:
      "Estruturas completas para vender produtos online com organização, segurança e uma experiência simples para o cliente.",
    href: "/servicos/lojas-virtuais",
    features: [
      "Cadastro de produtos e categorias",
      "Carrinho e finalização de compra",
      "Integração com pagamentos",
      "Gestão de pedidos",
      "Experiência responsiva",
    ],
  },
  {
    icon: CodeXml,
    title: "Sistemas Web",
    description:
      "Soluções personalizadas para organizar processos, clientes, conteúdos, pagamentos e operações internas.",
    href: "/servicos/sistemas-web",
    features: [
      "Painéis administrativos",
      "Áreas restritas e área do cliente",
      "Automação de processos",
      "Integração com APIs",
      "Arquitetura preparada para crescer",
    ],
  },
];

const benefits = [
  {
    icon: Search,
    title: "SEO desde a estrutura",
    description:
      "Cada página é desenvolvida com organização semântica, performance e boas práticas para mecanismos de busca.",
  },
  {
    icon: MonitorSmartphone,
    title: "Experiência responsiva",
    description:
      "Seu projeto funciona corretamente em celulares, tablets e computadores, sem prejudicar a experiência do usuário.",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Desenvolvimento focado em velocidade, carregamento otimizado e navegação eficiente.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança e estabilidade",
    description:
      "Aplicamos boas práticas técnicas para proteger o projeto e reduzir riscos durante sua utilização.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Entendimento do projeto",
    description:
      "Analisamos sua empresa, seu público, seus objetivos e o momento atual do negócio.",
  },
  {
    number: "02",
    title: "Planejamento estratégico",
    description:
      "Definimos páginas, conteúdos, funcionalidades, identidade visual e prioridades.",
  },
  {
    number: "03",
    title: "Design e desenvolvimento",
    description:
      "Criamos a solução com atenção à experiência, responsividade, SEO e desempenho.",
  },
  {
    number: "04",
    title: "Revisão e publicação",
    description:
      "Você acompanha o resultado, solicita ajustes e o projeto é publicado após aprovação.",
  },
];

const comparisons = [
  {
    title: "Site Institucional",
    idealFor:
      "Empresas, profissionais e negócios que precisam apresentar serviços e transmitir autoridade.",
    mainGoal: "Fortalecer presença digital e gerar contatos.",
  },
  {
    title: "Landing Page",
    idealFor:
      "Campanhas, eventos, lançamentos, produtos específicos e captação de leads.",
    mainGoal: "Conduzir o visitante para uma ação específica.",
  },
  {
    title: "Loja Virtual",
    idealFor:
      "Empresas e empreendedores que desejam vender produtos diretamente pela internet.",
    mainGoal: "Organizar produtos, pagamentos e pedidos.",
  },
  {
    title: "Sistema Web",
    idealFor:
      "Negócios que precisam organizar operações, clientes, dados ou processos internos.",
    mainGoal: "Automatizar e centralizar atividades.",
  },
];

const faqs = [
  {
    question: "Qual serviço é mais indicado para minha empresa?",
    answer:
      "Isso depende do objetivo do projeto. Um site institucional é indicado para apresentar a empresa, uma landing page para campanhas específicas, uma loja virtual para vendas e um sistema web para organizar processos.",
  },
  {
    question: "Os projetos são feitos a partir de modelos prontos?",
    answer:
      "A estrutura técnica utiliza uma base profissional e reutilizável, mas cada projeto recebe identidade, conteúdo, páginas e configurações próprias.",
  },
  {
    question: "A BittUp cuida do domínio e da hospedagem?",
    answer:
      "Sim. Podemos configurar domínio, hospedagem, banco de dados, publicação e demais recursos necessários para colocar o projeto no ar.",
  },
  {
    question: "O site será preparado para o Google?",
    answer:
      "Sim. Os projetos recebem estrutura semântica, títulos, descrições, URLs organizadas, performance e outras configurações fundamentais de SEO.",
  },
  {
    question: "É possível adicionar novas funcionalidades depois?",
    answer:
      "Sim. Os projetos são desenvolvidos considerando manutenção e evolução, permitindo adicionar páginas, integrações e funcionalidades futuras.",
  },
];

export default function ServicesPage() {
  const whatsappHref = `https://wa.me/${
    siteConfig.whatsapp
  }?text=${encodeURIComponent(
    "Olá! Vim pela página de serviços da BittUp e gostaria de conversar sobre um projeto."
  )}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Serviços de desenvolvimento web da BittUp",
    description:
      "Sites institucionais, landing pages, lojas virtuais e sistemas web personalizados.",
    url: `${siteConfig.seo.url}/servicos`,
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        url: `${siteConfig.seo.url}${service.href}`,
        provider: {
          "@type": "Organization",
          name: siteConfig.nome,
          url: siteConfig.seo.url,
        },
        areaServed: {
          "@type": "Country",
          name: "Brasil",
        },
      },
    })),
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main
      className="w-full overflow-x-hidden"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-light)",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />

      {/* HERO */}
      <section
        className="relative overflow-hidden border-b pb-20 pt-[40px] md:pb-28 md:pt-[50px]"
        style={{
          background:
            "radial-gradient(circle at 82% 30%, rgba(45,140,255,0.18), transparent 26%), radial-gradient(circle at 12% 82%, rgba(18,50,74,0.32), transparent 30%), linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 90%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-4xl">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
              style={{
                backgroundColor: "rgba(45,140,255,0.07)",
                borderColor: "var(--color-borderLight)",
                color: "var(--color-accentLight)",
              }}
            >
              <Sparkles className="h-4 w-4" />

              <span
                className="text-[10px] uppercase tracking-[0.2em] sm:text-xs"
                style={{
                  fontFamily: "var(--font-heading)",
                }}
              >
                Serviços de desenvolvimento web
              </span>
            </div>

            <h1
              className="mb-7 text-[2.5rem] uppercase leading-[0.98] sm:text-[2rem] md:text-[2.5rem] lg:text-[3.5rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Soluções digitais
              <br />
              para empresas que
              <br />

              <span style={{ color: "var(--color-accentLight)" }}>
                querem crescer.
              </span>
            </h1>

            <p
              className="mb-9 max-w-3xl text-base leading-8 md:text-lg"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Desenvolvemos sites institucionais, landing pages, lojas virtuais
              e sistemas web personalizados para fortalecer sua marca,
              organizar processos e criar novas oportunidades.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
                style={{
                  backgroundColor: "var(--color-success)",
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                  boxShadow: "0 14px 36px rgba(19,163,0,0.22)",
                }}
              >
                <MessageCircle className="h-4 w-4" />
                Conversar sobre meu projeto
              </a>

              <Link
                href="#servicos"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-white/5"
                style={{
                  borderColor: "var(--color-borderLight)",
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Conhecer serviços
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUÇÃO */}
      <section
        className="border-b py-20 md:py-28"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Como podemos ajudar
            </p>

            <h2
              className="text-[2rem] leading-tight sm:text-[2.6rem] md:text-[3.1rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Tecnologia precisa resolver problemas reais do seu negócio.
            </h2>
          </div>

          <div>
            <p
              className="mb-5 text-sm leading-7 md:text-base"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Um projeto digital não deve existir apenas para ser bonito. Ele
              precisa transmitir confiança, facilitar o contato, organizar
              informações e apoiar os objetivos da empresa.
            </p>

            <p
              className="text-sm leading-7 md:text-base"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Por isso, cada solução da BittUp é planejada considerando o
              público, o posicionamento, as funcionalidades necessárias e as
              possibilidades de crescimento futuro.
            </p>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section
        id="servicos"
        className="scroll-mt-24 border-b py-20 md:py-28"
        style={{
          background:
            "linear-gradient(180deg, var(--color-bg-primary) 0%, #041925 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 max-w-3xl">
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Nossos serviços
            </p>

            <h2
              className="mb-5 text-[2rem] leading-tight sm:text-[2.6rem] md:text-[3.1rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Escolha a solução que acompanha o momento da sua empresa.
            </h2>

            <p
              className="text-sm leading-7 md:text-base"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Cada serviço possui uma estrutura própria, mas todos seguem os
              mesmos padrões de qualidade, responsividade, SEO e manutenção.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 md:p-8"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div className="mb-7 flex items-start justify-between gap-5">
                    <div
                      className="bittup-icon-pulse flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: "rgba(45,140,255,0.11)",
                        color: "var(--color-accentLight)",
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <span
                      aria-hidden="true"
                      className="shrink-0 text-3xl font-semibold leading-none opacity-10 sm:text-4xl"
                      style={{
                        color: "var(--color-text-light)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3
                    className="mb-4 text-2xl"
                    style={{
                      color: "var(--color-text-light)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {service.title}
                  </h3>

                  <p
                    className="mb-7 text-sm leading-7"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {service.description}
                  </p>

                  <ul className="mb-8 space-y-3">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm"
                        style={{
                          color: "var(--color-text-secondary)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{
                            backgroundColor:
                              "color-mix(in srgb, var(--color-success) 18%, transparent)",
                            color: "var(--color-success)",
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </span>

                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={service.href}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                    style={{
                      color: "var(--color-accentLight)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Conhecer este serviço
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section
        className="border-b py-20 md:py-28"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Padrão BittUp
            </p>

            <h2
              className="mb-5 text-[2rem] leading-tight sm:text-[2.6rem] md:text-[3.1rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              O que todos os nossos projetos têm em comum.
            </h2>

            <p
              className="text-sm leading-7 md:text-base"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Independentemente do serviço escolhido, o desenvolvimento segue
              princípios de qualidade, experiência e evolução.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="rounded-2xl border p-6 transition duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div
                    className="bittup-icon-pulse mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: "rgba(45,140,255,0.11)",
                      color: "var(--color-accentLight)",
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3
                    className="mb-3 text-lg"
                    style={{
                      color: "var(--color-text-light)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {benefit.title}
                  </h3>

                  <p
                    className="text-sm leading-7"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPARATIVO */}
      <section
        className="border-b py-20 md:py-28"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 max-w-3xl">
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Qual solução escolher?
            </p>

            <h2
              className="mb-5 text-[2rem] leading-tight sm:text-[2.6rem] md:text-[3.1rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Cada tipo de projeto atende a uma necessidade diferente.
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border">
            <div className="overflow-x-auto">
              <table className="min-w-[780px] w-full border-collapse">
                <thead
                  style={{
                    backgroundColor: "var(--color-bg-tertiary)",
                  }}
                >
                  <tr>
                    <th
                      className="px-6 py-5 text-left text-xs uppercase tracking-[0.16em]"
                      style={{
                        color: "var(--color-text-light)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      Solução
                    </th>

                    <th
                      className="px-6 py-5 text-left text-xs uppercase tracking-[0.16em]"
                      style={{
                        color: "var(--color-text-light)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      Ideal para
                    </th>

                    <th
                      className="px-6 py-5 text-left text-xs uppercase tracking-[0.16em]"
                      style={{
                        color: "var(--color-text-light)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      Objetivo principal
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {comparisons.map((item) => (
                    <tr
                      key={item.title}
                      className="border-t"
                      style={{
                        backgroundColor: "var(--color-bg-card)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <td
                        className="px-6 py-6 align-top text-sm font-semibold"
                        style={{
                          color: "var(--color-accentLight)",
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        {item.title}
                      </td>

                      <td
                        className="px-6 py-6 align-top text-sm leading-7"
                        style={{
                          color: "var(--color-text-secondary)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {item.idealFor}
                      </td>

                      <td
                        className="px-6 py-6 align-top text-sm leading-7"
                        style={{
                          color: "var(--color-text-secondary)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {item.mainGoal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESSO */}
      <section
        className="border-b py-20 md:py-28"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p
                className="mb-4 text-[11px] uppercase tracking-[0.22em]"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Como funciona
              </p>

              <h2
                className="text-[2rem] leading-tight sm:text-[2.6rem] md:text-[3.1rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Um processo claro do planejamento à publicação.
              </h2>
            </div>

            <Link
              href="/processo"
              className="inline-flex items-center gap-2 text-sm font-semibold transition hover:gap-3"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Conhecer processo completo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ol className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step) => (
              <li
                key={step.number}
                className="rounded-2xl border p-6"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                <span
                  className="mb-7 block text-sm font-semibold"
                  style={{
                    color: "var(--color-accentLight)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {step.number}
                </span>

                <h3
                  className="mb-3 text-lg"
                  style={{
                    color: "var(--color-text-light)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {step.title}
                </h3>

                <p
                  className="text-sm leading-7"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="border-b py-20 md:py-28"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Perguntas frequentes
            </p>

            <h2
              className="mb-6 text-[2rem] leading-tight sm:text-[2.6rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Dúvidas sobre nossos serviços.
            </h2>

            <p
              className="mb-7 max-w-md text-sm leading-7 md:text-base"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Estas são algumas das perguntas mais comuns antes do início de um
              projeto.
            </p>

            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-sm font-semibold transition hover:gap-3"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Ver todas as perguntas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border p-5"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span
                    className="text-sm font-medium leading-6 md:text-base"
                    style={{
                      color: "var(--color-text-light)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {faq.question}
                  </span>

                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition duration-300 group-open:rotate-90"
                    style={{
                      backgroundColor: "rgba(45,140,255,0.1)",
                      color: "var(--color-accentLight)",
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </summary>

                <p
                  className="mt-4 pr-10 text-sm leading-7"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{
          background:
            "radial-gradient(circle at 85% 50%, rgba(45,140,255,0.18), transparent 25%), linear-gradient(145deg, var(--color-bg-tertiary) 0%, var(--color-bg-primary) 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-[120px]"
          style={{
            backgroundColor: "rgba(45,140,255,0.2)",
          }}
        />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Ainda não sabe qual escolher?
            </p>

            <h2
              className="mb-5 text-[2rem] leading-tight sm:text-[2.7rem] md:text-[3.4rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Conte o que sua empresa precisa e vamos definir a melhor solução.
            </h2>

            <p
              className="max-w-2xl text-sm leading-7 md:text-base"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Você não precisa chegar com toda a estrutura pronta. A BittUp
              ajuda a organizar as ideias, definir prioridades e planejar o
              projeto.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
              style={{
                backgroundColor: "var(--color-success)",
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
                boxShadow: "0 14px 36px rgba(19,163,0,0.22)",
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Falar no WhatsApp
            </a>

            <Link
              href="/orcamento"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-white/5"
              style={{
                borderColor: "var(--color-borderLight)",
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Solicitar orçamento
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}