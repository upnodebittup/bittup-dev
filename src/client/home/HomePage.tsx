// src/client/home/HomePage.tsx
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Gem,
  Globe,
  LayoutTemplate,
  MapPinned,
  MessageCircle,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { prisma } from "@/core/lib/prisma";
import { siteConfig } from "@/client/config/site.config";

export default async function HomePage() {
  const categories = await prisma.blogCategory.findMany({
    where: { showOnHome: true },
    orderBy: { order: "asc" },
    take: 3,
  });

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    siteConfig.whatsappMensagem
  )}`;

  const solutions = [
    {
      icon: Globe,
      title: "Presença Digital Profissional",
      description:
        "Um site passa mais autoridade para seu negócio, aumenta sua credibilidade no Google e cria mais oportunidades reais.",
    },
    {
      icon: Gem,
      title: "Redes Sociais não substituem um site",
      description:
        "Instagram e Facebook ajudam, mas um site profissional é o que realmente coloca sua empresa em outro nível.",
    },
    {
      icon: Zap,
      title: "Sites que vendem pra você",
      description:
        "Além de mostrar seus serviços, um bom site trabalha 24h por dia conduzindo o cliente até seu contato.",
      featured: true,
    },
    {
      icon: Search,
      title: "Apareça no Google sem complicação",
      description:
        "A BittUp cuida da parte técnica, domínio, hospedagem e estrutura pra sua empresa ser encontrada.",
    },
    {
      icon: MapPinned,
      title: "Seu negócio merece ser encontrado",
      description:
        "Se alguém procurar por você agora, sua empresa precisa aparecer com presença e confiança.",
    },
    {
      icon: BriefcaseBusiness,
      title: "Investimento acessível, com retorno",
      description:
        "Você não precisa gastar alto pra ter um site profissional com visual forte e estratégia.",
      muted: true,
    },
  ];

  const processSteps = [
    {
      step: "PASSO 01",
      title: "Conversa inicial pelo WhatsApp",
      description:
        "Você manda mensagem, me conta sobre seu negócio e o que precisa pra começar a aparecer nas buscas.",
    },
    {
      step: "PASSO 02",
      title: "Planejamento do seu site",
      description:
        "Com base no seu momento, defino visual, estrutura, conteúdo e posicionamento ideal.",
    },
    {
      step: "PASSO 03",
      title: "Criação e configuração",
      description:
        "Desenvolvo seu site, configuro domínio e hospedagem, e deixo tudo preparado para o Google.",
    },
    {
      step: "PASSO 04",
      title: "Lançamento e suporte",
      description:
        "Seu site vai ao ar pronto para trazer clientes, com acompanhamento quando necessário.",
    },
  ];

 const faqs = [
  {
    pergunta: "Preciso entender de tecnologia para ter meu site?",
    resposta:
      "De forma alguma! Eu cuido de tudo pra você. Você só me passa as informações básicas do seu negócio e aprova o layout.",
  },
  {
    pergunta: "O que está incluso no serviço da BittUp?",
    resposta:
      "Você recebe um site completo, com primeiro ano de domínio grátis, hospedagem dois anos grátis, design personalizado, otimização para o Google e botões de contato no WhatsApp.",
  },
  {
    pergunta: "Em quanto tempo meu site fica pronto?",
    resposta:
      "O prazo médio é de 3 a 5 dias úteis após o envio das informações. Sempre aviso cada etapa no WhatsApp.",
  },
  {
    pergunta: "Posso usar meu site no celular e no computador?",
    resposta:
      "Sim! Seu site será 100% responsivo, adaptado para funcionar perfeitamente em qualquer dispositivo.",
  },
  {
    pergunta: "Como funciona o pagamento?",
    resposta:
      "Trabalho com valores acessíveis e formas de pagamento facilitadas. Pix e cartão de crédito são aceitos.",
  },
  {
    pergunta: "Depois que o site estiver pronto, posso pedir alterações?",
    resposta:
      "Sim! Faço ajustes básicos sem custo extra durante o período de suporte. E você sempre pode falar direto comigo no WhatsApp.",
  },
];

  return (
    <main
      className="w-full overflow-x-hidden"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* HERO */}
      <section
        className="relative border-b"
        style={{
          background:
            "radial-gradient(circle at 78% 18%, rgba(45,140,255,0.15), transparent 22%), linear-gradient(180deg, var(--color-bg-primary) 0%, #03111A 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-[60px] md:pt-[60px] pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="max-w-2xl order-1">
              <p
                className="text-[10px] sm:text-xs uppercase tracking-[0.24em] mb-4"
                style={{
                  color: "var(--color-textHeroMuted)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                BittUp
              </p>

              <h1
                className="text-[2.3rem] sm:text-[3rem] md:text-[4.6rem] leading-[0.94] uppercase mb-5"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Sua Empresa
                <br />
                no Google
              </h1>

              <p
                className="text-sm md:text-base leading-7 max-w-xl mb-8"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Seja encontrado no Google com um site profissional, rápido e
                acessível. Cuidamos de tudo: domínio, hospedagem e design
                pronto pra gerar clientes. Você só precisa chamar no WhatsApp.
              </p>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[11px] uppercase tracking-[0.15em] transition hover:opacity-90"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid var(--color-borderLight)",
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Quero ser encontrado online
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="order-2 relative w-full flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] min-h-[340px] sm:min-h-[420px] md:min-h-[520px] flex items-end justify-center">
                <Image
                  src="/hero-bittup-person.png"
                  alt="Profissional representando negócios que querem aparecer no Google"
                  width={500}
                  height={640}
                  priority
                  className="relative z-10 w-auto h-[300px] sm:h-[390px] md:h-[520px] object-contain"
                />

                <div
                  className="absolute right-0 sm:right-4 bottom-6 sm:bottom-10 z-20 rounded-xl px-4 py-3 max-w-[210px]"
                  style={{
                    backgroundColor: "rgba(20,39,54,0.88)",
                    border: "1px solid var(--color-border)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <p
                    className="text-[11px] leading-5"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Nunca foi tão acessível
                    <br />
                    ser visto no google
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESCOLHER A BITTUP */}
<section
  className="py-16 md:py-24 border-b"
  style={{
    backgroundColor: "#031722",
    borderColor: "var(--color-border)",
  }}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <p
      className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mb-8"
      style={{
        color: "var(--color-textMuted)",
        fontFamily: "var(--font-heading)",
      }}
    >
      Escolher a BittUp?
    </p>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* IMAGEM */}
      <div className="w-full">
        <div
          className="rounded-[10px] overflow-hidden border"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg-card)",
          }}
        >
          <Image
            src="/about-bittup-team.jpg"
            alt="Equipe em reunião estratégica"
            width={720}
            height={920}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* TEXTO */}
      <div className="w-full">
        <h2
          className="text-[1.9rem] sm:text-[2.3rem] md:text-[2.8rem] leading-tight mb-5"
          style={{
            color: "var(--color-text-light)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Elevando Negócios com
          <br />
          Presença Digital de Verdade
        </h2>

        <p
          className="text-sm md:text-base leading-7 mb-6 max-w-2xl"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-body)",
          }}
        >
          Na BittUp, transformamos ideias em sites que realmente vendem.
          Oferecemos uma presença digital clara, profissional e acessível para
          negócios que precisam aparecer no Google e conquistar mais clientes.
        </p>

        <p
          className="text-sm md:text-base leading-7 mb-8 max-w-2xl"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-body)",
          }}
        >
          Acreditamos que todo negócio merece ser encontrado online e tratado
          com cuidado, mesmo que esteja começando agora.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="rounded-[8px] p-5 border h-full"
            style={{
              backgroundColor: "#081C29",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "rgba(45,140,255,0.14)",
                  color: "var(--color-accentLight)",
                }}
              >
                <Building2 className="w-5 h-5" />
              </div>

              <h3
                className="text-sm leading-5"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Atendimento 100%
                <br />
                Humano
              </h3>
            </div>

            <p
              className="text-xs leading-6"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Você fala comigo no WhatsApp, sem robôs, sem enrolação.
            </p>
          </div>

          <div
            className="rounded-[8px] p-5 border h-full"
            style={{
              backgroundColor: "#081C29",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "rgba(45,140,255,0.14)",
                  color: "var(--color-accentLight)",
                }}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>

              <h3
                className="text-sm leading-5"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Soluções Ágeis e
                <br />
                Profissionais
              </h3>
            </div>

            <p
              className="text-xs leading-6"
              style={{
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Sites completos, com domínio e hospedagem inclusos, pensados pra
              dar resultado.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* SOLUÇÕES */}
      <section
        className="py-16 md:py-24 border-b"
        style={{
          background:
            "linear-gradient(180deg, #041825 0%, #041520 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-8 lg:gap-10 items-start mb-10">
            <div>
              <h2
                className="text-[1.9rem] sm:text-[2.4rem] md:text-[2.8rem] leading-tight"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Soluções inovadoras para
                <br />
                <span style={{ color: "var(--color-accentLight)" }}>
                  impulsionar seu negócio Online
                </span>
              </h2>
            </div>

            <div>
              <p
                className="text-sm md:text-base leading-7 mb-5"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Na BittUp, entendemos que cada negócio é único, por isso,
                oferecemos soluções personalizadas pra fazer sua empresa ser
                encontrada no Google e gerar novas oportunidades.
              </p>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-[11px] uppercase tracking-[0.15em]"
                style={{
                  backgroundColor: "var(--color-accentHover)",
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Saber Mais
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {solutions.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="relative rounded-[4px] p-5 md:p-6 border min-h-[210px]"
                  style={{
                    backgroundColor: item.featured
                      ? "#13344D"
                      : item.muted
                      ? "rgba(255,255,255,0.10)"
                      : "#071A27",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-5"
                    style={{
                      backgroundColor: "rgba(45,140,255,0.10)",
                      color: "var(--color-accentLight)",
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3
                    className="text-lg md:text-xl leading-tight mb-4"
                    style={{
                      color: "var(--color-text-light)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="text-sm leading-7"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PASSOS */}
      <section
        className="py-16 md:py-24 border-b"
        style={{
          backgroundColor: "#031722",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mb-3"
            style={{
              color: "var(--color-textMuted)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Nosso processo
          </p>

          <h2
            className="text-[1.9rem] sm:text-[2.3rem] md:text-[2.7rem] leading-tight mb-10 uppercase"
            style={{
              color: "var(--color-text-light)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Seu site pronto em 7 dias
          </h2>

          <div className="grid gap-5">
            {processSteps.map((item) => (
              <div
                key={item.step}
                className="grid grid-cols-1 md:grid-cols-[64px,1fr,44px] gap-4 md:gap-5 items-start md:items-center rounded-[6px] border px-4 md:px-8 py-5 md:py-6"
                style={{
                  backgroundColor: "#10212C",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(13,110,253,0.10)",
                    color: "var(--color-accentLight)",
                  }}
                >
                  <Clock3 className="w-5 h-5" />
                </div>

                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] mb-2"
                    style={{
                      color: "var(--color-textMuted)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {item.step}
                  </p>

                  <h3
                    className="text-base md:text-lg mb-2"
                    style={{
                      color: "var(--color-text-light)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="text-sm leading-7"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                <div className="hidden md:flex justify-end">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      border: "1px solid var(--color-border)",
                      color: "var(--color-accentLight)",
                    }}
                  >
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
<section
  className="py-16 md:py-24 border-b relative overflow-hidden"
  style={{
    background:
      "radial-gradient(circle at 88% 50%, rgba(13,110,253,0.14), transparent 18%), linear-gradient(180deg, #041621 0%, #031520 100%)",
    borderColor: "var(--color-border)",
  }}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <div className="hidden lg:flex lg:items-center lg:justify-between gap-12">
      {/* TEXTO */}
      <div className="flex-1 max-w-2xl">
        <p
          className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mb-4"
          style={{
            color: "var(--color-textMuted)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Mude sua presença online
        </p>

        <h2
          className="text-[1.9rem] sm:text-[2.3rem] md:text-[2.8rem] leading-tight mb-6"
          style={{
            color: "var(--color-text-light)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Se seu negócio não tem site, ele
          <br />
          simplesmente não existe para
          <br />
          quem procura no Google
        </h2>

        <p
          className="text-sm md:text-base leading-7 mb-8 max-w-xl"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-body)",
          }}
        >
          Pare de depender apenas de Instagram ou indicações. Com um site
          profissional, sua empresa pode gerar mais presença e confiança.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-[11px] uppercase tracking-[0.15em]"
            style={{
              backgroundColor: "var(--color-accentHover)",
              color: "var(--color-text-light)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Quero ser encontrado online
          </a>

          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-[11px] uppercase tracking-[0.15em]"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-text-light)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Ver meus trabalhos
          </Link>
        </div>
      </div>

      {/* ÍCONE AO LADO */}
      <div className="w-[220px] flex justify-end shrink-0">
        <div className="relative w-[180px] h-[180px]">
          <div
            className="absolute inset-0 rounded-full border"
            style={{
              borderColor: "rgba(255,255,255,0.10)",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
          />

          <div
            className="absolute inset-[22%] rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "rgba(13,110,253,0.10)",
              color: "var(--color-accentLight)",
            }}
          >
            <MonitorSmartphone className="w-10 h-10" />
          </div>
        </div>
      </div>
    </div>

    {/* MOBILE / TABLET */}
    <div className="flex flex-col gap-8 lg:hidden">
      <div className="max-w-2xl">
        <p
          className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mb-4"
          style={{
            color: "var(--color-textMuted)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Mude sua presença online
        </p>

        <h2
          className="text-[1.9rem] sm:text-[2.3rem] leading-tight mb-6"
          style={{
            color: "var(--color-text-light)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Se seu negócio não tem site, ele
          <br />
          simplesmente não existe para
          <br />
          quem procura no Google
        </h2>

        <p
          className="text-sm md:text-base leading-7 mb-8 max-w-xl"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-body)",
          }}
        >
          Pare de depender apenas de Instagram ou indicações. Com um site
          profissional, sua empresa pode gerar mais presença e confiança.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-[11px] uppercase tracking-[0.15em]"
            style={{
              backgroundColor: "var(--color-accentHover)",
              color: "var(--color-text-light)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Quero ser encontrado online
          </a>

          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-[11px] uppercase tracking-[0.15em]"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-text-light)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Ver meus trabalhos
          </Link>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative w-[180px] h-[180px]">
          <div
            className="absolute inset-0 rounded-full border"
            style={{
              borderColor: "rgba(255,255,255,0.10)",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
          />

          <div
            className="absolute inset-[22%] rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "rgba(13,110,253,0.10)",
              color: "var(--color-accentLight)",
            }}
          >
            <MonitorSmartphone className="w-10 h-10" />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
     
{/* FAQ */}
<section
  className="py-16 md:py-24 border-b"
  style={{
    backgroundColor: "#08212B",
    borderColor: "var(--color-border)",
  }}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <div className="grid grid-cols-1 lg:grid-cols-[0.9fr,1.1fr] gap-10 lg:gap-12 items-start">
      {/* TEXTO LADO ESQUERDO */}
      <div>
        <p
          className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mb-3"
          style={{
            color: "var(--color-textMuted)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Está com dúvidas?
        </p>

        <h2
          className="text-[1.9rem] sm:text-[2.3rem] md:text-[2.7rem] leading-tight mb-5"
          style={{
            color: "var(--color-text-light)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Confira as perguntas
          <br />
          frequentes
        </h2>

        <p
          className="text-sm md:text-base leading-7 max-w-md"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-body)",
          }}
        >
          Respondemos as dúvidas mais comuns para você entender como
          funciona o nosso serviço.
        </p>
      </div>

      {/* DROPDOWN FAQ */}
      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-[6px] border px-4 md:px-5 py-3"
            style={{
              backgroundColor: "#0A1B27",
              borderColor: "var(--color-border)",
            }}
          >
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none">
              <span
                className="text-sm leading-6"
                style={{
                  color: "var(--color-text-light)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {faq.pergunta}
              </span>

              <span
                className="flex items-center justify-center w-6 h-6 shrink-0 rounded-full"
                style={{
                  backgroundColor: "rgba(45,140,255,0.10)",
                  color: "var(--color-accentLight)",
                }}
              >
                <svg
                  className="w-3 h-3 transition-transform duration-200 group-open:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </summary>

            <div className="mt-3 pr-6">
              <p
                className="text-sm leading-7"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {faq.resposta}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* BLOG */}
      {categories.length > 0 && (
        <section
          className="py-16 md:py-24 border-b"
          style={{
            backgroundColor: "#041722",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <p
                  className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mb-3"
                  style={{
                    color: "var(--color-textMuted)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Blog
                </p>

                <h2
                  className="text-[1.8rem] sm:text-[2.1rem] md:text-[2.2rem] leading-tight"
                  style={{
                    color: "var(--color-text-light)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Conteúdos para fortalecer sua presença online
                </h2>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm"
                style={{
                  color: "var(--color-accentLight)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog/categoria/${cat.slug}`}
                  className="rounded-[8px] border p-5 md:p-6 transition hover:translate-y-[-2px]"
                  style={{
                    backgroundColor: "#0A1B27",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: "rgba(45,140,255,0.10)",
                        color: "var(--color-accentLight)",
                      }}
                    >
                      <LayoutTemplate className="w-5 h-5" />
                    </div>

                    <span
                      className="text-xs uppercase tracking-[0.16em]"
                      style={{
                        color: "var(--color-textMuted)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      Categoria
                    </span>
                  </div>

                  <h3
                    className="text-xl mb-3"
                    style={{
                      color: "var(--color-text-light)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {cat.name}
                  </h3>

                  <p
                    className="text-sm leading-7 mb-4"
                    style={{
                      color: "var(--color-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {cat.description ??
                      "Conteúdos pensados para ajudar negócios a serem vistos no Google."}
                  </p>

                  <span
                    className="inline-flex items-center gap-2 text-sm"
                    style={{
                      color: "var(--color-accentLight)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Ler artigos <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}