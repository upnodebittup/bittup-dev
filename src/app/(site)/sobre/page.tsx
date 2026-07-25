// src/app/(site)/sobre/page.tsx

import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Gauge,
  Layers3,
  Search,
} from "lucide-react";

import { siteConfig } from "@/client/config/site.config";

export const metadata: Metadata = {
  title: "Sobre a BittUp",
  description:
    "Conheça a BittUp e nossa forma de desenvolver sites, landing pages, lojas virtuais e sistemas digitais.",
  alternates: {
    canonical: "/sobre",
  },
  openGraph: {
    title: "Sobre a BittUp",
    description:
      "Desenvolvimento de soluções digitais modernas, rápidas e preparadas para o crescimento de cada negócio.",
    type: "website",
    url: "/sobre",
  },
};

const differentials = [
  {
    icon: Search,
    title: "Estratégia e SEO",
    description:
      "Cada projeto é estruturado para apresentar seu negócio com clareza e facilitar sua presença no Google.",
  },
  {
    icon: Gauge,
    title: "Performance",
    description:
      "Sites rápidos, responsivos e preparados para oferecer uma boa experiência em celulares e computadores.",
  },
  {
    icon: Layers3,
    title: "Estrutura escalável",
    description:
      "Projetos organizados para receber novas páginas, funcionalidades e integrações conforme o negócio cresce.",
  },
  {
    icon: Code2,
    title: "Desenvolvimento profissional",
    description:
      "Tecnologias modernas, código organizado e soluções pensadas para facilitar futuras manutenções.",
  },
];

const commitments = [
  "Visual personalizado para cada negócio",
  "Experiência adaptada para dispositivos móveis",
  "Comunicação simples durante todo o projeto",
  "Integração com WhatsApp e canais de atendimento",
  "Configuração de domínio e hospedagem",
  "Estrutura preparada para SEO",
];

export default function SobrePage() {
  const whatsappHref = `https://wa.me/${
    siteConfig.whatsapp
  }?text=${encodeURIComponent(siteConfig.whatsappMensagem)}`;

  return (
    <main
      className="w-full overflow-x-hidden"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-light)",
      }}
    >
      {/* HERO */}
      <section
        className="relative overflow-hidden border-b pb-16 pt-[70px] md:pb-24"
        style={{
          background:
            "radial-gradient(circle at 82% 18%, rgba(45,140,255,0.14), transparent 25%), linear-gradient(180deg, #041825 0%, var(--color-bg-primary) 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-4xl">
            <p
              className="mb-5 text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Sobre a BittUp
            </p>

            <h1
              className="max-w-4xl text-[2.4rem] leading-[1.05] sm:text-[3rem] lg:text-[3.5rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Tecnologia para transformar ideias em soluções digitais reais.
            </h1>

            <p
              className="mt-6 max-w-2xl text-sm leading-7 sm:text-base sm:leading-8"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              A BittUp desenvolve sites, landing pages, lojas virtuais e
              sistemas personalizados para empresas que desejam fortalecer sua
              presença digital e crescer com uma estrutura profissional.
            </p>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.13em] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
              style={{
                backgroundColor: "var(--color-success)",
                color: "#ffffff",
                fontFamily: "var(--font-heading)",
              }}
            >
              Falar com a BittUp
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* APRESENTAÇÃO */}
      <section
        className="border-b py-16 md:py-24"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.2em]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Nossa forma de trabalhar
            </p>

            <h2
              className="text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[2.8rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Um projeto digital precisa ser bonito, funcional e fácil de
              manter.
            </h2>
          </div>

          <div>
            <p
              className="mb-5 text-sm leading-7 sm:text-base sm:leading-8"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Cada solução é desenvolvida considerando o momento atual do
              negócio e também suas necessidades futuras. Isso evita estruturas
              engessadas e permite que o projeto continue evoluindo.
            </p>

            <p
              className="text-sm leading-7 sm:text-base sm:leading-8"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              O objetivo é simplificar a tecnologia para que você possa se
              concentrar no que realmente importa: atender seus clientes e
              desenvolver sua empresa.
            </p>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section
        className="border-b py-16 md:py-24"
        style={{
          backgroundColor: "#041520",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 max-w-3xl">
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.2em]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              O que guia cada projeto
            </p>

            <h2
              className="text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[2.8rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Soluções construídas com estratégia e atenção aos detalhes.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {differentials.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border p-6 md:p-8"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div
                    className="mb-6 flex h-12 w-12 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "rgba(45,140,255,0.12)",
                      color: "var(--color-accentLight)",
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3
                    className="mb-3 text-xl"
                    style={{
                      color: "var(--color-text-light)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="text-sm leading-7"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPROMISSOS */}
      <section
        className="border-b py-16 md:py-24"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.2em]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Compromisso BittUp
            </p>

            <h2
              className="text-[1.9rem] leading-tight sm:text-[2.4rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Clareza do primeiro contato até o lançamento.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {commitments.map((commitment) => (
              <div
                key={commitment}
                className="flex items-start gap-3 rounded-xl border p-4"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: "var(--color-success)" }}
                />

                <p
                  className="text-sm leading-6"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {commitment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 md:py-24"
        style={{
          background:
            "linear-gradient(145deg, #12324A 0%, #071A27 85%)",
        }}
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2
            className="text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[2.8rem]"
            style={{
              color: "var(--color-text-light)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Vamos transformar sua ideia em um projeto profissional?
          </h2>

          <p
            className="mx-auto mt-5 max-w-2xl text-sm leading-7 sm:text-base"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-body)",
            }}
          >
            Fale diretamente pelo WhatsApp e conte o que sua empresa precisa.
          </p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.13em] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
            style={{
              backgroundColor: "var(--color-success)",
              color: "#ffffff",
              fontFamily: "var(--font-heading)",
            }}
          >
            Iniciar conversa
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}