import { seoConfig, type RecordSeo } from './seo.config'
import { projects } from '@/client/projects'
import { serviceSlugs, getServiceBySlug } from '@/client/services/services.config'
export type InstitutionalEntry = { slug: string; title: string; description: string; content: string; published?: boolean; updatedAt?: string; seo?: RecordSeo }
export const portfolioEntries: InstitutionalEntry[] = projects.map(project => ({ slug: project.slug, title: project.title, description: project.shortDescription, content: project.solution, seo: seoConfig.records.pages["/portfolio/" + project.slug] }))
export const serviceEntries: InstitutionalEntry[] = serviceSlugs.map(slug => { const service = getServiceBySlug(slug)!; return { slug, title: service.seo.title, description: service.seo.description, content: service.overview.description.join(' '), seo: seoConfig.records.pages['/servicos/' + slug] } })
