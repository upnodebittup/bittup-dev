// src/app/(standalone)/links/layout.tsx

import type { ReactNode } from "react";

import "./links.css";

type LinksLayoutProps = {
  children: ReactNode;
};

export default function LinksLayout({
  children,
}: LinksLayoutProps) {
  return <div className="links-body">{children}</div>;
}