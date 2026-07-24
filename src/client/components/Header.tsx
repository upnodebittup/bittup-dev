// src/client/components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Instagram, Menu, X } from "lucide-react";
import { siteConfig } from "@/client/config/site.config";

export default function Header() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const whatsappHref = `https://wa.me/${
    siteConfig.whatsapp
  }?text=${encodeURIComponent(siteConfig.whatsappMensagem)}`;

  const instagramHref = siteConfig.instagram
    ? `https://instagram.com/${siteConfig.instagram.replace("@", "")}`
    : "";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href.startsWith("/#")) {
      return pathname === "/";
    }

    if (href.startsWith("http")) {
      return false;
    }

    return pathname.startsWith(href);
  };

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 w-full",
        "transition-all duration-500",
        scrolled
          ? "border-b shadow-[0_12px_32px_rgba(45,140,255,0.25)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
      style={
        scrolled
          ? {
              backgroundColor:
                "color-mix(in srgb, var(--color-bg-primary) 88%, transparent)",
              borderColor:
                "color-mix(in srgb, var(--color-border-light) 65%, transparent)",
            }
          : undefined
      }
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={[
            "flex items-center justify-between gap-5",
            "transition-all duration-500",
            scrolled ? "h-[76px]" : "h-[92px]",
          ].join(" ")}
        >
          {/* LOGO */}
          <Link
            href="/"
            aria-label={`Ir para o início — ${siteConfig.nome}`}
            className="relative z-10 flex shrink-0 items-center"
            onClick={() => setOpen(false)}
          >
            <Image
              src={siteConfig.logoHorizontal}
              alt={siteConfig.logoAlt}
              width={190}
              height={76}
              priority
              className={[
                "h-auto w-[145px] object-contain",
                "transition-all duration-500",
                scrolled
                  ? "sm:w-[155px]"
                  : "sm:w-[170px] lg:w-[185px]",
              ].join(" ")}
            />
          </Link>

          {/* NAVEGAÇÃO DESKTOP */}
          <nav
            aria-label="Navegação principal"
            className="hidden items-center justify-center gap-1 lg:flex"
          >
            {siteConfig.navLinks.map((link) => {
              const active = isActiveLink(link.href);
              const external = link.href.startsWith("http");

              return (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={[
                    "group relative rounded-full px-4 py-3",
                    "text-[13px] font-medium tracking-[0.04em]",
                    "transition-colors duration-300",
                  ].join(" ")}
                  style={{
                    color: active
                      ? "var(--color-accent-light)"
                      : "var(--color-text-light)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  <span className="relative z-10">{link.label}</span>

                  <span
                    aria-hidden="true"
                    className={[
                      "absolute inset-x-4 bottom-[7px] h-px origin-left",
                      "transition-transform duration-300",
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    ].join(" ")}
                    style={{
                      backgroundColor: "var(--color-accent-light)",
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* AÇÕES DESKTOP */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            {instagramHref && (
              <Link
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da BittUp"
                className={[
                  "flex size-11 items-center justify-center rounded-full",
                  "border transition-all duration-300",
                  "hover:-translate-y-0.5",
                ].join(" ")}
                style={{
                  color: "var(--color-text-light)",
                  borderColor:
                    "color-mix(in srgb, var(--color-text-light) 20%, transparent)",
                  backgroundColor:
                    "color-mix(in srgb, var(--color-text-light) 5%, transparent)",
                }}
              >
                <Instagram className="size-[18px]" />
              </Link>
            )}

            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "group inline-flex min-h-12 items-center gap-2",
                "rounded-full px-6 py-3",
                "text-[12px] font-semibold uppercase tracking-[0.12em]",
                "shadow-[0_12px_32px_rgba(19,163,0,0.22)]",
                "transition-all duration-300",
                "hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_16px_38px_rgba(19,163,0,0.32)]",
              ].join(" ")}
              style={{
                backgroundColor: "var(--color-success)",
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              <span>{siteConfig.headerCta}</span>

              <ArrowUpRight
                className={[
                  "size-4 transition-transform duration-300",
                  "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                ].join(" ")}
              />
            </Link>
          </div>

          {/* BOTÃO MOBILE */}
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className={[
              "relative z-[60] flex size-11 items-center justify-center",
              "rounded-full border lg:hidden",
              "transition-all duration-300",
            ].join(" ")}
            style={{
              color: "var(--color-text-light)",
              borderColor:
                "color-mix(in srgb, var(--color-text-light) 22%, transparent)",
              backgroundColor:
                "color-mix(in srgb, var(--color-bg-secondary) 76%, transparent)",
            }}
          >
            {open ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      <div
        id="mobile-navigation"
        className={[
          "fixed inset-0 z-50 lg:hidden",
          "transition-all duration-500",
          open
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        ].join(" ")}
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-bg-primary) 97%, transparent)",
        }}
      >
        {/* EFEITOS DE FUNDO */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full blur-[110px]"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-accent-light) 28%, transparent)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 -left-32 size-96 rounded-full blur-[130px]"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-secondary-light) 30%, transparent)",
          }}
        />

        <div className="relative flex min-h-full flex-col overflow-y-auto px-6 pb-8 pt-[110px]">
          <nav
            aria-label="Navegação mobile"
            className="flex flex-1 flex-col justify-center"
          >
            <div className="flex flex-col">
              {siteConfig.mobileNavLinks.map((link, index) => {
                const active = isActiveLink(link.href);
                const external = link.href.startsWith("http");

                return (
                  <Link
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    onClick={() => setOpen(false)}
                    className={[
                      "group flex items-center justify-between",
                      "border-b py-5",
                      "transition-all duration-300",
                      open
                        ? "translate-x-0 opacity-100"
                        : "translate-x-5 opacity-0",
                    ].join(" ")}
                    style={{
                      color: active
                        ? "var(--color-accent-light)"
                        : "var(--color-text-light)",
                      borderColor:
                        "color-mix(in srgb, var(--color-border-light) 65%, transparent)",
                      transitionDelay: open
                        ? `${100 + index * 55}ms`
                        : "0ms",
                    }}
                  >
                    <span
                      className="text-base font-medium uppercase tracking-[0.12em] sm:text-lg"
                      style={{
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {link.label}
                    </span>

                    <ArrowUpRight
                      className={[
                        "size-5 transition-transform duration-300",
                        "group-hover:-translate-y-1 group-hover:translate-x-1",
                      ].join(" ")}
                    />
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="mt-10 flex flex-col gap-5">
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={[
                "group flex min-h-14 w-full items-center",
                "justify-center gap-2 rounded-full px-6 py-4",
                "text-center text-sm font-semibold uppercase tracking-[0.12em]",
                "shadow-[0_14px_36px_rgba(45,140,255,0.28)]",
                "transition-transform duration-300 active:scale-[0.98]",
              ].join(" ")}
              style={{
                backgroundColor: "var(--color-success)",
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              <span>{siteConfig.headerCta}</span>
              <ArrowUpRight className="size-4" />
            </Link>

            <div className="flex items-center justify-between gap-4">
              <span
                className="text-xs uppercase tracking-[0.16em]"
                style={{
                  color: "var(--color-text-tertiary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {siteConfig.cidade}
              </span>

              {instagramHref && (
                <Link
                  href={instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram da BittUp"
                  className="flex size-11 items-center justify-center rounded-full border"
                  style={{
                    color: "var(--color-text-light)",
                    borderColor:
                      "color-mix(in srgb, var(--color-text-light) 20%, transparent)",
                  }}
                >
                  <Instagram className="size-[18px]" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}