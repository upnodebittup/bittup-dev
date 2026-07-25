// src/client/projects/ProjectFilter.tsx

"use client";

import { ProjectCategory } from "./types";

export type ProjectFilterValue = ProjectCategory | "all";

type ProjectFilterProps = {
  value: ProjectFilterValue;
  onChange: (value: ProjectFilterValue) => void;
};

const filters: {
  value: ProjectFilterValue;
  label: string;
}[] = [
  {
    value: "all",
    label: "Todos",
  },
  {
    value: "site",
    label: "Sites",
  },
  {
    value: "landing-page",
    label: "Landing Pages",
  },
  {
    value: "loja-virtual",
    label: "Lojas Virtuais",
  },
  {
    value: "sistema",
    label: "Sistemas",
  },
  {
    value: "projeto-social",
    label: "Projetos Sociais",
  },
];

export default function ProjectFilter({
  value,
  onChange,
}: ProjectFilterProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex w-max gap-3 md:w-auto md:flex-wrap">
        {filters.map((filter) => {
          const active = filter.value === value;

          return (
            <button
              key={filter.value}
              onClick={() => onChange(filter.value)}
              className="rounded-full border px-5 py-3 text-xs uppercase tracking-[0.16em] transition-all duration-300"
              style={{
                backgroundColor: active
                  ? "var(--color-accent)"
                  : "transparent",

                borderColor: active
                  ? "var(--color-accent)"
                  : "var(--color-border)",

                color: active
                  ? "white"
                  : "var(--color-text-secondary)",

                fontFamily: "var(--font-heading)",
              }}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}