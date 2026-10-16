import { serviceSlugs } from '@/client/services/services.config';
import { projectSlugs } from '@/client/projects';
import { canPrepareOfflinePath } from '@/core/pwa/cache-policy';
import { requireModule } from '@/core/lib/module-server';
import type { Metadata } from "next";

import { siteConfig } from "@/client/config/site.config";
import OfflinePresentationManager from "@/core/pwa/OfflinePresentationManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Preparar apresentação offline | ${siteConfig.nome}`,
  description:
    "Salve as páginas públicas deste site para apresentações offline.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrepareOfflinePage() {
  requireModule("pwa");
  return (
    <OfflinePresentationManager
      appName={siteConfig.nome}
      routes={Array.from(new Set([...siteConfig.pwa.offlineRoutes, '/processo', ...serviceSlugs.map(slug => '/servicos/' + slug), ...projectSlugs.map(slug => '/portfolio/' + slug)])).filter(path => canPrepareOfflinePath(path) && path !== '/' && !path.startsWith('/blog'))}
    />
  );
}