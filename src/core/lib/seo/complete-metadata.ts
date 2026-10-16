import type { Metadata } from 'next'
import { siteConfig } from '@/client/config/site.config'
import { pageMetadata, canonicalUrl } from '@/core/lib/seo'
export function completeMetadata(original: Metadata, path: string): Metadata {
 const generated = pageMetadata({ title: typeof original.title === 'string' ? original.title : siteConfig.seo.titulo, description: original.description, path })
 return { ...original, ...generated, openGraph: { ...generated.openGraph, ...original.openGraph, url: canonicalUrl(path) }, twitter: { ...generated.twitter, ...original.twitter } }
}
