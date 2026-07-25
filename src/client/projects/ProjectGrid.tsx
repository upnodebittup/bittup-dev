// src/client/projects/ProjectGrid.tsx

"use client";

import { useMemo, useState } from "react";

import ProjectCard from "./ProjectCard";
import ProjectFilter, {
  type ProjectFilterValue,
} from "./ProjectFilter";
import type { Project } from "./types";

type ProjectGridProps = {
  projects: Project[];
  showFilter?: boolean;
};

export default function ProjectGrid({
  projects,
  showFilter = true,
}: ProjectGridProps) {
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
    <section>
      {showFilter && (
        <div className="mb-10">
          <ProjectFilter
            value={activeFilter}
            onChange={setActiveFilter}
          />
        </div>
      )}

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
            />
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl border px-6 py-12 text-center"
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
    </section>
  );
}