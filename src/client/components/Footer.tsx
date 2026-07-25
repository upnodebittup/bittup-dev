// src/client/components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CodeXml,
  Globe2,
  Instagram,
  LayoutTemplate,
  MapPin,
  MessageCircle,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

import { siteConfig } from "@/client/config/site.config";

const servicesLinks = [
  {
    label: "Sites institucionais",
    href: "/servicos/sites-institucionais",
    icon: Globe2,
  },
  {
    label: "Landing pages",
    href: "/servicos/landing-pages",
    icon: LayoutTemplate,
  },
  {
    label: "Lojas virtuais",
    href: "/servicos/lojas-virtuais",
    icon: ShoppingCart,
  },
  {
    label: "Sistemas web",
    href: "/servicos/sistemas-web",
    icon: CodeXml,
  },
];

const institutionalLinks = [
  {
    label: "Sobre a BittUp",
    href: "/sobre",
  },
  {
    label: "Portfólio",
    href: "/portfolio",
  },
  {
    label: "Nosso processo",
    href: "/processo",
  },
  {
    label: "Perguntas frequentes",
    href: "/faq",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Loja",
    href: "/loja",
  },
];

const supportLinks = [
  {
    label: "Solicitar orçamento",
    href: "/orcamento",
  },
  {
    label: "Entrar em contato",
    href: "/contato",
  },
  {
    label: "Política de privacidade",
    href: "/privacidade",
  },
  {
    label: "Termos de uso",
    href: "/termos",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const whatsappHref = `https://wa.me/${
    siteConfig.whatsapp
  }?text=${encodeURIComponent(siteConfig.whatsappMensagem)}`;

  const instagramHref = siteConfig.instagram
    ? `https://instagram.com/${siteConfig.instagram.replace("@", "")}`
    : "";

  const benefits = siteConfig.benefits ?? [
    {
      title: "Atendimento humano",
      description:
        "Você conversa diretamente com quem desenvolve o seu projeto.",
    },
    {
      title: "Soluções profissionais",
      description:
        "Estruturas pensadas para posicionamento, desempenho e crescimento.",
    },
    {
      title: "Presença no Google",
      description:
        "Sites preparados para fortalecer a autoridade digital da sua empresa.",
    },
  ];

  const benefitIcons = [
    MessageCircle,
    Sparkles,
    Search,
  ];

  return (
    <footer
      className="w-full overflow-hidden"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-light)",
      }}
    >
      {/* CTA PRINCIPAL */}
      <section
        className="relative overflow-hidden border-t border-b py-16 md:py-20"
        style={{
          background:
            "radial-gradient(circle at 85% 50%, rgba(45,140,255,0.17), transparent 28%), linear-gradient(145deg, var(--color-bg-tertiary) 0%, var(--color-bg-primary) 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-[120px]"
          style={{
            backgroundColor: "rgba(45,140,255,0.2)",
          }}
        />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <p
              className="mb-4 text-[10px] uppercase tracking-[0.22em] sm:text-[11px]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Vamos construir algo juntos?
            </p>

            <h2
              className="mb-4 text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[3rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Transforme sua ideia em uma presença digital profissional.
            </h2>

            <p
              className="max-w-2xl text-sm leading-7 md:text-base"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Conte o que sua empresa precisa e descubra qual solução faz mais
              sentido para o seu momento.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
              style={{
                backgroundColor: "var(--color-success)",
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
                boxShadow: "0 14px 36px rgba(19,163,0,0.22)",
              }}
            >
              <MessageCircle className="h-4 w-4" />

              Falar no WhatsApp

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <Link
              href="/orcamento"
              className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-full border px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] transition duration-300 hover:bg-white/5"
              style={{
                borderColor: "var(--color-borderLight)",
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Solicitar orçamento

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section
        className="border-b py-14 md:py-16"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-5">
            {benefits.map((item, index) => {
              const Icon = benefitIcons[index] ?? BadgeCheck;

              return (
                <article
                  key={item.title}
                  className="group flex items-start gap-4 rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 md:p-6"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div
                    className="bittup-icon-pulse flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: "rgba(45,140,255,0.11)",
                      color: "var(--color-accentLight)",
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3
                      className="mb-2 text-base"
                      style={{
                        color: "var(--color-text-light)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="text-sm leading-6"
                      style={{
                        color: "var(--color-text-secondary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER PRINCIPAL */}
      <section
        className="relative py-16 md:py-20"
        style={{
          background:
            "linear-gradient(180deg, var(--color-bg-primary) 0%, #020e16 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
            {/* MARCA */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link
                href="/"
                aria-label={`Ir para o início — ${siteConfig.nome}`}
                className="inline-flex"
              >
                <Image
                  src={siteConfig.logoHorizontal}
                  alt={siteConfig.logoAlt}
                  width={190}
                  height={76}
                  className="mb-6 h-auto w-[170px] object-contain"
                />
              </Link>

              <p
                className="mb-7 max-w-sm text-sm leading-7"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {siteConfig.footerDescription}
              </p>

              <div className="flex items-center gap-3">
                {instagramHref && (
                  <Link
                    href={instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram da BittUp"
                    className="flex h-11 w-11 items-center justify-center rounded-full border transition duration-300 hover:-translate-y-1"
                    style={{
                      color: "var(--color-text-light)",
                      borderColor: "var(--color-borderLight)",
                      backgroundColor: "rgba(255,255,255,0.025)",
                    }}
                  >
                    <Instagram className="h-[18px] w-[18px]" />
                  </Link>
                )}

                <Link
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp da BittUp"
                  className="flex h-11 w-11 items-center justify-center rounded-full border transition duration-300 hover:-translate-y-1 hover:brightness-110"
                  style={{
                    color: "var(--color-text-light)",
                    borderColor: "var(--color-success)",
                    backgroundColor:
                      "color-mix(in srgb, var(--color-success) 18%, transparent)",
                  }}
                >
                  <MessageCircle className="h-[18px] w-[18px]" />
                </Link>

                <Link
                  href={siteConfig.seo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Site da BittUp"
                  className="flex h-11 w-11 items-center justify-center rounded-full border transition duration-300 hover:-translate-y-1"
                  style={{
                    color: "var(--color-text-light)",
                    borderColor: "var(--color-borderLight)",
                    backgroundColor: "rgba(255,255,255,0.025)",
                  }}
                >
                  <Globe2 className="h-[18px] w-[18px]" />
                </Link>
              </div>
            </div>

            {/* SERVIÇOS */}
            <div>
              <h2
                className="mb-6 text-xs uppercase tracking-[0.2em]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Serviços
              </h2>

              <ul className="space-y-4">
                {servicesLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-2 text-sm transition duration-300 hover:translate-x-1"
                        style={{
                          color: "var(--color-text-secondary)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        <Icon
                          className="h-4 w-4 shrink-0"
                          style={{
                            color: "var(--color-accentLight)",
                          }}
                        />

                        <span className="transition-colors duration-300 group-hover:text-white">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* INSTITUCIONAL */}
            <div>
              <h2
                className="mb-6 text-xs uppercase tracking-[0.2em]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                BittUp
              </h2>

              <ul className="space-y-4">
                {institutionalLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-sm transition duration-300 hover:translate-x-1"
                      style={{
                        color: "var(--color-text-secondary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0"
                        style={{
                          color: "var(--color-accentLight)",
                        }}
                      />

                      <span className="transition-colors duration-300 group-hover:text-white">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTATO E SUPORTE */}
            <div>
              <h2
                className="mb-6 text-xs uppercase tracking-[0.2em]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Atendimento
              </h2>

              <div className="mb-7 space-y-4">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3"
                >
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-success) 18%, transparent)",
                      color: "var(--color-success)",
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </div>

                  <div>
                    <span
                      className="mb-1 block text-[10px] uppercase tracking-[0.16em]"
                      style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      WhatsApp
                    </span>

                    <span
                      className="text-sm transition group-hover:text-white"
                      style={{
                        color: "var(--color-text-secondary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {siteConfig.whatsappDisplay}
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "rgba(45,140,255,0.1)",
                      color: "var(--color-accentLight)",
                    }}
                  >
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div>
                    <span
                      className="mb-1 block text-[10px] uppercase tracking-[0.16em]"
                      style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      Localização
                    </span>

                    <span
                      className="text-sm"
                      style={{
                        color: "var(--color-text-secondary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {siteConfig.cidade}
                    </span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3">
                {supportLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-xs transition duration-300 hover:text-white"
                      style={{
                        color: "var(--color-text-tertiary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COPYRIGHT */}
      <div
        className="border-t py-5"
        style={{
          backgroundColor: "#020b12",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:px-6 md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              aria-label="Acessar painel administrativo"
              className="opacity-40 transition hover:opacity-100"
              style={{
                color: "var(--color-text-secondary)",
              }}
            >
              <Settings className="h-3.5 w-3.5" />
            </Link>

            <p
              className="text-xs leading-5"
              style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-body)",
              }}
            >
              © {currentYear} {siteConfig.nome}. Todos os direitos reservados.
            </p>
          </div>

          <p
            className="text-xs"
            style={{
              color: "var(--color-text-tertiary)",
              fontFamily: "var(--font-body)",
            }}
          >
            {siteConfig.copyrightTagline}
          </p>
        </div>
      </div>
    </footer>
  );
}