// src/app/(site)/portfolio/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { projects } from "@/client/projects";
import PortfolioGrid from "@/client/projects/ProjectGrid";

export const metadata: Metadata = {
  title: "Portfólio | BittUp",
  description:
    "Conheça sites, landing pages, lojas virtuais e sistemas desenvolvidos pela BittUp para negócios reais.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Portfólio | BittUp",
    description:
      "Projetos digitais desenvolvidos pela BittUp com foco em estratégia, experiência do usuário, performance e resultados.",
    type: "website",
    url: "/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <main>
      {/* HERO */}
      <section
        className="relative overflow-hidden border-b pb-16 pt-[70px] md:pb-20"
        style={{
          background:
            "radial-gradient(circle at 85% 20%, rgba(45,140,255,0.14), transparent 26%), linear-gradient(180deg, #041825 0%, var(--color-bg-primary) 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full blur-3xl"
          style={{
            backgroundColor: "rgba(45,140,255,0.08)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-4xl">
            <p
              className="mb-5 text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Portfólio BittUp
            </p>

            <h1
              className="max-w-4xl text-[2.4rem] leading-[1.05] sm:text-[3rem] lg:text-[3.5rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Projetos digitais criados para transformar ideias em negócios
              reais.
            </h1>

            <p
              className="mt-6 max-w-2xl text-sm leading-7 sm:text-base sm:leading-8"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Sites institucionais, landing pages, lojas virtuais e sistemas
              desenvolvidos com estratégia, identidade visual, performance e
              foco na experiência do usuário.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#projetos"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.13em] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Conhecer projetos
                <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                href="/contato"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-6 py-3 text-xs font-semibold uppercase tracking-[0.13em] transition duration-300 hover:-translate-y-0.5 hover:bg-white/5"
                style={{
                  borderColor: "var(--color-borderLight)",
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Solicitar orçamento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PROJETOS */}
      <div id="projetos" className="scroll-mt-24">
        <PortfolioGrid projects={projects} />
      </div>
    </main>
  );
}