// src/app/(site)/portfolio/[slug]/page.tsx

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
} from "lucide-react";

import {
  getProjectBySlug,
  getRelatedProjects,
  projectSlugs,
} from "@/client/projects";
import ProjectCard from "@/client/projects/ProjectCard";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projeto não encontrado | BittUp",
    };
  }

  return {
    title: `${project.title} | Portfólio BittUp`,
    description: project.shortDescription,

    alternates: {
      canonical: `/portfolio/${project.slug}`,
    },

    openGraph: {
      title: `${project.title} | BittUp`,
      description: project.shortDescription,
      type: "website",
      url: `/portfolio/${project.slug}`,
      images: [
        {
          url: project.images.card,
          alt: `Projeto ${project.title} desenvolvido pela BittUp`,
        },
      ],
    },
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = getRelatedProjects(project.slug, 2);

  return (
    <main>
      {/* HERO */}
      <section
        className="relative overflow-hidden border-b pb-16 pt-[70px] md:pb-20"
        style={{
          background:
            "radial-gradient(circle at 82% 20%, rgba(45,140,255,0.14), transparent 26%), linear-gradient(180deg, #041825 0%, var(--color-bg-primary) 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/portfolio"
            className="mb-10 inline-flex items-center gap-2 text-sm transition duration-300 hover:-translate-x-1"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-body)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o portfólio
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div>
              <span
                className="mb-6 inline-flex rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.16em]"
                style={{
                  borderColor: "var(--color-borderLight)",
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {project.service}
              </span>

              <h1
                className="max-w-3xl text-[2.4rem] leading-[1.05] sm:text-[3rem] lg:text-[3.5rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {project.title}
              </h1>

              <p
                className="mt-6 max-w-xl text-sm leading-7 sm:text-base sm:leading-8"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {project.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-5">
                <div>
                  <p
                    className="mb-1 text-[10px] uppercase tracking-[0.16em]"
                    style={{
                      color: "var(--color-text-muted)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Cliente
                  </p>

                  <p
                    className="text-sm"
                    style={{
                      color: "var(--color-text-light)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {project.client}
                  </p>
                </div>

                <div>
                  <p
                    className="mb-1 text-[10px] uppercase tracking-[0.16em]"
                    style={{
                      color: "var(--color-text-muted)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Ano
                  </p>

                  <p
                    className="text-sm"
                    style={{
                      color: "var(--color-text-light)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {project.year}
                  </p>
                </div>

                <div>
                  <p
                    className="mb-1 text-[10px] uppercase tracking-[0.16em]"
                    style={{
                      color: "var(--color-text-muted)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Categoria
                  </p>

                  <p
                    className="text-sm"
                    style={{
                      color: "var(--color-text-light)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {project.service}
                  </p>
                </div>
              </div>

              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.13em] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Visitar projeto
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div
              className="relative aspect-[16/11] overflow-hidden rounded-2xl border"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.07), transparent 72%)",
                borderColor: "var(--color-border)",
              }}
            >
              <Image
                src={project.images.card}
                alt={`Mockup do projeto ${project.title}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-contain p-4 sm:p-7"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DESAFIO E SOLUÇÃO */}
      <section
        className="border-b py-16 md:py-24"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          <article
            className="rounded-2xl border p-6 md:p-8"
            style={{
              backgroundColor: "var(--color-bg-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <p
              className="mb-4 text-[10px] uppercase tracking-[0.18em]"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              O desafio
            </p>

            <h2
              className="mb-5 text-2xl leading-tight md:text-3xl"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              O ponto de partida do projeto
            </h2>

            <p
              className="text-sm leading-7 sm:text-base sm:leading-8"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              {project.challenge}
            </p>
          </article>

          <article
            className="rounded-2xl border p-6 md:p-8"
            style={{
              background:
                "linear-gradient(145deg, #12324A 0%, #071A27 85%)",
              borderColor: "var(--color-border)",
            }}
          >
            <p
              className="mb-4 text-[10px] uppercase tracking-[0.18em]"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              A solução
            </p>

            <h2
              className="mb-5 text-2xl leading-tight md:text-3xl"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Estratégia aplicada pela BittUp
            </h2>

            <p
              className="text-sm leading-7 sm:text-base sm:leading-8"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              {project.solution}
            </p>
          </article>
        </div>
      </section>

      {/* IMAGENS ADICIONAIS */}
      {(project.images.desktop || project.images.mobile) && (
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
                className="mb-4 text-[10px] uppercase tracking-[0.18em]"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Interface responsiva
              </p>

              <h2
                className="text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[2.8rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Uma experiência consistente em diferentes dispositivos.
              </h2>
            </div>

            <div
              className={
                project.images.desktop && project.images.mobile
                  ? "grid gap-6 lg:grid-cols-[1.45fr_0.55fr]"
                  : "grid gap-6"
              }
            >
              {project.images.desktop && (
                <div
                  className="relative aspect-[16/10] overflow-hidden rounded-2xl border"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <Image
                    src={project.images.desktop}
                    alt={`Versão desktop do projeto ${project.title}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="object-contain p-4"
                  />
                </div>
              )}

              {project.images.mobile && (
                <div
                  className="relative min-h-[520px] overflow-hidden rounded-2xl border"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <Image
                    src={project.images.mobile}
                    alt={`Versão mobile do projeto ${project.title}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-contain p-4"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* RESULTADOS */}
      <section
        className="border-b py-16 md:py-24"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p
              className="mb-4 text-[10px] uppercase tracking-[0.18em]"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Entregas do projeto
            </p>

            <h2
              className="text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[2.8rem]"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Principais resultados e recursos implementados.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {project.results.map((result) => (
              <div
                key={result}
                className="flex items-start gap-3 rounded-xl border p-4"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-accent) 14%, transparent)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <Check className="h-4 w-4" />
                </span>

                <p
                  className="text-sm leading-6"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {result}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECNOLOGIAS */}
      <section
        className="border-b py-14 md:py-20"
        style={{
          backgroundColor: "#041520",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p
            className="mb-5 text-[10px] uppercase tracking-[0.18em]"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Tecnologias
          </p>

          <div className="flex flex-wrap gap-3">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full border px-4 py-2 text-xs"
                style={{
                  borderColor: "var(--color-borderLight)",
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* RELACIONADOS */}
      {relatedProjects.length > 0 && (
        <section
          className="border-b py-16 md:py-24"
          style={{
            backgroundColor: "var(--color-bg-primary)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p
                  className="mb-4 text-[10px] uppercase tracking-[0.18em]"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Outros projetos
                </p>

                <h2
                  className="text-[1.9rem] leading-tight sm:text-[2.4rem]"
                  style={{
                    color: "var(--color-text-light)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Projetos relacionados
                </h2>
              </div>

              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Ver todos os projetos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {relatedProjects.map((relatedProject) => (
                <ProjectCard
                  key={relatedProject.slug}
                  project={relatedProject}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}