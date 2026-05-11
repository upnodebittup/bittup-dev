// src/client/components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Instagram } from "lucide-react";
import { siteConfig } from "@/client/config/site.config";

export default function Header() {
  const [open, setOpen] = useState(false);

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    siteConfig.whatsappMensagem
  )}`;

  return (
    <header
      className="fixed top-0 left-0 z-50 w-full border-b"
      style={{
        backgroundColor: "var(--color-accent)",
        borderColor:
          "color-mix(in srgb, var(--color-accent-hover) 22%, transparent)",
      }}
    >
      {/* MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="h-[88px] flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link href="/" className="shrink-0">
            <Image
              src={siteConfig.logoHorizontal}
              alt={siteConfig.logoAlt}
              width={190}
              height={76}
              priority
              className="object-contain"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] uppercase tracking-[0.18em] transition hover:opacity-80"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-5">
            <Link
              href={`https://instagram.com/${siteConfig.instagram.replace(
                "@",
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:opacity-80"
              aria-label="Instagram"
              style={{ color: "var(--color-text-light)" }}
            >
              <Instagram className="w-5 h-5" />
            </Link>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-full text-[12px] uppercase tracking-[0.14em] transition hover:opacity-90"
              style={{
                backgroundColor: "var(--color-success)",
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {siteConfig.headerCta}
            </a>
          </div>

          {/* MOBILE */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Abrir menu"
              className="transition"
              style={{ color: "var(--color-text-light)" }}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div
          className="lg:hidden border-t"
          style={{
            backgroundColor: "var(--color-accent)",
            borderColor:
              "color-mix(in srgb, var(--color-accent-hover) 18%, transparent)",
          }}
        >
          <div className="px-6 py-8 flex flex-col gap-6">
            <nav className="flex flex-col gap-5">
              {siteConfig.mobileNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-[0.18em] transition hover:opacity-80"
                  style={{
                    color: "var(--color-text-light)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 pt-2">
              <Link
                href={`https://instagram.com/${siteConfig.instagram.replace(
                  "@",
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:opacity-80"
                style={{ color: "var(--color-text-light)" }}
              >
                <Instagram className="w-5 h-5" />
              </Link>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-2 py-4 rounded-full text-center text-sm uppercase tracking-[0.18em] transition hover:opacity-90"
              style={{
                backgroundColor: "var(--color-accent-hover)",
                color: "var(--color-text-light)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {siteConfig.headerCta}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}