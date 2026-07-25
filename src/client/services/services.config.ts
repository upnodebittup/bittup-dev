// src/client/services/services.config.ts

import {
  BarChart3,
  Boxes,
  CheckCircle2,
  CodeXml,
  CreditCard,
  FileText,
  Gauge,
  Globe2,
  LayoutDashboard,
  LayoutTemplate,
  LockKeyhole,
  MessageCircle,
  MonitorSmartphone,
  PackageSearch,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type ServiceBenefit = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type ServiceFeature = {
  title: string;
  description: string;
};

export type ServiceProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceConfig = {
  slug: string;

  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
  };

  hero: {
    eyebrow: string;
    title: string;
    highlightedTitle: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };

  overview: {
    eyebrow: string;
    title: string;
    description: string[];
  };

  benefitsSection: {
    eyebrow: string;
    title: string;
    description: string;
  };

  benefits: ServiceBenefit[];

  featuresSection: {
    eyebrow: string;
    title: string;
    description: string;
  };

  features: ServiceFeature[];

  processSection: {
    eyebrow: string;
    title: string;
    description: string;
  };

  process: ServiceProcessStep[];

  idealFor: {
    eyebrow: string;
    title: string;
    description: string;
    items: string[];
  };

  faqSection: {
    eyebrow: string;
    title: string;
    description: string;
  };

  faqs: ServiceFaq[];

  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    whatsappMessage: string;
  };
};

export const servicesConfig: Record<string, ServiceConfig> = {
  "sites-institucionais": {
    slug: "sites-institucionais",

    seo: {
      title: "Criação de Sites Institucionais Profissionais | BittUp",
      description:
        "Criação de sites institucionais profissionais, responsivos e otimizados para SEO. Fortaleça a presença digital da sua empresa com a BittUp.",
      keywords: [
        "criação de site institucional",
        "site profissional para empresa",
        "desenvolvimento de site institucional",
        "site responsivo",
        "site otimizado para Google",
        "empresa de criação de sites",
        "desenvolvimento web",
        "BittUp",
      ],
      ogTitle: "Sites Institucionais Profissionais | BittUp",
      ogDescription:
        "Sites profissionais para apresentar sua empresa, fortalecer sua marca e gerar novas oportunidades.",
    },

    hero: {
      eyebrow: "Sites institucionais",
      title: "Sua empresa merece uma presença digital",
      highlightedTitle: "profissional e confiável.",
      description:
        "Desenvolvemos sites institucionais para apresentar sua empresa, seus serviços e seus diferenciais com clareza, velocidade e estrutura preparada para o Google.",
      primaryCta: "Solicitar orçamento",
      secondaryCta: "Conhecer benefícios",
    },

    overview: {
      eyebrow: "Presença digital de verdade",
      title:
        "Mais do que apresentar sua empresa, seu site precisa transmitir confiança.",
      description: [
        "Um site institucional é o espaço oficial da sua empresa na internet. Nele, o cliente encontra informações sobre seus serviços, diferenciais, localização e formas de contato.",
        "A BittUp desenvolve projetos pensados para fortalecer a autoridade da marca, facilitar a navegação e conduzir visitantes até o contato ou solicitação de orçamento.",
      ],
    },

    benefitsSection: {
      eyebrow: "Principais benefícios",
      title: "Um site preparado para representar bem a sua empresa.",
      description:
        "Cada detalhe é planejado para criar uma experiência profissional, acessível e alinhada aos objetivos do negócio.",
    },

    benefits: [
      {
        icon: Globe2,
        title: "Presença oficial na internet",
        description:
          "Sua empresa deixa de depender apenas das redes sociais e passa a ter um espaço próprio e profissional.",
      },
      {
        icon: Search,
        title: "Estrutura preparada para SEO",
        description:
          "Páginas organizadas semanticamente para facilitar a leitura pelos mecanismos de busca.",
      },
      {
        icon: MonitorSmartphone,
        title: "Experiência responsiva",
        description:
          "O site funciona corretamente em celulares, tablets, notebooks e computadores.",
      },
      {
        icon: MessageCircle,
        title: "Mais oportunidades de contato",
        description:
          "Botões e chamadas estratégicas ajudam o visitante a iniciar uma conversa com sua empresa.",
      },
      {
        icon: Gauge,
        title: "Carregamento otimizado",
        description:
          "Imagens, páginas e recursos são preparados para oferecer uma navegação rápida.",
      },
      {
        icon: ShieldCheck,
        title: "Estrutura profissional",
        description:
          "Desenvolvimento com boas práticas de segurança, manutenção e evolução futura.",
      },
    ],

    featuresSection: {
      eyebrow: "O que pode estar incluso",
      title: "Uma estrutura completa para apresentar o seu negócio.",
      description:
        "O conteúdo e as funcionalidades são definidos conforme a necessidade de cada empresa.",
    },

    features: [
      {
        title: "Página inicial estratégica",
        description:
          "Apresentação clara da empresa, seus principais serviços e diferenciais.",
      },
      {
        title: "Página sobre a empresa",
        description:
          "História, posicionamento, valores e informações que fortalecem a confiança.",
      },
      {
        title: "Páginas de serviços",
        description:
          "Conteúdo específico para cada serviço, favorecendo conversão e SEO.",
      },
      {
        title: "Página de contato",
        description:
          "WhatsApp, formulário, localização, redes sociais e outros canais.",
      },
      {
        title: "Blog profissional",
        description:
          "Estrutura para publicar conteúdos e fortalecer a autoridade da empresa.",
      },
      {
        title: "Painel administrativo",
        description:
          "Área opcional para gerenciar conteúdos, páginas, contatos e configurações.",
      },
      {
        title: "Integrações externas",
        description:
          "Google Maps, redes sociais, formulários, analytics e outras ferramentas.",
      },
      {
        title: "Domínio e hospedagem",
        description:
          "Configuração técnica para colocar o projeto no ar com estabilidade.",
      },
    ],

    processSection: {
      eyebrow: "Como desenvolvemos",
      title: "Do planejamento à publicação, com um processo organizado.",
      description:
        "Você acompanha as etapas e participa das principais decisões do projeto.",
    },

    process: [
      {
        number: "01",
        title: "Entendimento da empresa",
        description:
          "Conhecemos seu negócio, público, objetivos, serviços e diferenciais.",
      },
      {
        number: "02",
        title: "Estrutura e conteúdo",
        description:
          "Definimos páginas, hierarquia das informações e chamadas principais.",
      },
      {
        number: "03",
        title: "Design e desenvolvimento",
        description:
          "Criamos o layout responsivo e implementamos todas as funcionalidades.",
      },
      {
        number: "04",
        title: "Revisão e publicação",
        description:
          "Você revisa o resultado, solicita ajustes e o site é publicado após aprovação.",
      },
    ],

    idealFor: {
      eyebrow: "Para quem é indicado",
      title: "O site institucional é ideal para empresas que precisam:",
      description:
        "Essa solução atende negócios de diferentes segmentos e tamanhos.",
      items: [
        "Apresentar seus serviços de forma profissional",
        "Fortalecer a credibilidade da marca",
        "Ser encontrado por clientes no Google",
        "Centralizar informações e canais de contato",
        "Depender menos das redes sociais",
        "Construir uma presença digital preparada para crescer",
      ],
    },

    faqSection: {
      eyebrow: "Perguntas frequentes",
      title: "Dúvidas sobre criação de sites institucionais.",
      description:
        "Algumas respostas importantes antes de iniciar seu projeto.",
    },

    faqs: [
      {
        question: "Quantas páginas um site institucional pode ter?",
        answer:
          "A quantidade depende da necessidade da empresa. O projeto pode começar com páginas essenciais e receber novas áreas futuramente.",
      },
      {
        question: "O site será preparado para aparecer no Google?",
        answer:
          "Sim. A estrutura recebe títulos, descrições, URLs organizadas, hierarquia de conteúdo, responsividade e configurações fundamentais de SEO.",
      },
      {
        question: "Posso atualizar os conteúdos depois?",
        answer:
          "Sim. O projeto pode contar com painel administrativo ou as atualizações podem ser realizadas pela equipe da BittUp.",
      },
      {
        question: "O site funcionará no celular?",
        answer:
          "Sim. Todo site institucional é desenvolvido com experiência responsiva para diferentes tamanhos de tela.",
      },
      {
        question: "A BittUp cuida do domínio e da hospedagem?",
        answer:
          "Sim. Podemos realizar as configurações necessárias para domínio, hospedagem, banco de dados e publicação.",
      },
    ],

    finalCta: {
      eyebrow: "Comece seu projeto",
      title: "Sua empresa está pronta para ter uma presença digital profissional?",
      description:
        "Conte um pouco sobre o seu negócio e receba uma orientação sobre a melhor estrutura para o seu site.",
      buttonLabel: "Conversar sobre meu site",
      whatsappMessage:
        "Olá! Vim pela página de sites institucionais da BittUp e gostaria de conversar sobre a criação de um site para minha empresa.",
    },
  },

  "landing-pages": {
    slug: "landing-pages",

    seo: {
      title: "Criação de Landing Pages Profissionais | BittUp",
      description:
        "Landing pages profissionais para campanhas, eventos, lançamentos e captação de leads. Páginas rápidas e focadas em conversão.",
      keywords: [
        "criação de landing page",
        "landing page profissional",
        "página de vendas",
        "página para evento",
        "landing page para campanha",
        "captação de leads",
        "página de alta conversão",
        "BittUp",
      ],
      ogTitle: "Landing Pages Profissionais | BittUp",
      ogDescription:
        "Páginas estratégicas para transformar visitantes em contatos, inscrições e vendas.",
    },

    hero: {
      eyebrow: "Landing pages",
      title: "Uma página focada em uma ação, com uma estratégia",
      highlightedTitle: "pensada para converter.",
      description:
        "Criamos landing pages para campanhas, eventos, lançamentos, produtos e serviços que precisam conduzir o visitante até uma decisão.",
      primaryCta: "Solicitar landing page",
      secondaryCta: "Conhecer benefícios",
    },

    overview: {
      eyebrow: "Foco em conversão",
      title:
        "Cada seção precisa aproximar o visitante da ação principal da página.",
      description: [
        "Diferente de um site institucional, uma landing page possui um objetivo específico: gerar uma venda, inscrição, contato, cadastro ou solicitação de orçamento.",
        "A estrutura combina conteúdo, hierarquia visual, chamadas estratégicas e elementos de confiança para reduzir dúvidas e facilitar a decisão do visitante.",
      ],
    },

    benefitsSection: {
      eyebrow: "Principais benefícios",
      title: "Uma página construída para orientar e converter.",
      description:
        "A landing page concentra a mensagem e reduz distrações durante a jornada do visitante.",
    },

    benefits: [
      {
        icon: Zap,
        title: "Objetivo claro",
        description:
          "Toda a página conduz o visitante para uma única ação principal.",
      },
      {
        icon: LayoutTemplate,
        title: "Estrutura estratégica",
        description:
          "Seções organizadas para apresentar problema, solução, benefícios e oferta.",
      },
      {
        icon: Gauge,
        title: "Carregamento rápido",
        description:
          "Desempenho otimizado para reduzir abandono durante campanhas.",
      },
      {
        icon: MonitorSmartphone,
        title: "Conversão no celular",
        description:
          "Experiência adaptada para usuários que acessam anúncios e redes sociais.",
      },
      {
        icon: BarChart3,
        title: "Medição de resultados",
        description:
          "Possibilidade de integração com ferramentas de análise e acompanhamento.",
      },
      {
        icon: MessageCircle,
        title: "Contato simplificado",
        description:
          "Integração com WhatsApp, formulários, checkout e outras ações.",
      },
    ],

    featuresSection: {
      eyebrow: "O que pode estar incluso",
      title: "Recursos para campanhas, lançamentos e captação de contatos.",
      description:
        "A estrutura é personalizada conforme o objetivo e o público da campanha.",
    },

    features: [
      {
        title: "Hero com oferta principal",
        description:
          "Mensagem inicial clara, benefício central e chamada para ação.",
      },
      {
        title: "Apresentação do problema",
        description:
          "Conteúdo que ajuda o visitante a se identificar com a necessidade.",
      },
      {
        title: "Benefícios e diferenciais",
        description:
          "Argumentos organizados para demonstrar o valor da solução.",
      },
      {
        title: "Provas e depoimentos",
        description:
          "Elementos que aumentam a confiança e reduzem inseguranças.",
      },
      {
        title: "Formulário de captação",
        description:
          "Coleta de nome, telefone, e-mail ou outros dados necessários.",
      },
      {
        title: "Integração com WhatsApp",
        description:
          "Botões estratégicos para iniciar conversas com a equipe comercial.",
      },
      {
        title: "Integração com checkout",
        description:
          "Redirecionamento ou integração com plataformas de pagamento.",
      },
      {
        title: "UTMs e analytics",
        description:
          "Configuração para identificar origem de tráfego e acompanhar campanhas.",
      },
    ],

    processSection: {
      eyebrow: "Como desenvolvemos",
      title: "Uma landing page construída a partir do objetivo da campanha.",
      description:
        "A estrutura é definida considerando público, oferta, tráfego e ação esperada.",
    },

    process: [
      {
        number: "01",
        title: "Definição da campanha",
        description:
          "Entendemos a oferta, o público e a ação principal da página.",
      },
      {
        number: "02",
        title: "Estratégia de conteúdo",
        description:
          "Organizamos argumentos, benefícios, objeções e chamadas para ação.",
      },
      {
        number: "03",
        title: "Design e desenvolvimento",
        description:
          "Criamos uma página responsiva, rápida e visualmente alinhada à campanha.",
      },
      {
        number: "04",
        title: "Integração e publicação",
        description:
          "Configuramos formulários, WhatsApp, checkout e ferramentas de medição.",
      },
    ],

    idealFor: {
      eyebrow: "Para quem é indicado",
      title: "Uma landing page é ideal para:",
      description:
        "Projetos que precisam concentrar a atenção do visitante em um único objetivo.",
      items: [
        "Campanhas de anúncios",
        "Eventos presenciais ou online",
        "Lançamentos de produtos e serviços",
        "Captação de leads e contatos",
        "Solicitações de orçamento",
        "Venda de uma oferta específica",
      ],
    },

    faqSection: {
      eyebrow: "Perguntas frequentes",
      title: "Dúvidas sobre criação de landing pages.",
      description:
        "Informações importantes para planejar sua campanha.",
    },

    faqs: [
      {
        question: "Landing page e site institucional são a mesma coisa?",
        answer:
          "Não. O site institucional apresenta a empresa como um todo, enquanto a landing page é direcionada para uma campanha ou ação específica.",
      },
      {
        question: "A landing page pode receber tráfego de anúncios?",
        answer:
          "Sim. A estrutura é preparada para receber visitantes de campanhas no Google, Instagram, Facebook e outras plataformas.",
      },
      {
        question: "É possível integrar a página com WhatsApp?",
        answer:
          "Sim. Podemos adicionar botões, mensagens personalizadas e pontos estratégicos de contato.",
      },
      {
        question: "Vocês configuram formulário e planilha de leads?",
        answer:
          "Sim. A landing page pode enviar os dados para banco de dados, planilha, e-mail ou ferramenta externa.",
      },
      {
        question: "A página pode ser alterada depois da publicação?",
        answer:
          "Sim. Conteúdos, seções, ofertas e integrações podem ser atualizados conforme a campanha evolui.",
      },
    ],

    finalCta: {
      eyebrow: "Comece sua campanha",
      title: "Sua oferta precisa de uma página preparada para converter?",
      description:
        "Conte o objetivo da campanha e vamos planejar a estrutura mais adequada para sua landing page.",
      buttonLabel: "Conversar sobre minha landing page",
      whatsappMessage:
        "Olá! Vim pela página de landing pages da BittUp e gostaria de conversar sobre uma página para minha campanha.",
    },
  },

  "lojas-virtuais": {
    slug: "lojas-virtuais",

    seo: {
      title: "Criação de Lojas Virtuais Profissionais | BittUp",
      description:
        "Desenvolvimento de lojas virtuais responsivas com produtos, categorias, carrinho, pagamentos e gestão de pedidos.",
      keywords: [
        "criação de loja virtual",
        "desenvolvimento de ecommerce",
        "loja online profissional",
        "site para vender produtos",
        "ecommerce responsivo",
        "carrinho de compras",
        "sistema de pedidos online",
        "BittUp",
      ],
      ogTitle: "Lojas Virtuais Profissionais | BittUp",
      ogDescription:
        "Estruturas completas para organizar produtos, receber pagamentos e vender pela internet.",
    },

    hero: {
      eyebrow: "Lojas virtuais",
      title: "Sua loja aberta todos os dias, com uma experiência",
      highlightedTitle: "simples para comprar.",
      description:
        "Desenvolvemos lojas virtuais para empresas que querem organizar produtos, receber pedidos e vender online com segurança e profissionalismo.",
      primaryCta: "Solicitar loja virtual",
      secondaryCta: "Conhecer benefícios",
    },

    overview: {
      eyebrow: "Venda online com organização",
      title:
        "Uma loja virtual precisa facilitar a compra e também simplificar a gestão.",
      description: [
        "O cliente precisa encontrar produtos, entender as opções, adicionar itens ao carrinho e concluir o pedido sem dificuldades.",
        "Ao mesmo tempo, a empresa precisa de uma estrutura para organizar categorias, produtos, pagamentos, clientes e pedidos.",
      ],
    },

    benefitsSection: {
      eyebrow: "Principais benefícios",
      title: "Uma estrutura completa para vender pela internet.",
      description:
        "A loja é desenvolvida para oferecer uma experiência clara ao cliente e uma gestão organizada para a empresa.",
    },

    benefits: [
      {
        icon: ShoppingCart,
        title: "Jornada de compra simples",
        description:
          "Produtos, carrinho e finalização organizados para reduzir dificuldades.",
      },
      {
        icon: PackageSearch,
        title: "Catálogo organizado",
        description:
          "Produtos distribuídos por categorias, coleções e filtros.",
      },
      {
        icon: CreditCard,
        title: "Pagamentos integrados",
        description:
          "Possibilidade de receber Pix, cartão e outros métodos disponíveis.",
      },
      {
        icon: LayoutDashboard,
        title: "Gestão de pedidos",
        description:
          "Painel para acompanhar clientes, pagamentos, status e entregas.",
      },
      {
        icon: MonitorSmartphone,
        title: "Compra pelo celular",
        description:
          "Experiência responsiva para clientes que compram por dispositivos móveis.",
      },
      {
        icon: ShieldCheck,
        title: "Segurança",
        description:
          "Boas práticas para proteger dados, acessos e operações da loja.",
      },
    ],

    featuresSection: {
      eyebrow: "O que pode estar incluso",
      title: "Recursos para organizar produtos, clientes e pedidos.",
      description:
        "As funcionalidades são definidas conforme o modelo de operação da empresa.",
    },

    features: [
      {
        title: "Produtos e categorias",
        description:
          "Cadastro com imagens, descrições, preços, variações e estoque.",
      },
      {
        title: "Carrinho de compras",
        description:
          "Organização dos itens antes da finalização do pedido.",
      },
      {
        title: "Checkout",
        description:
          "Coleta de dados, endereço, entrega e método de pagamento.",
      },
      {
        title: "Integração com pagamentos",
        description:
          "Pix, cartão de crédito e outros métodos conforme o provedor escolhido.",
      },
      {
        title: "Cupons e descontos",
        description:
          "Criação de campanhas promocionais e condições especiais.",
      },
      {
        title: "Área do cliente",
        description:
          "Consulta de pedidos, dados pessoais e informações de compra.",
      },
      {
        title: "Painel administrativo",
        description:
          "Gerenciamento de produtos, pedidos, clientes e conteúdos.",
      },
      {
        title: "Integração com WhatsApp",
        description:
          "Canal de suporte, dúvidas ou finalização assistida de pedidos.",
      },
    ],

    processSection: {
      eyebrow: "Como desenvolvemos",
      title: "A loja é planejada conforme seus produtos e sua operação.",
      description:
        "Antes do desenvolvimento, entendemos como a empresa vende, entrega e recebe pagamentos.",
    },

    process: [
      {
        number: "01",
        title: "Mapeamento da operação",
        description:
          "Analisamos produtos, categorias, entregas, pagamentos e fluxo de pedidos.",
      },
      {
        number: "02",
        title: "Planejamento da loja",
        description:
          "Definimos estrutura, funcionalidades, regras e experiência de compra.",
      },
      {
        number: "03",
        title: "Desenvolvimento e integração",
        description:
          "Criamos a loja e conectamos pagamentos, banco de dados e demais recursos.",
      },
      {
        number: "04",
        title: "Cadastro e publicação",
        description:
          "Configuramos conteúdos iniciais, realizamos testes e colocamos a loja no ar.",
      },
    ],

    idealFor: {
      eyebrow: "Para quem é indicado",
      title: "A loja virtual é ideal para empresas que precisam:",
      description:
        "A solução pode atender produtos físicos, personalizados ou catálogos específicos.",
      items: [
        "Vender produtos diretamente pela internet",
        "Organizar produtos e categorias",
        "Receber pagamentos online",
        "Centralizar pedidos e clientes",
        "Depender menos de pedidos manuais",
        "Criar uma operação preparada para crescer",
      ],
    },

    faqSection: {
      eyebrow: "Perguntas frequentes",
      title: "Dúvidas sobre desenvolvimento de lojas virtuais.",
      description:
        "Informações importantes para organizar o seu comércio eletrônico.",
    },

    faqs: [
      {
        question: "A loja pode receber pagamentos por Pix e cartão?",
        answer:
          "Sim. Podemos integrar a loja com provedores que oferecem Pix, cartão de crédito e outros métodos.",
      },
      {
        question: "É possível controlar o estoque dos produtos?",
        answer:
          "Sim. A estrutura pode controlar quantidade disponível, variações e indisponibilidade.",
      },
      {
        question: "A loja pode calcular frete?",
        answer:
          "Sim. O cálculo pode ser integrado com serviços de entrega ou configurado conforme as regras da empresa.",
      },
      {
        question: "Consigo cadastrar novos produtos depois?",
        answer:
          "Sim. O painel administrativo permite cadastrar, editar e remover produtos e categorias.",
      },
      {
        question: "A loja funciona bem no celular?",
        answer:
          "Sim. A experiência de navegação, carrinho e checkout é desenvolvida para diferentes telas.",
      },
    ],

    finalCta: {
      eyebrow: "Comece a vender online",
      title: "Seus produtos estão prontos para ganhar uma loja profissional?",
      description:
        "Conte como sua empresa vende atualmente e vamos planejar uma estrutura adequada para sua operação.",
      buttonLabel: "Conversar sobre minha loja",
      whatsappMessage:
        "Olá! Vim pela página de lojas virtuais da BittUp e gostaria de conversar sobre uma loja online para minha empresa.",
    },
  },

  "sistemas-web": {
    slug: "sistemas-web",

    seo: {
      title: "Desenvolvimento de Sistemas Web Personalizados | BittUp",
      description:
        "Desenvolvimento de sistemas web personalizados, painéis administrativos, áreas de cliente, automações e integrações para empresas.",
      keywords: [
        "desenvolvimento de sistema web",
        "sistema personalizado para empresa",
        "painel administrativo",
        "área do cliente",
        "automação de processos",
        "sistema de gestão online",
        "integração de APIs",
        "BittUp",
      ],
      ogTitle: "Sistemas Web Personalizados | BittUp",
      ogDescription:
        "Soluções personalizadas para organizar processos, informações, clientes e operações.",
    },

    hero: {
      eyebrow: "Sistemas web",
      title: "Tecnologia personalizada para organizar processos e",
      highlightedTitle: "acompanhar o crescimento.",
      description:
        "Desenvolvemos sistemas web, painéis administrativos, áreas restritas e automações para empresas que precisam centralizar informações e reduzir tarefas manuais.",
      primaryCta: "Conversar sobre o sistema",
      secondaryCta: "Conhecer benefícios",
    },

    overview: {
      eyebrow: "Soluções sob medida",
      title:
        "Quando ferramentas genéricas não acompanham sua operação, o sistema precisa se adaptar ao negócio.",
      description: [
        "Cada empresa possui processos, regras e necessidades próprias. Em muitos casos, planilhas, mensagens e ferramentas desconectadas começam a gerar retrabalho e dificuldade de acompanhamento.",
        "Um sistema web personalizado centraliza informações, automatiza atividades e cria uma base mais segura para a operação crescer.",
      ],
    },

    benefitsSection: {
      eyebrow: "Principais benefícios",
      title: "Mais organização, controle e eficiência para sua empresa.",
      description:
        "A solução é construída conforme o fluxo real de trabalho da equipe.",
    },

    benefits: [
      {
        icon: Workflow,
        title: "Automação de processos",
        description:
          "Redução de atividades repetitivas e etapas executadas manualmente.",
      },
      {
        icon: LayoutDashboard,
        title: "Informações centralizadas",
        description:
          "Dados, clientes, pedidos e operações reunidos em uma única plataforma.",
      },
      {
        icon: Users,
        title: "Controle de usuários",
        description:
          "Permissões e acessos definidos conforme cada perfil da equipe.",
      },
      {
        icon: BarChart3,
        title: "Acompanhamento de dados",
        description:
          "Indicadores e informações importantes disponíveis para consulta.",
      },
      {
        icon: LockKeyhole,
        title: "Áreas protegidas",
        description:
          "Ambientes restritos para equipe, administradores ou clientes.",
      },
      {
        icon: Boxes,
        title: "Evolução modular",
        description:
          "Novas funcionalidades podem ser adicionadas conforme a necessidade.",
      },
    ],

    featuresSection: {
      eyebrow: "O que pode estar incluso",
      title: "Funcionalidades construídas conforme a operação da empresa.",
      description:
        "O sistema pode reunir diferentes módulos em uma única solução.",
    },

    features: [
      {
        title: "Painel administrativo",
        description:
          "Gerenciamento de conteúdos, usuários, pedidos, cadastros e configurações.",
      },
      {
        title: "Área do cliente",
        description:
          "Ambiente para acesso a dados, documentos, serviços ou solicitações.",
      },
      {
        title: "Gestão de usuários",
        description:
          "Cadastro, autenticação, permissões e níveis de acesso.",
      },
      {
        title: "Automação de tarefas",
        description:
          "Execução automática de etapas repetitivas e notificações.",
      },
      {
        title: "Relatórios e indicadores",
        description:
          "Visualização de informações importantes para acompanhamento.",
      },
      {
        title: "Integração com APIs",
        description:
          "Conexão com pagamentos, mensagens, armazenamento e serviços externos.",
      },
      {
        title: "Gestão de documentos",
        description:
          "Upload, organização, consulta e controle de arquivos.",
      },
      {
        title: "Banco de dados próprio",
        description:
          "Estrutura independente e preparada para a realidade do projeto.",
      },
    ],

    processSection: {
      eyebrow: "Como desenvolvemos",
      title: "O sistema começa pelo entendimento completo da operação.",
      description:
        "Antes de desenvolver, identificamos usuários, processos, regras e prioridades.",
    },

    process: [
      {
        number: "01",
        title: "Mapeamento dos processos",
        description:
          "Entendemos como a operação funciona atualmente e onde estão os principais problemas.",
      },
      {
        number: "02",
        title: "Definição dos módulos",
        description:
          "Organizamos funcionalidades, usuários, permissões e prioridades do sistema.",
      },
      {
        number: "03",
        title: "Desenvolvimento por etapas",
        description:
          "Construímos os módulos de forma organizada, testável e preparada para evolução.",
      },
      {
        number: "04",
        title: "Testes e implantação",
        description:
          "Validamos os fluxos, configuramos o ambiente e disponibilizamos a solução.",
      },
    ],

    idealFor: {
      eyebrow: "Para quem é indicado",
      title: "Um sistema web personalizado é ideal para empresas que precisam:",
      description:
        "A solução atende operações que não se encaixam bem em ferramentas prontas.",
      items: [
        "Centralizar informações espalhadas",
        "Reduzir tarefas manuais e retrabalho",
        "Controlar acessos e permissões",
        "Criar uma área exclusiva para clientes",
        "Integrar diferentes ferramentas",
        "Desenvolver uma solução preparada para evoluir",
      ],
    },

    faqSection: {
      eyebrow: "Perguntas frequentes",
      title: "Dúvidas sobre desenvolvimento de sistemas web.",
      description:
        "Informações importantes antes de iniciar uma solução personalizada.",
    },

    faqs: [
      {
        question: "Como é definido o valor de um sistema personalizado?",
        answer:
          "O investimento depende dos módulos, funcionalidades, integrações, usuários e complexidade dos processos envolvidos.",
      },
      {
        question: "O sistema pode começar menor e crescer depois?",
        answer:
          "Sim. Podemos priorizar um conjunto inicial de funcionalidades e adicionar novos módulos conforme a evolução do projeto.",
      },
      {
        question: "É possível integrar o sistema com outras plataformas?",
        answer:
          "Sim. Desde que a plataforma possua uma integração disponível, podemos conectar pagamentos, mensagens, armazenamento e outros serviços.",
      },
      {
        question: "O sistema pode ter diferentes tipos de usuário?",
        answer:
          "Sim. É possível criar perfis com permissões específicas para administradores, equipe, parceiros e clientes.",
      },
      {
        question: "O sistema funciona no celular?",
        answer:
          "Sim. A interface pode ser desenvolvida de forma responsiva e, conforme o projeto, também preparada como aplicativo web instalável.",
      },
    ],

    finalCta: {
      eyebrow: "Planeje sua solução",
      title: "Sua empresa precisa de uma ferramenta criada para a própria operação?",
      description:
        "Conte como o processo funciona atualmente e quais dificuldades sua equipe enfrenta.",
      buttonLabel: "Conversar sobre meu sistema",
      whatsappMessage:
        "Olá! Vim pela página de sistemas web da BittUp e gostaria de conversar sobre uma solução personalizada para minha empresa.",
    },
  },
};

export const serviceSlugs = Object.keys(servicesConfig);

export function getServiceBySlug(slug: string) {
  return servicesConfig[slug];
}

export function isValidServiceSlug(slug: string) {
  return Boolean(servicesConfig[slug]);
}