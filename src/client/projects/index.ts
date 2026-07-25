// src/client/projects/index.ts


import { artesanaio } from "./artesanaio";
import { cmTeixeiras } from "./cm-teixeiras";
import { diarioSentimentos } from "./diario-sentimentos";
import { elVidracaria } from "./el-vidracaria";
import { geicyCroche } from "./geicy-croche";
import { jornadaProtagonista } from "./jornada-protagonista";
import { jornadaTransformacao } from "./jornada-transformacao";
import { maribela } from "./maribela";
import { resgatandoAnas } from "./resgatando-anas";
import type { Project, ProjectCategory } from "./types";


export const projects: Project[] = [
  jornadaTransformacao,
  elVidracaria,
  cmTeixeiras,
  maribela,
  geicyCroche,
  artesanaio,
  resgatandoAnas,
  diarioSentimentos,
  jornadaProtagonista,
];

export const featuredProjects: Project[] = projects.filter(
  (project) => project.featured
);

/**
 * Retorna um projeto pelo slug.
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/**
 * Retorna os projetos de uma categoria.
 */
export function getProjectsByCategory(
  category: ProjectCategory
): Project[] {
  return projects.filter((project) => project.category === category);
}

/**
 * Retorna projetos relacionados da mesma categoria.
 */
export function getRelatedProjects(
  currentSlug: string,
  limit = 3
): Project[] {
  const currentProject = getProjectBySlug(currentSlug);

  if (!currentProject) {
    return [];
  }

  return projects
    .filter(
      (project) =>
        project.slug !== currentSlug &&
        project.category === currentProject.category
    )
    .slice(0, limit);
}

/**
 * Verifica se existe um projeto com o slug informado.
 */
export function isValidProjectSlug(slug: string): boolean {
  return projects.some((project) => project.slug === slug);
}

/**
 * Lista usada futuramente no generateStaticParams.
 */
export const projectSlugs = projects.map((project) => project.slug);