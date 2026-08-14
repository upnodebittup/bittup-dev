// src/app/lp/intensivao/page.tsx

import type { Metadata } from 'next'

import Hero from '@/client/components/intensivao/Hero'
import Transformation from '@/client/components/intensivao/Transformation'
import WhatYouWillLearn from '@/client/components/intensivao/WhatYouWillLearn'
import WhoIsItFor from '@/client/components/intensivao/WhoIsItFor'
import Method from '@/client/components/intensivao/Method'
import Teacher from '@/client/components/intensivao/Teacher'
import Testimonials from '@/client/components/intensivao/Testimonials'
import Included from '@/client/components/intensivao/Included'
import Offer from '@/client/components/intensivao/Offer'
import FAQ from '@/client/components/intensivao/FAQ'
import FinalCTA from '@/client/components/intensivao/FinalCTA'

import FadeIn from '@/core/components/animations/FadeIn'

import { siteConfig } from '@/client/config/site.config'

export const metadata: Metadata = {
  title: 'Intensivão de Libras | Thaise Escola de Libras',
  description:
    'Aprenda os fundamentos da Libras de forma prática e organizada através do Intensivão da Thaise Escola de Libras.',

  alternates: {
    canonical: `${siteConfig.seo.url}/lp/intensivao`,
  },

  openGraph: {
    title: 'Intensivão de Libras',
    description:
      'Aprenda os fundamentos da Libras com um método simples e pensado para iniciantes.',

    url: `${siteConfig.seo.url}/lp/intensivao`,

    siteName: siteConfig.nome,

    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: 'Intensivão de Libras',
      },
    ],
  },
}

export default function IntensivaoPage() {
  return (
    <main className="overflow-hidden">

      <Hero />

      <FadeIn delay={0.05}>
        <Transformation />
      </FadeIn>

      <FadeIn delay={0.05}>
        <WhatYouWillLearn />
      </FadeIn>

      <FadeIn delay={0.05}>
        <WhoIsItFor />
      </FadeIn>

      <FadeIn delay={0.05}>
        <Method />
      </FadeIn>

      <FadeIn delay={0.05}>
        <Teacher />
      </FadeIn>

      <FadeIn delay={0.05}>
        <Testimonials />
      </FadeIn>

      <FadeIn delay={0.05}>
        <Included />
      </FadeIn>

      <FadeIn delay={0.05}>
        <Offer />
      </FadeIn>

      <FadeIn delay={0.05}>
        <FAQ />
      </FadeIn>

      <FadeIn delay={0.05}>
        <FinalCTA />
      </FadeIn>

    </main>
  )
}