// src/app/(site)/processos/page.tsx

import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  MessageCircle,
  Rocket,
  Search,
} from "lucide-react";

import { siteConfig } from "@/client/config/site.config";

export const metadata: Metadata = {
  title: "Como Trabalhamos | BittUp",
  description:
    "Conheça o processo de criação de sites, landing pages, lojas virtuais e sistemas da BittUp.",
  alternates: {
    canonical: "/processos",
  },
};

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Conversa inicial",
    description:
      "Você explica sua ideia, seu negócio e o que precisa. Também definimos objetivos, funcionalidades e prioridades.",
  },
  {
    number: "02",
    icon: Search,
    title: "Planejamento",
    description:
      "Organizamos a estrutura, o conteúdo, a identidade visual e a melhor estratégia para o projeto.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Desenvolvimento",
    description:
      "Criamos o projeto responsivo, configuramos integrações e deixamos toda a estrutura preparada para o Google.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Publicação e suporte",
    description:
      "Após sua aprovação, configuramos domínio, hospedagem e publicação. Depois, você continua contando com suporte.",
  },
];

export default function ProcessosPage() {
  const whatsappHref = `https://wa.me/${
    siteConfig.whatsapp
  }?text=${encodeURIComponent(siteConfig.whatsappMensagem)}`;

  return (
    <main
      style={{
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-light)",
      }}
    >
      <section
        className="border-b pb-16 pt-[70px] md:pb-24"
        style={{
          background:
            "radial-gradient(circle at 82% 18%, rgba(45,140,255,0.14), transparent 25%), linear-gradient(180deg, #041825 0%, var(--color-bg-primary) 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p
            className="mb-5 text-[11px] uppercase tracking-[0.22em]"
            style={{
              color: "var(--color-accentLight)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Nosso processo
          </p>

          <h1
            className="max-w-4xl text-[2.4rem] leading-[1.05] sm:text-[3rem] lg:text-[3.5rem]"
            style={{
              fontFamily: "var(--font-heading)",
            }}
          >
            Da primeira conversa até o projeto publicado.
          </h1>

          <p
            className="mt-6 max-w-2xl text-sm leading-7 sm:text-base"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-body)",
            }}
          >
            Um processo simples, organizado e acompanhado diretamente pelo
            WhatsApp.
          </p>
        </div>
      </section>

      <section
        className="border-b py-16 md:py-24"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 md:grid-cols-2">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="rounded-2xl border p-6 md:p-8"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span
                      className="text-4xl font-bold"
                      style={{
                        color: "rgba(45,140,255,0.22)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {step.number}
                    </span>

                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: "rgba(45,140,255,0.12)",
                        color: "var(--color-accentLight)",
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h2
                    className="mb-3 text-xl"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {step.title}
                  </h2>

                  <p
                    className="text-sm leading-7"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <CheckCircle2
            className="mx-auto mb-6 h-10 w-10"
            style={{ color: "var(--color-success)" }}
          />

          <h2
            className="text-[1.9rem] leading-tight sm:text-[2.4rem]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Pronta para começar seu projeto?
          </h2>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.13em]"
            style={{
              backgroundColor: "var(--color-success)",
              color: "#ffffff",
              fontFamily: "var(--font-heading)",
            }}
          >
            Falar pelo WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}