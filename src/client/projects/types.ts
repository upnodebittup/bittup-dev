// src/client/projects/types.ts

export type ProjectCategory =
  | "site"
  | "modelos"
  | "landing-page"
  | "loja-virtual"
  | "sistema"
  | "projeto-social";

export type Project = {
  slug: string;

  title: string;
  subtitle: string;

  category: ProjectCategory;
  service: string;

  client: string;
  year: number;

  featured: boolean;

  url: string;

  images: {
    card: string;
    desktop?: string;
    mobile?: string;
  };

  shortDescription: string;

  challenge: string;
  solution: string;

  results: string[];
  technologies: string[];

  color: string;
};