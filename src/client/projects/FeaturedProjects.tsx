// src/client/projects/FeaturedProjects.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ProjectCard from "./ProjectCard";
import type { Project } from "./types";

type FeaturedProjectsProps = {
  projects: Project[];
  limit?: number;
  showHeader?: boolean;
};

export default function FeaturedProjects({
  projects,
  limit = 4,
  showHeader = true,
}: FeaturedProjectsProps) {
  const featured = projects
    .filter((project) => project.featured)
    .slice(0, limit);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section
      className="border-b py-16 md:py-20"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {showHeader && (
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p
                className="mb-4 text-[11px] uppercase tracking-[0.22em]"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Projetos em destaque
              </p>

              <h2
                className="text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[2.8rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Alguns projetos que mostram diferentes soluções desenvolvidas
                pela BittUp.
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
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}