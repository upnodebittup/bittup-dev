// src/client/projects/PortfolioGrid.tsx

"use client";

import { useMemo, useState } from "react";

import ProjectCard from "./ProjectCard";
import ProjectFilter, {
  type ProjectFilterValue,
} from "./ProjectFilter";
import type { Project } from "./types";

type PortfolioGridProps = {
  projects: Project[];
};

export default function PortfolioGrid({
  projects,
}: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] =
    useState<ProjectFilterValue>("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projects;
    }

    return projects.filter(
      (project) => project.category === activeFilter
    );
  }, [activeFilter, projects]);

  return (
    <section
      className="border-b py-16 md:py-24"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10">
          <ProjectFilter
            value={activeFilter}
            onChange={setActiveFilter}
          />
        </div>

        <div aria-live="polite">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  priority={index < 2}
                />
              ))}
            </div>
          ) : (
            <div
              className="rounded-2xl border px-6 py-14 text-center"
              style={{
                backgroundColor: "var(--color-bg-card)",
                borderColor: "var(--color-border)",
              }}
            >
              <p
                className="text-sm leading-7"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Nenhum projeto encontrado nesta categoria.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}