// src/client/home/HomePage.tsx
import Reveal from "@/client/components/Reveal";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CodeXml,
  Globe2,
  Headphones,
  LayoutTemplate,
  MessageCircle,
  MonitorSmartphone,
  Search,
  ShoppingCart,
  Sparkles,
  Zap,
} from "lucide-react";

import { prisma } from "@/core/lib/prisma";
import { siteConfig } from "@/client/config/site.config";

const services = [
  {
    icon: Globe2,
    title: "Sites Institucionais",
    description:
      "Sites profissionais para apresentar sua empresa, seus serviços e fortalecer sua presença no Google.",
    href: "/servicos/sites-institucionais",
  },
  {
    icon: LayoutTemplate,
    title: "Landing Pages",
    description:
      "Páginas estratégicas para campanhas, lançamentos, eventos e geração de novos contatos.",
    href: "/servicos/landing-pages",
  },
  {
    icon: ShoppingCart,
    title: "Lojas Virtuais",
    description:
      "Estruturas completas para vender produtos online com organização, segurança e facilidade.",
    href: "/servicos/lojas-virtuais",
  },
  {
    icon: CodeXml,
    title: "Sistemas Web",
    description:
      "Soluções personalizadas para organizar processos, clientes, conteúdos e operações da sua empresa.",
    href: "/servicos/sistemas-web",
  },
];

const advantages = [
  {
    icon: Search,
    title: "Estrutura preparada para o Google",
    description:
      "Desenvolvimento com boas práticas de SEO, performance e conteúdo organizado.",
  },
  {
    icon: MonitorSmartphone,
    title: "Experiência em todos os dispositivos",
    description:
      "Sites responsivos, rápidos e preparados para celular, tablet e computador.",
  },
  {
    icon: MessageCircle,
    title: "Atendimento direto e humano",
    description:
      "Você acompanha o projeto e fala diretamente com quem está desenvolvendo.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Entendimento",
    description:
      "Conhecemos sua empresa, seus objetivos, público e necessidades.",
  },
  {
    number: "02",
    title: "Planejamento",
    description:
      "Definimos estrutura, conteúdo, identidade e estratégia do projeto.",
  },
  {
    number: "03",
    title: "Desenvolvimento",
    description:
      "Construímos a solução com atenção ao design, SEO e desempenho.",
  },
  {
    number: "04",
    title: "Publicação",
    description:
      "Colocamos o projeto no ar e acompanhamos os ajustes necessários.",
  },
];

const featuredProjects = [
  {
    title: "Thaíse Libras",
    category: "Site institucional",
    description:
      "Presença digital inclusiva para professora e profissional de Libras.",
    href: "/portfolio/thaise-libras",
  },
  {
    title: "CM Teixeiras",
    category: "Loja virtual",
    description:
      "Estrutura digital para venda de camisas, uniformes e produtos personalizados.",
    href: "/portfolio/cm-teixeiras",
  },
  {
    title: "Jornada da Transformação",
    category: "Landing page",
    description:
      "Página estratégica para divulgação e inscrição em evento presencial.",
    href: "/portfolio/jornada-da-transformacao",
  },
];

const faqPreview = [
  {
    question: "Quanto custa desenvolver um site?",
    answer:
      "O investimento depende do tipo de projeto, quantidade de páginas e funcionalidades. Após entendermos sua necessidade, apresentamos uma proposta personalizada.",
  },
  {
    question: "O site será preparado para aparecer no Google?",
    answer:
      "Sim. Os projetos são desenvolvidos com estrutura semântica, desempenho, responsividade e configurações fundamentais de SEO.",
  },
  {
    question: "Vocês cuidam do domínio e da hospedagem?",
    answer:
      "Sim. Podemos cuidar da configuração técnica, domínio, hospedagem e publicação do projeto.",
  },
  {
    question: "O site funciona bem no celular?",
    answer:
      "Sim. Todas as páginas são desenvolvidas com experiência responsiva para celulares, tablets e computadores.",
  },
];

export default async function HomePage() {
  const categories = await prisma.blogCategory.findMany({
    where: {
      showOnHome: true,
    },
    orderBy: {
      order: "asc",
    },
    take: 3,
  });

  const whatsappHref = `https://wa.me/${
    siteConfig.whatsapp
  }?text=${encodeURIComponent(siteConfig.whatsappMensagem)}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.nome,
    url: siteConfig.seo.url,
    image: `${siteConfig.seo.url}${siteConfig.seo.ogImage}`,
    description: siteConfig.seo.descricao,
    telephone: `+${siteConfig.whatsapp}`,
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rio de Janeiro",
      addressRegion: "RJ",
      addressCountry: "BR",
    },
    sameAs: [
      siteConfig.instagram
        ? `https://instagram.com/${siteConfig.instagram.replace("@", "")}`
        : null,
      siteConfig.facebook
        ? `https://facebook.com/${siteConfig.facebook}`
        : null,
    ].filter(Boolean),
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

      {/* HERO */}
      <section
        className="relative min-h-[760px] overflow-hidden border-b pt-[110px] lg:min-h-screen lg:pt-[120px]"
        style={{
          background:
            "radial-gradient(circle at 80% 24%, rgba(45,140,255,0.18), transparent 25%), radial-gradient(circle at 15% 80%, rgba(30,83,120,0.18), transparent 28%), linear-gradient(180deg, var(--color-bg-primary) 0%, #031722 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-full opacity-[0.13]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 85%)",
          }}
        />

        <div className="relative z-10 mx-auto grid min-h-[650px] max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-20">
          <div className="max-w-3xl">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
              style={{
                backgroundColor: "rgba(45,140,255,0.07)",
                borderColor: "var(--color-borderLight)",
                color: "var(--color-textHeroMuted)",
              }}
            >
              <Sparkles className="h-4 w-4" />

              <span
                className="text-[10px] uppercase tracking-[0.2em] sm:text-xs"
                style={{
                  fontFamily: "var(--font-heading)",
                }}
              >
                Desenvolvimento de soluções digitais
              </span>
            </div>

            <h1
              className="mb-6 text-[2.6rem] uppercase leading-[0.98] sm:text-[3.5rem] md:text-[4.8rem] lg:text-[5.4rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Sua empresa precisa
              <br />
              ser encontrada,
              <br />

              <span style={{ color: "var(--color-accentLight)" }}>
                lembrada e escolhida.
              </span>
            </h1>

            <p
              className="mb-8 max-w-2xl text-base leading-8 md:text-lg"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              A BittUp desenvolve sites institucionais, landing pages, lojas
              virtuais e sistemas web para empresas que querem crescer com uma
              presença digital profissional.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] transition hover:-translate-y-0.5 hover:brightness-110"
                style={{
                  backgroundColor: "var(--color-success)",
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                  boxShadow: "0 14px 36px rgba(19,163,0,0.22)",
                }}
              >
                Solicitar orçamento
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                href="/portfolio"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-white/5"
                style={{
                  borderColor: "var(--color-borderLight)",
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Conhecer projetos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div
              className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              <span className="flex items-center gap-2">
                <Check
                  className="h-4 w-4"
                  style={{ color: "var(--color-success)" }}
                />
                Design responsivo
              </span>

              <span className="flex items-center gap-2">
                <Check
                  className="h-4 w-4"
                  style={{ color: "var(--color-success)" }}
                />
                Estrutura otimizada para SEO
              </span>

              <span className="flex items-center gap-2">
                <Check
                  className="h-4 w-4"
                  style={{ color: "var(--color-success)" }}
                />
                Atendimento humano
              </span>
            </div>
          </div>

          <div className="relative flex min-h-[360px] items-end justify-center lg:min-h-[620px] lg:justify-end">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
              style={{
                backgroundColor: "rgba(45,140,255,0.14)",
              }}
            />

            <Image
              src="/hero-bittup-person.png"
              alt="Profissional apresentando soluções digitais desenvolvidas pela BittUp"
              width={540}
              height={680}
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="relative z-10 h-auto max-h-[620px] w-auto object-contain"
            />

            <div
              className="absolute bottom-6 left-0 z-20 max-w-[240px] rounded-2xl border p-4 backdrop-blur-md sm:left-8 lg:bottom-12 lg:left-0"
              style={{
                backgroundColor: "rgba(12,31,43,0.88)",
                borderColor: "var(--color-borderLight)",
              }}
            >
              <div className="mb-2 flex items-center gap-2">
                <Zap
                  className="h-4 w-4"
                  style={{ color: "var(--color-accentLight)" }}
                />

                <span
                  className="text-[10px] uppercase tracking-[0.16em]"
                  style={{
                    color: "var(--color-accentLight)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Presença digital
                </span>
              </div>

              <p
                className="text-sm leading-6"
                style={{
                  color: "var(--color-textHeroMuted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Tecnologia, estratégia e design trabalhando juntos pelo seu
                negócio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* APRESENTAÇÃO INSTITUCIONAL */}
      <section
        className="border-b py-20 md:py-28"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="relative overflow-hidden rounded-2xl border">
            <Image
              src="/about-bittup-team.jpg"
              alt="Planejamento de projeto digital realizado pela BittUp"
              width={800}
              height={760}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full min-h-[420px] w-full object-cover"
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(3,19,29,0.55), transparent 60%)",
              }}
            />
          </div>

          <div>
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Sobre a BittUp
            </p>

            <h2
              className="mb-6 text-[2rem] leading-tight sm:text-[2.6rem] md:text-[3.1rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Desenvolvimento digital com estratégia, tecnologia e cuidado.
            </h2>

            <p
              className="mb-5 text-sm leading-7 md:text-base"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              A BittUp nasceu para facilitar o acesso de pequenas e médias
              empresas a soluções digitais profissionais, sem processos
              confusos ou atendimento distante.
            </p>

            <p
              className="mb-8 text-sm leading-7 md:text-base"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Cada projeto é desenvolvido considerando os objetivos do negócio,
              a experiência do cliente, o posicionamento da marca e a
              possibilidade de crescimento futuro.
            </p>

            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 text-sm font-semibold transition hover:gap-3"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Conheça a história da BittUp
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section
        className="border-b py-20 md:py-28"
        style={{
          background:
            "linear-gradient(180deg, var(--color-bg-primary) 0%, #041925 100%)",
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
                Nossos serviços
              </p>

              <h2
                className="text-[2rem] leading-tight sm:text-[2.6rem] md:text-[3.1rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Soluções digitais para diferentes momentos da sua empresa.
              </h2>
            </div>

            <Link
              href="/servicos"
              className="inline-flex items-center gap-2 text-sm font-semibold transition hover:gap-3"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Ver todos os serviços
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
  {services.map((service, index) => {
    const Icon = service.icon;

    return (
      <Reveal
        key={service.title}
        delay={index * 100}
        direction={index % 2 === 0 ? "right" : "left"}
      >
        <Link
          href={service.href}
          className="group relative block h-full overflow-hidden rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 md:p-8"
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
            className="mb-3 text-xl md:text-2xl"
            style={{
              color: "var(--color-text-light)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {service.title}
          </h3>

          <p
            className="mb-7 max-w-xl text-sm leading-7"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-body)",
            }}
          >
            {service.description}
          </p>

          <span
            className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
            style={{
              color: "var(--color-accentLight)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Conhecer serviço
            <ChevronRight className="h-4 w-4" />
          </span>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--color-accentLight), transparent)",
            }}
          />
        </Link>
      </Reveal>
    );
  })}
</div>
        </div>
      </section>

      {/* VANTAGENS */}
      <section
        id="advantages"
        className="scroll-mt-24 border-b py-20 md:py-28"
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
              Por que escolher a BittUp?
            </p>

            <h2
              className="text-[2rem] leading-tight sm:text-[2.6rem] md:text-[3.1rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Seu projeto precisa ser bonito, mas também precisa funcionar.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;

              return (
                <Reveal
                  key={advantage.title}
                  delay={index * 130}
                  direction="up"
                >
                  <article
                    className="h-full rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 md:p-8"
                    style={{
                      backgroundColor: "var(--color-bg-card)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <div
                      className="bittup-icon-pulse mb-6 flex h-12 w-12 items-center justify-center rounded-full"
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
                      {advantage.title}
                    </h3>

                    <p
                      className="text-sm leading-7"
                      style={{
                        color: "var(--color-text-secondary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {advantage.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PORTFÓLIO */}
      <section
        className="border-b py-20 md:py-28"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="relative -mx-4 overflow-hidden sm:-mx-6">
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 sm:w-24"
    style={{
      background:
        "linear-gradient(90deg, var(--color-bg-primary), transparent)",
    }}
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 sm:w-24"
    style={{
      background:
        "linear-gradient(270deg, var(--color-bg-primary), transparent)",
    }}
  />

  <div className="bittup-portfolio-marquee flex w-max gap-5 px-4 sm:px-6">
    {[...featuredProjects, ...featuredProjects].map((project, index) => {
      const duplicated = index >= featuredProjects.length;

      return (
        <Link
          key={`${project.title}-${index}`}
          href={project.href}
          aria-hidden={duplicated ? true : undefined}
          tabIndex={duplicated ? -1 : undefined}
          className="group flex min-h-[340px] w-[290px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 sm:w-[360px] md:p-8 lg:w-[390px]"
          style={{
            background:
              index % featuredProjects.length === 1
                ? "linear-gradient(145deg, #12324A 0%, #071A27 80%)"
                : "linear-gradient(145deg, #0C1F2B 0%, #071A27 100%)",
            borderColor: "var(--color-border)",
          }}
        >
          <div>
            <span
              className="mb-8 inline-flex rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.16em]"
              style={{
                borderColor: "var(--color-borderLight)",
                color: "var(--color-textHeroMuted)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {project.category}
            </span>

            <h3
              className="mb-4 text-2xl"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {project.title}
            </h3>

            <p
              className="text-sm leading-7"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              {project.description}
            </p>
          </div>

          <span
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
            style={{
              color: "var(--color-accentLight)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Ver estudo de caso
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      );
    })}
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
          <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <p
                className="mb-4 text-[11px] uppercase tracking-[0.22em]"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Como trabalhamos
              </p>

              <h2
                className="text-[2rem] leading-tight sm:text-[2.6rem] md:text-[3.1rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Um processo organizado do planejamento à publicação.
              </h2>
            </div>

            <div className="flex items-end lg:justify-end">
              <Link
                href="/processo"
                className="inline-flex items-center gap-2 text-sm font-semibold transition hover:gap-3"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Conhecer nosso processo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      {/* FAQ RESUMIDO */}
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
              Algumas dúvidas antes de iniciar seu projeto.
            </h2>

            <p
              className="mb-7 max-w-md text-sm leading-7 md:text-base"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Reunimos respostas sobre desenvolvimento, prazos, SEO,
              hospedagem e funcionamento dos projetos.
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
            {faqPreview.map((faq) => (
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
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition group-open:rotate-90"
                    style={{
                      backgroundColor: "rgba(45,140,255,0.1)",
                      color: "var(--color-accentLight)",
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
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

      {/* BLOG */}
      {categories.length > 0 && (
        <section
          className="border-b py-20 md:py-28"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p
                  className="mb-4 text-[11px] uppercase tracking-[0.22em]"
                  style={{
                    color: "var(--color-accentLight)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Conteúdos
                </p>

                <h2
                  className="text-[2rem] leading-tight sm:text-[2.6rem] md:text-[3.1rem]"
                  style={{
                    color: "var(--color-text-light)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Informação para fortalecer sua presença digital.
                </h2>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold transition hover:gap-3"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Acessar o blog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/categoria/${category.slug}`}
                  className="group rounded-2xl border p-6 transition duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div
                    className="mb-7 flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: "rgba(45,140,255,0.1)",
                      color: "var(--color-accentLight)",
                    }}
                  >
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>

                  <h3
                    className="mb-3 text-xl"
                    style={{
                      color: "var(--color-text-light)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {category.name}
                  </h3>

                  <p
                    className="mb-6 text-sm leading-7"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {category.description ??
                      "Conteúdos para ajudar empresas a crescerem e serem encontradas online."}
                  </p>

                  <span
                    className="inline-flex items-center gap-2 text-sm font-semibold transition group-hover:gap-3"
                    style={{
                      color: "var(--color-accentLight)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Ver conteúdos
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{
          background:
            "radial-gradient(circle at 85% 50%, rgba(45,140,255,0.18), transparent 25%), linear-gradient(145deg, #08212B 0%, #03131D 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute -right-28 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-[120px]"
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
              Vamos conversar?
            </p>

            <h2
              className="mb-5 text-[2rem] leading-tight sm:text-[2.7rem] md:text-[3.4rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Sua empresa está pronta para dar o próximo passo no digital?
            </h2>

            <p
              className="max-w-2xl text-sm leading-7 md:text-base"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Conte o que você precisa e receba uma orientação sobre a solução
              mais adequada para o seu negócio.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] transition hover:-translate-y-0.5 hover:brightness-110"
              style={{
                backgroundColor: "var(--color-success)",
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
                boxShadow: "0 14px 36px rgba(19,163,0,0.22)",
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Conversar no WhatsApp
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