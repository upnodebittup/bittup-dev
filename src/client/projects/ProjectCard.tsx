// src/client/projects/ProjectCard.tsx

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import type { Project } from "./types";

type ProjectCardProps = {
  project: Project;
  priority?: boolean;
};

export default function ProjectCard({
  project,
  priority = false,
}: ProjectCardProps) {
  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl border transition duration-500 hover:-translate-y-1"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* IMAGEM */}
      <Link
        href={`/portfolio/${project.slug}`}
        aria-label={`Conhecer o projeto ${project.title}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <Image
          src={project.images.card}
          alt={`Mockup do projeto ${project.title} desenvolvido pela BittUp`}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(3,19,29,0.55), transparent 58%)",
          }}
        />

        <span
          className="absolute left-4 top-4 rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.15em] backdrop-blur-md"
          style={{
            backgroundColor: "rgba(3,19,29,0.72)",
            borderColor: "rgba(255,255,255,0.16)",
            color: "var(--color-text-light)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {project.service}
        </span>

        {project.featured && (
          <span
            className="absolute right-4 top-4 rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.15em]"
            style={{
              backgroundColor: project.color,
              color: "#ffffff",
              fontFamily: "var(--font-heading)",
            }}
          >
            Destaque
          </span>
        )}
      </Link>

      {/* CONTEÚDO */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              className="mb-2 text-xl leading-tight sm:text-2xl"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {project.title}
            </h2>

            <p
              className="text-[10px] uppercase tracking-[0.16em]"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {project.client} · {project.year}
            </p>
          </div>
        </div>

        <p
          className="mb-6 line-clamp-3 text-sm leading-7"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-body)",
          }}
        >
          {project.shortDescription}
        </p>

        <div className="mb-7 flex flex-wrap gap-2">
          {project.technologies.slice(0, 5).map((technology) => (
            <span
              key={technology}
              className="rounded-full border px-3 py-1.5 text-[10px]"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              {technology}
            </span>
          ))}
        </div>

        {/* AÇÕES */}
        <div className="mt-auto flex items-center gap-3">
          <Link
            href={`/portfolio/${project.slug}`}
            className="group/link inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] transition duration-300 hover:brightness-110"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text-light)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Ver estudo de caso

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir o site ${project.title} em uma nova aba`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition duration-300 hover:-translate-y-0.5 hover:bg-white/5"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-light)",
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}