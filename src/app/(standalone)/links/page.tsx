// src/app/links/page.tsx

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/client/config/site.config";

export const metadata: Metadata = {
  title: `Links importantes | ${siteConfig.nome}`,
  description:
    "Acesse conteúdos e redes sociais da Bittup.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${siteConfig.seo.url}/links`,
  },
  openGraph: {
    title: `Links importantes | ${siteConfig.nome}`,
    description:
      "Cursos, conteúdos e redes sociais da Bittup.",
    url: `${siteConfig.seo.url}/links`,
    siteName: siteConfig.nome,
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `Links importantes da ${siteConfig.nome}`,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

const links = [
  {
    title: "Fale com a BittUp",
    description:
      "Tire suas dúvidas, solicite um orçamento ou converse diretamente comigo pelo WhatsApp.",
    href: "https://wa.me/5521982708329",
    external: true,
    image: "/assets/cards-links/card-whatsapp.png",
    className: "link-card-whatsapp",
    available: true,
  },
  {
    title: "Portfólio",
    description:
      "Conheça alguns dos sites e projetos que já desenvolvi para empresas e profissionais.",
    href: "/portfolio",
    external: false,
    image: "/assets/cards-links/card-portfolio.png",
    className: "link-card-portfolio",
    available: true,
  },
  {
    title: "Serviços",
    description:
      "Sites institucionais, landing pages, lojas virtuais, blogs, SEO e soluções digitais sob medida.",
    href: "/servicos",
    external: false,
    image: "/assets/cards-links/card-servicos.png",
    className: "link-card-servicos",
    available: true,
  },
  {
    title: "Site da BittUp",
    description:
      "Conheça a BittUp, veja como posso ajudar sua empresa e encontre a solução ideal para o seu negócio.",
    href: "/",
    external: false,
    image: "/assets/cards-links/card-site.png",
    className: "link-card-site",
    available: true,
  },
  {
    title: "Instagram",
    description:
      "Acompanhe projetos, bastidores, novidades e conteúdos sobre criação de sites e presença digital.",
    href: "https://www.instagram.com/bitt_up_",
    external: true,
    image: "/assets/cards-links/card-instagram.png",
    className: "link-card-instagram",
    available: true,
  },
];

export default function LinksPage() {
  return (
    <main className="links-page">
      {/* FAIXA SUPERIOR ANIMADA */}
      <div
        className="important-links-marquee"
        aria-label="Links importantes"
      >
        <div className="important-links-track">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={`first-${index}`}>
              LINKS IMPORTANTES
              <span className="marquee-dot" aria-hidden="true">
                •
              </span>
            </span>
          ))}
        </div>

        <div className="important-links-track" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={`second-${index}`}>
              LINKS IMPORTANTES
              <span className="marquee-dot">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* FUNDO DECORATIVO */}
      <div className="links-background" aria-hidden="true">
        <div className="background-orb background-orb-one" />
        <div className="background-orb background-orb-two" />
        <div className="background-grid" />
      </div>

      <div className="links-container">
        {/* APRESENTAÇÃO */}
        <header className="links-profile">
          <div
            className="animated-title-wrapper"
            aria-label="@bitt_up_, página de links"
          >
            <div className="animated-title animated-title-instagram">
              @bitt_up_
            </div>

            <div className="animated-title animated-title-page">
              Página de links
            </div>
          </div>

          <div className="profile-logo-wrapper">
            <span className="profile-logo-pulse" aria-hidden="true" />

            <div className="profile-logo">
              <Image
                src={siteConfig.logoVertical}
                alt={siteConfig.logoAlt}
                width={150}
                height={150}
                priority
                className="profile-logo-image"
              />
            </div>
          </div>

          <p className="profile-eyebrow">Links importantes</p>

          <h1>Seja bem-vindo</h1>

          <p className="profile-description">
            Encontre os conteúdos e redes sociais da{" "}
            {siteConfig.nome}.
          </p>

          <Link
            href="https://wa.me/5521982708329"
            className="profile-main-button"
          >
            Clique e faça seu orçamento.
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </header>

        {/* CARDS COM IMAGENS */}
        <section className="links-list" aria-label="Links importantes">
          {links.map((item, index) => (
            <article
              key={item.title}
              className={`animated-link-card ${item.className}`}
              style={{
                animationDelay: `${index * 0.45}s`,
              }}
            >
              <span className="card-pulse-border" aria-hidden="true" />

              {item.available ? (
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={
                    item.external
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={`${item.title}: ${item.description}`}
                  className="card-image-link"
                >
                  <Image
                    src={item.image}
                    alt={`Acessar ${item.title}`}
                    width={1280}
                    height={720}
                    priority={index === 0}
                    className="card-banner-image"
                  />
                </Link>
              ) : (
                <div
                  className="card-image-link card-image-unavailable"
                  aria-label={`${item.title}: link em breve`}
                >
                  <Image
                      src={item.image}
                      alt={`${item.title} — link em breve`}
                      width={1280}
                      height={720}
                      className="card-banner-image"
                    />

                  <span className="card-unavailable-label">
                    Link em breve
                  </span>
                </div>
              )}
            </article>
          ))}
        </section>

        {/* RODAPÉ INTERNO DA PÁGINA */}
        <footer className="links-footer">
          <Image
            src={siteConfig.logoHorizontal}
            alt={siteConfig.logoAlt}
            width={130}
            height={55}
            className="links-footer-logo"
          />

          <p>
            © {new Date().getFullYear()} {siteConfig.nome}
          </p>

          {siteConfig.copyrightTagline && (
            <span>{siteConfig.copyrightTagline}</span>
          )}
        </footer>
      </div>
    </main>
  );
}