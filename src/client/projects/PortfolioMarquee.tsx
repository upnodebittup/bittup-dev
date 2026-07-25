// src/client/projects/PortfolioMarquee.tsx

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Project } from "./types";

type PortfolioMarqueeProps = {
  projects: Project[];
};

export default function PortfolioMarquee({
  projects,
}: PortfolioMarqueeProps) {
  const featuredProjects = projects.filter(
    (project) => project.featured
  );

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <section
      className="overflow-hidden border-b py-20 md:py-28"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* TÍTULO */}
      <div className="mx-auto mb-10 max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p
              className="mb-4 text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--color-accentLight)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Projetos selecionados
            </p>

            <h2
              className="text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[2.8rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Soluções digitais criadas para negócios reais.
            </h2>
          </div>

          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3"
            style={{
              color: "var(--color-accentLight)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Ver portfólio completo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="relative overflow-hidden">
        {/* SOMBRA ESQUERDA */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 sm:w-24"
          style={{
            background:
              "linear-gradient(90deg, var(--color-bg-primary), transparent)",
          }}
        />

        {/* SOMBRA DIREITA */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 sm:w-24"
          style={{
            background:
              "linear-gradient(270deg, var(--color-bg-primary), transparent)",
          }}
        />

        <div className="bittup-portfolio-marquee flex w-max gap-5 px-4 sm:px-6">
          {[...featuredProjects, ...featuredProjects].map(
            (project, index) => {
              const duplicated =
                index >= featuredProjects.length;

              return (
                <Link
                  key={`${project.slug}-${index}`}
                  href={`/portfolio/${project.slug}`}
                  aria-hidden={duplicated || undefined}
                  tabIndex={duplicated ? -1 : undefined}
                  className="group flex min-h-[490px] w-[290px] shrink-0 flex-col overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 sm:w-[360px] lg:w-[390px]"
                  style={{
                    background:
                      index % featuredProjects.length === 1
                        ? "linear-gradient(145deg, #12324A 0%, #071A27 80%)"
                        : "linear-gradient(145deg, #0C1F2B 0%, #071A27 100%)",

                    borderColor: "var(--color-border)",
                  }}
                >
                  {/* IMAGEM */}
                  <div
                    className="relative h-[210px] w-full shrink-0 overflow-hidden border-b"
                    style={{
                      borderColor: "var(--color-border)",
                      background:
                        "radial-gradient(circle at center, rgba(255,255,255,0.07), transparent 72%)",
                    }}
                  >
                    <Image
                      src={project.images.card}
                      alt={`Mockup do projeto ${project.title}`}
                      fill
                      sizes="(max-width: 640px) 290px, (max-width: 1024px) 360px, 390px"
                      className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* CONTEÚDO */}
                  <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
                    <div>
                      <span
                        className="mb-7 inline-flex rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.16em]"
                        style={{
                          borderColor:
                            "var(--color-borderLight)",
                          color:
                            "var(--color-textHeroMuted)",
                          fontFamily:
                            "var(--font-heading)",
                        }}
                      >
                        {project.service}
                      </span>

                      <h3
                        className="mb-4 text-2xl leading-tight"
                        style={{
                          color: "var(--color-text-light)",
                          fontFamily:
                            "var(--font-heading)",
                        }}
                      >
                        {project.title}
                      </h3>

                      <p
                        className="line-clamp-3 text-sm leading-7"
                        style={{
                          color:
                            "var(--color-text-secondary)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {project.shortDescription}
                      </p>
                    </div>

                    <span
                      className="mt-10 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                      style={{
                        color:
                          "var(--color-accentLight)",
                        fontFamily:
                          "var(--font-heading)",
                      }}
                    >
                      Ver estudo de caso
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}