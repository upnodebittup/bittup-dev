// src/client/projects/index.ts

import { modeloPetshop1 } from "./modelo-petshop-1";
import { modeloPetshop2 } from "./modelo-petshop-2";
import { modeloPetshop3 } from "./modelo-petshop-3";
import { modeloPsicologa1 } from "./modelo-psicologa-1";
import { modeloPsicologa2 } from "./modelo-psicologa-2";
import { modeloClinicaNeuro1 } from "./modelo-clinica-neuro-1";
import { modeloPsicologo1 } from "./modelo-psicologo-1";
import { modeloPsicologo2 } from "./modelo-psicologo-2";
import { modeloClinicaNeuro2 } from "./modelo-clinica-neuro-2";

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

  modeloPsicologa1,
  modeloPsicologa2,
  modeloClinicaNeuro1,
  modeloPsicologo1,
  modeloPsicologo2,
  modeloClinicaNeuro2,  
  modeloPetshop1,
  modeloPetshop2,
  modeloPetshop3,
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