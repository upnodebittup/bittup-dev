// src/client/services/ServicePage.tsx

import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import Reveal from "@/client/components/Reveal";
import { siteConfig } from "@/client/config/site.config";
import type { ServiceConfig } from "@/client/services/services.config";

type ServicePageProps = {
  service: ServiceConfig;
};

export default function ServicePage({ service }: ServicePageProps) {
  const whatsappHref = `https://wa.me/${
    siteConfig.whatsapp
  }?text=${encodeURIComponent(service.finalCta.whatsappMessage)}`;

  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.seo.title,
    description: service.seo.description,
    url: `${siteConfig.seo.url}/servicos/${service.slug}`,
    provider: {
      "@type": "Organization",
      name: siteConfig.nome,
      url: siteConfig.seo.url,
    },
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    serviceType: service.hero.eyebrow,
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main
      className="w-full overflow-x-hidden"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-light)",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />

      {/* HERO */}
      <section
        className="relative overflow-hidden border-b pb-16 pt-[70px] md:pb-20"
        style={{
          background:
            "radial-gradient(circle at 82% 30%, rgba(45,140,255,0.18), transparent 28%), radial-gradient(circle at 12% 82%, rgba(18,50,74,0.34), transparent 30%), linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 90%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="max-w-4xl">
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2"
                style={{
                  backgroundColor: "rgba(45,140,255,0.07)",
                  borderColor: "var(--color-borderLight)",
                  color: "var(--color-accentLight)",
                }}
              >
                <Sparkles className="h-4 w-4" />

                <span
                  className="text-[10px] uppercase tracking-[0.2em] sm:text-xs"
                  style={{
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {service.hero.eyebrow}
                </span>
              </div>

              <h1
                className="mb-6 max-w-4xl text-[2.2rem] uppercase leading-[1] sm:text-[2.8rem] md:text-[3.5rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.hero.title}{" "}
                <span style={{ color: "var(--color-accentLight)" }}>
                  {service.hero.highlightedTitle}
                </span>
              </h1>

              <p
                className="mb-8 max-w-3xl text-sm leading-7 sm:text-base md:text-lg md:leading-8"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {service.hero.description}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
                  style={{
                    backgroundColor: "var(--color-success)",
                    color: "var(--color-text-light)",
                    fontFamily: "var(--font-heading)",
                    boxShadow: "0 14px 36px rgba(19,163,0,0.22)",
                  }}
                >
                  <MessageCircle className="h-4 w-4" />

                  {service.hero.primaryCta}
                </a>

                <Link
                  href="#beneficios"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-white/5"
                  style={{
                    borderColor: "var(--color-borderLight)",
                    color: "var(--color-text-light)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {service.hero.secondaryCta}

                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VISÃO GERAL */}
      <section
        className="border-b py-16 md:py-20"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal direction="right">
            <div>
              <p
                className="mb-4 text-[11px] uppercase tracking-[0.22em]"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.overview.eyebrow}
              </p>

              <h2
                className="text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[2.8rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.overview.title}
              </h2>
            </div>
          </Reveal>

          <Reveal direction="left" delay={100}>
            <div className="space-y-5">
              {service.overview.description.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-7 md:text-base"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section
        id="beneficios"
        className="scroll-mt-24 border-b py-16 md:py-20"
        style={{
          background:
            "linear-gradient(180deg, var(--color-bg-primary) 0%, #041925 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p
                className="mb-4 text-[11px] uppercase tracking-[0.22em]"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.benefitsSection.eyebrow}
              </p>

              <h2
                className="mb-5 text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[2.8rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.benefitsSection.title}
              </h2>

              <p
                className="text-sm leading-7 md:text-base"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {service.benefitsSection.description}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <Reveal
                  key={benefit.title}
                  delay={index * 90}
                  direction="up"
                >
                  <article
                    className="h-full rounded-2xl border p-6 transition duration-300 hover:-translate-y-1"
                    style={{
                      backgroundColor: "var(--color-bg-card)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <div
                      className="bittup-icon-pulse mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: "rgba(45,140,255,0.11)",
                        color: "var(--color-accentLight)",
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3
                      className="mb-3 text-lg"
                      style={{
                        color: "var(--color-text-light)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {benefit.title}
                    </h3>

                    <p
                      className="text-sm leading-7"
                      style={{
                        color: "var(--color-text-secondary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {benefit.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section
        className="border-b py-16 md:py-20"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-12 max-w-3xl">
              <p
                className="mb-4 text-[11px] uppercase tracking-[0.22em]"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.featuresSection.eyebrow}
              </p>

              <h2
                className="mb-5 text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[2.8rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.featuresSection.title}
              </h2>

              <p
                className="text-sm leading-7 md:text-base"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {service.featuresSection.description}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {service.features.map((feature, index) => (
              <Reveal
                key={feature.title}
                delay={index * 60}
                direction={index % 2 === 0 ? "right" : "left"}
              >
                <article
                  className="flex h-full items-start gap-4 rounded-2xl border p-5 md:p-6"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-success) 18%, transparent)",
                      color: "var(--color-success)",
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </span>

                  <div>
                    <h3
                      className="mb-2 text-base md:text-lg"
                      style={{
                        color: "var(--color-text-light)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {feature.title}
                    </h3>

                    <p
                      className="text-sm leading-7"
                      style={{
                        color: "var(--color-text-secondary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUEM É INDICADO */}
      <section
        className="border-b py-16 md:py-20"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal direction="right">
            <div>
              <p
                className="mb-4 text-[11px] uppercase tracking-[0.22em]"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.idealFor.eyebrow}
              </p>

              <h2
                className="mb-5 text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[2.8rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.idealFor.title}
              </h2>

              <p
                className="text-sm leading-7 md:text-base"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {service.idealFor.description}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {service.idealFor.items.map((item, index) => (
              <Reveal key={item} delay={index * 70} direction="up">
                <div
                  className="flex h-full items-start gap-3 rounded-xl border p-5"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-success) 18%, transparent)",
                      color: "var(--color-success)",
                    }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>

                  <p
                    className="text-sm leading-6"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {item}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSO */}
      <section
        className="border-b py-16 md:py-20"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-12 max-w-3xl">
              <p
                className="mb-4 text-[11px] uppercase tracking-[0.22em]"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.processSection.eyebrow}
              </p>

              <h2
                className="mb-5 text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[2.8rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.processSection.title}
              </h2>

              <p
                className="text-sm leading-7 md:text-base"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {service.processSection.description}
              </p>
            </div>
          </Reveal>

          <ol className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {service.process.map((step, index) => (
              <Reveal key={step.number} delay={index * 100}>
                <li
                  className="h-full rounded-2xl border p-6"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <span
                    className="mb-7 block text-sm font-semibold"
                    style={{
                      color: "var(--color-accentLight)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {step.number}
                  </span>

                  <h3
                    className="mb-3 text-lg"
                    style={{
                      color: "var(--color-text-light)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    className="text-sm leading-7"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {step.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="border-b py-16 md:py-20"
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal direction="right">
            <div>
              <p
                className="mb-4 text-[11px] uppercase tracking-[0.22em]"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.faqSection.eyebrow}
              </p>

              <h2
                className="mb-5 text-[1.9rem] leading-tight sm:text-[2.4rem] md:text-[2.8rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.faqSection.title}
              </h2>

              <p
                className="mb-7 max-w-md text-sm leading-7 md:text-base"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {service.faqSection.description}
              </p>

              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-sm font-semibold transition hover:gap-3"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Ver todas as perguntas

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <div className="flex flex-col gap-3">
            {service.faqs.map((faq, index) => (
              <Reveal
                key={faq.question}
                delay={index * 70}
                direction="left"
              >
                <details
                  className="group rounded-xl border p-5"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span
                      className="text-sm font-medium leading-6 md:text-base"
                      style={{
                        color: "var(--color-text-light)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {faq.question}
                    </span>

                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition duration-300 group-open:rotate-90"
                      style={{
                        backgroundColor: "rgba(45,140,255,0.1)",
                        color: "var(--color-accentLight)",
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </summary>

                  <p
                    className="mt-4 pr-8 text-sm leading-7"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {faq.answer}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        className="relative overflow-hidden py-16 md:py-20"
        style={{
          background:
            "radial-gradient(circle at 85% 50%, rgba(45,140,255,0.18), transparent 25%), linear-gradient(145deg, var(--color-bg-tertiary) 0%, var(--color-bg-primary) 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-[120px]"
          style={{
            backgroundColor: "rgba(45,140,255,0.2)",
          }}
        />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto]">
          <Reveal direction="right">
            <div className="max-w-3xl">
              <p
                className="mb-4 text-[11px] uppercase tracking-[0.22em]"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.finalCta.eyebrow}
              </p>

              <h2
                className="mb-5 text-[2rem] leading-tight sm:text-[2.6rem] md:text-[3rem]"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {service.finalCta.title}
              </h2>

              <p
                className="max-w-2xl text-sm leading-7 md:text-base"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {service.finalCta.description}
              </p>
            </div>
          </Reveal>

          <Reveal direction="left" delay={100}>
            <div className="flex flex-col gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 py-4 text-center text-xs font-semibold uppercase tracking-[0.12em] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
                style={{
                  backgroundColor: "var(--color-success)",
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                  boxShadow: "0 14px 36px rgba(19,163,0,0.22)",
                }}
              >
                <MessageCircle className="h-4 w-4 shrink-0" />

                {service.finalCta.buttonLabel}
              </a>

              <Link
                href="/servicos"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-white/5"
                style={{
                  borderColor: "var(--color-borderLight)",
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Ver outros serviços

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}