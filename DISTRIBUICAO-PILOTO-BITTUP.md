# Distribuição piloto — BittUp

16/10/2026. Branch: develop. Base do cliente: 2f2a8b2. Referência: upnode-template nos commits 35f50c9, 171cd0a, 5799f90 e 627d244.

## Resultado

Implementação local concluída. Remotes confirmados: develop → upnodebittup/bittup-dev; origin → upnodebittup/bittup-upnode. Árvore estava limpa antes da escrita; branch e upstream não foram alterados. Nenhum push, merge, deploy, migration ou cobrança foi executado. Nenhum .env foi aberto ou alterado. Escrita exclusivamente na BittUp.

- Autorização administrativa centralizada, JWT validado, proteção de APIs, páginas administrativas e uploads.
- Pedidos acessíveis somente ao administrador ou ao comprador autorizado por cookie assinado temporário. Consulta por **e-mail + CPF preservada**, sem conta, OTP, Resend ou SMS. PATCH genérico não aprova pagamentos nem altera valores.
- Quantidades inteiras positivas, preços/totais calculados com produtos do servidor, frete assinado e reserva condicional transacional de estoque.
- Asaas e Mercado Pago mantidos, com autenticação dos webhooks, conferência de associação/valor e tratamento de reentrega de status.
- Módulos centralizados em src/client/config/modules.config.ts: **loja, checkout, blog, serviços, portfólio e PWA ativos**. Guards nas páginas/APIs e filtros de navegação, sitemap e cache respeitam configuração desligada; histórico administrativo preservado.
- Sitemap dinâmico com falhas isoladas, produtos elegíveis, artigos publicados, categorias relevantes e os serviços/projetos reais da BittUp. /sobre e /processo sobrevivem a falhas das fontes dinâmicas. Canonical incorreto /processos corrigido para /processo. Metadados, OG/Twitter, JSON-LD, breadcrumbs, noindex e 404 incorporados.

## Arquivos copiados, adaptados e preservados

O manifesto completo está em **tests/distribution-files.json**. Foram 100 cópias diretas finais, comparadas individualmente com a matriz; adaptações e arquivos adicionados estão separados. Não foi copiada uma pasta inteira sem comparação.

| Grupo | Arquivos principais / tratamento |
|---|---|
| Cópias diretas | src/core/lib/{admin-access,auth-token,order-access,request-security,commerce-security,payment-security,module-config,module-server,modules,store,store-server,seo-data,content-seo}.ts, conforme classificação final do manifesto; APIs administrativas/pagamentos/pedidos compatíveis; consumidores de checkout, frete e pagamento; componentes de conteúdo/SEO; guards e correções de tipagem da matriz. |
| APIs adaptadas | src/app/api/clients/route.ts mantém o contrato POST específico, agora com withAdmin e withModuleApi. Não foi adicionada indiscriminadamente a listagem GET de subcontas da matriz. |
| Configuração e SEO próprios | src/client/config/{modules,seo,content}.config.ts; site.config.ts só referencia a flag central de PWA. content.config.ts deriva os registros dos serviços/projetos existentes. src/app/sitemap.ts, manifest.ts, middleware.ts e next.config.ts adaptados. |
| Páginas próprias | app/(site)/{servicos,portfolio}/** receberam guards, metadados/404 e breadcrumbs; sobre e processo mantêm textos e apresentação. Homepage mantém estrutura, conteúdo e componentes, com condições dos módulos, consulta de blog condicionada e JSON-LD seguro. Header/footer mantêm visual e filtram apenas links de módulos desligados. |
| PWA próprio | src/app/sw.ts, app/serwist/[path]/route.ts, core/pwa/PwaProvider.tsx, OfflinePresentationManager.tsx e app/(site)/preparar-offline/page.tsx adaptados. Serwist continua sendo o único worker, em /serwist/sw.js, com escopo /. Nenhum worker básico da matriz foi instalado. |
| CMS próprio | core/components/admin/PageForm.tsx preservado; adicionados teste do resultado do upload e texto alternativo da prévia. Não foram copiados campos/seções extras da matriz. |
| Aliases | /carrinho e /pedido/[orderId] movidos para o grupo (site), preservando URLs e usando layout/provedores existentes. |
| Preservação | Logo, tema, imagens, conteúdos de serviços e projetos, homepage, /processo, identidade e estilos próprios mantidos. Nenhum schema, migration, seed ou lockfile foi substituído. Sem novas dependências. |

Organization/WebSite usam a identidade já existente em site.config.ts. Nenhum endereço completo ou LocalBusiness foi inventado. Conteúdos e nomes de projetos no portfólio já pertenciam à BittUp.

## PWA e apresentação offline

O defaultCache amplo foi substituído por regras explícitas dentro do próprio Serwist. Toda a árvore /loja, pedidos, carrinho, checkout, administração, APIs, requisições autenticadas por Authorization, RSC e navegações originadas em páginas privadas passam pela rede. Respostas private/no-store/no-cache, Set-Cookie ou Vary Cookie/Authorization não entram no cache público. Caches antigos de páginas e dados são limpos na ativação; a versão inclui a configuração dos módulos.

A preparação mantém a interface existente e aquece sobre, processo, serviços e portfólio, incluindo suas páginas individuais. Antes de informar sucesso, confirma a presença dos documentos no cache. Home e blog dinâmicos, loja e documentos privados não são preparados offline; recebem rede/fallback público quando apropriado. Isso evita armazenar respostas no-store; a homepage online está preservada. Ao desativar PWA, o provider remove a inscrição/caches próprios e o endpoint existente entrega um worker de aposentadoria.

**Limitação:** compilação, manifesto, escopo HTTP e regras do worker foram verificados; instalação real, atualização de worker antigo, imagens lazy, persistência e navegação sem internet precisam de teste em navegador/tablet. Preparar novamente a apresentação após atualizar, pois caches antigos serão removidos. Algumas imagens grandes já ultrapassavam o limite de precache do Serwist; não foi ampliado esse limite automaticamente.

## Testes

| Verificação | Resultado |
|---|---|
| TypeScript | Aprovado, sem emissão/incremental. |
| ESLint | 0 erros e 9 avisos de img. Inspeção em memória dos 143 arquivos do HEAD original encontrou 62 erros e 13 avisos; nenhuma regra global foi desativada. Corrigidos tipos/imports/estado sem uso e links internos do offline. |
| Segurança/módulos/SEO/PWA | **39/39** em tests/security.test.mjs. Rede real desabilitada na suíte, banco e provedores simulados. Inclui comprador legítimo e acesso indevido, JWT, frete adulterado, estoque agregado, valores de pagamento, webhooks inválidos/duplicados, flags desligadas, publicação/canonical/JSON-LD e seleção de cache do worker real com estratégias representadas por mocks. |
| Build de produção | Next 16.2.4/Turbopack aprovado com código real e Serwist. Cópia isolada sem .env, banco sintético inacessível, usando cliente Prisma já gerado; sem prisma generate/migrations. |
| HTTP sem banco | **18/18**: carrinho/checkout/consulta, serviços, portfólio, sobre/processo, 404, manifesto, worker e bloqueios administrativos/pedidos. |
| HTTP com Prisma sintético | **26/26**: homepage real renderizada, catálogo/produto/categoria e artigo publicados, 404, sitemap, JSON-LD, canonical, noindex, manifesto/escopo Serwist e negações de APIs. Prisma substituído somente na cópia temporária; nenhum banco real utilizado. |

Total: 44 verificações HTTP. Avisos do build: middleware depreciado, Browserslist antigo e lockfile duplicado da cópia isolada; imagens grandes excluídas do precache pelo limite existente. Não foram tratados como regressões. Artefatos temporários não integram o commit.

## Configuração externa e homologação online pendente

Somente nomes, sem valores secretos:

| Integração | Configuração necessária |
|---|---|
| Banco/autenticação | DATABASE_URL, AUTH_JWT_SECRET; manter banco de desenvolvimento separado, como informado pelo responsável. Confirmar segredos distintos e cookie Secure em HTTPS. |
| Asaas | ASAAS_API_KEY, ASAAS_ENV=sandbox no desenvolvimento, ASAAS_WEBHOOK_TOKEN. Configurar webhook HTTPS do desenvolvimento em /api/asaas/webhook com header asaas-access-token correspondente. Ausência do segredo bloqueia o processamento com 503. |
| Mercado Pago, quando usado | MERCADO_PAGO_ACCESS_TOKEN de teste, MERCADO_PAGO_WEBHOOK_SECRET e NEXT_PUBLIC_SITE_URL com URL HTTPS estável de desenvolvimento. Retornos vão para /loja/pedido/[id]; notificações para /api/mercado-pago/webhook. A assinatura requer os headers e o data.id previstos pelo contrato. |
| Frete | MELHOR_ENVIO_TOKEN; confirmar ambiente e contrato logístico, origem/embalagem fixas herdadas. Não foi inventado cadastro de dimensões. |
| Uploads | CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET. Confirmar isolamento de ativos/preset no desenvolvimento. |
| Deploy/SEO/PWA | Confirmar projeto Vercel de desenvolvimento, domínio de callbacks e isolamento. SEO continua usando domínio/identidade configurados da BittUp; homologação não deve ficar indexável. Confirmar atualização do único worker em /serwist/sw.js. Nenhuma configuração Vercel foi alterada. |

Após autorização de envio ao remote develop, homologar com dados sintéticos: checkout completo, frete, cartão/PIX de teste, associação do pagamento e pedido, retorno HTTPS, assinatura/reenvio de webhook, consulta e-mail + CPF após perder o cookie, login/admin/uploads e tentativas de acesso a outro pedido. Confirmar que nada alcança produção.

Riscos mantidos da matriz: falta de ledger persistente de tentativas/eventos e conciliação para timeout ambíguo/múltiplas cobranças; concorrência PostgreSQL real não exercitada; limitador de abuso por processo; cartão de titular diferente bloqueado por falta de dados específicos no formulário. Preservado também o comportamento preexistente de paginação/filtros administrativos incompletos. Pagamentos e PWA em dispositivo **não estão homologados** pelos testes simulados.

Nenhum outro projeto foi alterado. Aguardar autorização para envio ao remote **develop**; produção permanece fora desta etapa.
