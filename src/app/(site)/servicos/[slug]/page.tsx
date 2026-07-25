// src/app/(site)/servicos/[slug]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ServicePage from "@/client/services/ServicePage";
import {
  getServiceBySlug,
  serviceSlugs,
} from "@/client/services/services.config";
import { siteConfig } from "@/client/config/site.config";

type ServiceRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ServiceRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {};
  }

  const canonicalUrl = `${siteConfig.seo.url}/servicos/${service.slug}`;

  return {
    title: service.seo.title,
    description: service.seo.description,
    keywords: service.seo.keywords,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: service.seo.ogTitle,
      description: service.seo.ogDescription,
      url: canonicalUrl,
      siteName: siteConfig.nome,
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: siteConfig.seo.ogImage,
          width: 1200,
          height: 630,
          alt: service.seo.ogTitle,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: service.seo.ogTitle,
      description: service.seo.ogDescription,
      images: [siteConfig.seo.ogImage],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function ServiceRoutePage({
  params,
}: ServiceRouteProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServicePage service={service} />;
}