// src/client/components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Settings,
  Instagram,
  MessageCircle,
  Globe,
  Search,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/client/config/site.config";

export default function Footer() {
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    siteConfig.whatsappMensagem
  )}`;
  const instagramHref = `https://instagram.com/${siteConfig.instagram.replace(
    "@",
    ""
  )}`;

  const benefits = siteConfig.benefits ?? [
    {
      title: "Atendimento humano",
      description: "Você fala direto com a equipe, sem robô e sem enrolação.",
    },
    {
      title: "Site estratégico",
      description: "Estrutura pensada para passar confiança e gerar contato.",
    },
    {
      title: "Presença no Google",
      description: "Sua empresa com mais visibilidade e aparência profissional.",
    },
  ];

  return (
    <footer className="w-full overflow-hidden">
      {/* BENEFÍCIOS */}
      <div
        className="border-t"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {benefits.map((item, index) => {
              const icons = [
                <MessageCircle key="message" className="w-6 h-6" />,
                <Sparkles key="sparkles" className="w-6 h-6" />,
                <Search key="search" className="w-6 h-6" />,
              ];

              return (
                <div key={item.title} className="flex flex-col items-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-accentLight) 55%, var(--color-text-light))",
                      color: "var(--color-success)",
                    }}
                  >
                    {icons[index] ?? <BadgeCheck className="w-6 h-6" />}
                  </div>

                  <h4
                    className="text-lg mb-2 tracking-wide"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {item.title}
                  </h4>

                  <p
                    className="text-sm leading-relaxed max-w-xs"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER PRINCIPAL */}
      <div
        className="w-full py-16 border-t"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-text-light)",
          borderColor:
            "color-mix(in srgb, var(--color-accentHover) 20%, transparent)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 grid gap-12 md:grid-cols-4">
          {/* LOGO + DESCRIÇÃO */}
          <div>
            <Image
              src={siteConfig.logoHorizontal}
              alt={siteConfig.logoAlt}
              width={180}
              height={70}
              className="mb-5 object-contain"
            />

            <p
              className="text-sm leading-7 max-w-sm"
              style={{
                color: "rgba(255,255,255,.88)",
                fontFamily: "var(--font-body)",
              }}
            >
              {siteConfig.footerDescription}
            </p>

            <div className="flex items-center gap-4 mt-6">
              <Link
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:opacity-80"
                aria-label="Instagram"
                style={{ color: "var(--color-text-light)" }}
              >
                <Instagram className="w-5 h-5" />
              </Link>

              <Link
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:opacity-80"
                aria-label="WhatsApp"
                style={{ color: "var(--color-text-light)" }}
              >
                <MessageCircle className="w-5 h-5" />
              </Link>

              <Link
                href={siteConfig.seo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:opacity-80"
                aria-label="Site"
                style={{ color: "var(--color-text-light)" }}
              >
                <Globe className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* NAVEGAÇÃO */}
          <div>
            <h4
              className="text-sm uppercase tracking-[0.22em] mb-6"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Navegação
            </h4>

            <ul className="space-y-3">
              {siteConfig.footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:opacity-80"
                    style={{
                      color: "rgba(255,255,255,.9)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AJUDA */}
          <div>
            <h4
              className="text-sm uppercase tracking-[0.22em] mb-6"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Ajuda
            </h4>

            <ul className="space-y-3">
              {[
                { label: "Perguntas frequentes", href: "/faq" },
                { label: "Política de privacidade", href: "/privacidade" },
                { label: "Termos de uso", href: "/termos" },
                { label: "Fale no WhatsApp", href: whatsappHref },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:opacity-80"
                    style={{
                      color: "rgba(255,255,255,.9)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTATO */}
          <div>
            <h4
              className="text-sm uppercase tracking-[0.22em] mb-6"
              style={{
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Fale conosco
            </h4>

            <div className="space-y-5">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.18em] mb-2"
                  style={{ color: "rgba(255,255,255,.72)" }}
                >
                  WhatsApp
                </p>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:opacity-80"
                  style={{
                    color: "var(--color-text-light)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  {siteConfig.whatsappDisplay}
                </a>
              </div>

              <div>
                <p
                  className="text-xs uppercase tracking-[0.18em] mb-2"
                  style={{ color: "rgba(255,255,255,.72)" }}
                >
                  Instagram
                </p>

                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:opacity-80"
                  style={{
                    color: "var(--color-text-light)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <Instagram className="w-4 h-4" />
                  {siteConfig.instagram}
                </a>
              </div>

              <div>
                <p
                  className="text-xs uppercase tracking-[0.18em] mb-2"
                  style={{ color: "rgba(255,255,255,.72)" }}
                >
                  Localização
                </p>

                <p
                  className="text-sm"
                  style={{
                    color: "rgba(255,255,255,.9)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {siteConfig.cidade}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div
        className="py-5 border-t"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-accent) 82%, var(--color-accentHover))",
          borderColor:
            "color-mix(in srgb, var(--color-text-light) 14%, transparent)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="opacity-55 hover:opacity-100 transition"
              aria-label="Admin"
              style={{ color: "var(--color-text-light)" }}
            >
              <Settings className="w-3.5 h-3.5" />
            </Link>

            <span
              style={{
                color: "rgba(255,255,255,.82)",
                fontFamily: "var(--font-body)",
              }}
            >
              © {new Date().getFullYear()} {siteConfig.nome}
              {siteConfig.copyrightTagline
                ? ` — ${siteConfig.copyrightTagline}`
                : ""}
            </span>
          </div>

          <span
            style={{
              color: "rgba(255,255,255,.82)",
              fontFamily: "var(--font-body)",
            }}
          >
            Desenvolvido com ♥
          </span>
        </div>
      </div>
    </footer>
  );
}