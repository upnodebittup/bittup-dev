import { isModuleEnabled } from '@/core/lib/modules';
import { createSerwistRoute } from "@serwist/turbopack";

import { siteConfig } from "@/client/config/site.config";

const revision =
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  `${siteConfig.nome}-${process.env.npm_package_version ?? "1.0.0"}`;

const {
  generateStaticParams,
  GET: serwistGET,
} = createSerwistRoute({
  swSrc: "src/app/sw.ts",

  useNativeEsbuild: true,

  additionalPrecacheEntries: [

    {
      url: "/offline",
      revision,
    },
  ],
});
// Next requires statically analyzable route config and rejects extra handler exports.
export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;
export { generateStaticParams };
export async function GET(request: Request, context: Parameters<typeof serwistGET>[1]) {
  if (!isModuleEnabled('pwa')) return new Response("self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(self.registration.unregister()));", { headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-store' } });
  return serwistGET(request, context);
}
