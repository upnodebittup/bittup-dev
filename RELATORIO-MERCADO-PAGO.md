# Resultado da integração Mercado Pago na BittUp — 18/10/2026

Implementação e validação locais concluídas. Migrações aplicadas no banco escolhido pelo usuário. Publicação/homologação externa pendentes de acesso ao projeto Vercel e configuração OAuth da BittUp. Durante a execução, o usuário orientou usar o banco indicado em .env.prod, mantendo o destino bittup-dev.vercel.app; essa orientação substitui a exigência inicial de banco exclusivamente dev. Não declarar homologação financeira da BittUp antes da etapa publicada.

## Auditoria e estratégia

Análise anterior às alterações em AUDITORIA-MERCADO-PAGO.md. Reuso dos algoritmos Orders/OAuth/ledger do Lab, com adaptação a Prisma 7, ao pedido comercial, autenticação administrativa e concessão de acesso do comprador da BittUp. Configuração por instalação, seleção de provedor para novos pedidos e associação histórica de cada tentativa à conta recebedora. Asaas permanece padrão e mantém rotas, contas, clientes e webhooks.

O histórico do Lab documenta PIX real aprovado por webhook; cobertura de cartão/estorno por simulação/PG não equivale à validação financeira integral. Nenhuma credencial ou banco do Lab foi copiado.

## Entrega

- Configurações → Pagamentos: OAuth PKCE, conexão/reconexão/desconexão, nome/ID e confirmação do recebedor, seleção Asaas/Mercado Pago, demonstrativos e lançamentos.
- Checkout PIX e cartão transparente por Orders, com tokenização oficial e crédito em uma parcela. Layout/resumo/carrinho/cadastro/frete/estoque mantidos. Valor calculado pelo servidor inclui frete; o comprador não seleciona nem troca o provedor do pedido.
- Inbox autenticada por HMAC, consulta financeira autenticada, validação de conta/referência/total, persistência anterior à rede, idempotência entre instâncias, tratamento de respostas perdidas e rejeições definitivas, recuperação diária e atualização da tela sem confirmação manual.
- Comissão contábil MP única de 100 centavos, ajuste único por reversão, reembolsos por delta, demonstrativos imutáveis e créditos posteriores. Cobrança semanal sem chamada financeira; não há split nem application_fee.
- Rotas Checkout Pro novas encerradas (410); webhook legado preservado, impedido de alterar pedidos Orders. Sem alteração de credenciais Asaas ou cobrança retroativa de comissões Asaas.

## Arquivos

Persistência: prisma/schema.prisma, prisma/migrations/20261018000100_mercado_pago_orders/migration.sql e cliente Prisma correspondente em src/generated.

Servidor: src/core/lib/mp/{security,accounting,client,oauth,orders,ledger,webhooks}.ts; src/app/api/mercado-pago/[...path]/route.ts; adaptação pontual dos webhooks/preference, orders e guards Asaas/payment-security; adapter Prisma com encerramento do pool e suporte explícito a schema.

Interface: página admin/configuracoes/pagamentos, PaymentSettings.tsx, MercadoPagoPayment.tsx, link no layout administrativo, ramo Mercado Pago na página de pagamento e prop opcional no seletor existente. Correção de contraste restrita à nova interface, sem redefinir o tema global.

Operação: vercel.json (cron diário), .env.mercadopago.example (somente placeholders), package.json/lock, .gitignore e MERCADO-PAGO-BITTUP.md. Testes: security.test.mjs, fixtures, mp-db.test.ts, mp-e2e/checkout.spec.ts, playwright.mp.config.ts e scripts locais de PostgreSQL/cópia isolada. Espera explícita pela persistência do carrinho no teste Asaas existente, sem alterar o CartContext comercial.

## Verificações

| Verificação | Resultado / natureza |
|---|---|
| Unitários/segurança/regressões | 61 aprovados; rede financeira simulada |
| PostgreSQL | 7 aprovados em servidor PostgreSQL real local descartável; APIs MP interceptadas |
| Playwright Asaas | 1 fluxo completo aprovado; banco/provedor em fixtures |
| Playwright Mercado Pago | 1 fluxo completo aprovado; PostgreSQL local real, OAuth/SDK/rede MP simulados |
| TypeScript | Aprovado |
| ESLint | Sem erros; avisos de img, incluindo QR do MP, sem envio do QR a otimizador externo |
| Build isolado | Aprovado, 67 páginas, sem .env ou banco externo; avisos preexistentes Serwist/Browserslist/middleware |
| Migração preservando dados | Pedido Asaas aprovado, customerId, totais/frete e estoque preservados em schema transacional descartável |
| Vercel dev | Somente GET público existente respondeu 200; esta integração não foi enviada/publicada |
| Pagamento/webhook oficial BittUp | Não executado; pendente |

PG verifica state vinculado à sessão/consumido, criptografia, concorrência no checkout, webhook duplicado, aprovação, total com frete, divergências de conta/valor/referência, resposta perdida após criação remota, token de cartão, crédito único, estorno parcial/total, evento antigo, fechamento/crédito posterior, conta histórica e recuperação da inbox. Playwright verifica login administrativo, OAuth, confirmação, escolha do provedor, carrinho, PIX/cartão, estoque, autenticação do comprador, remoção do QR após aprovação, desconexão e tela móvel. Capturas locais ignoradas em .mp-validation/painel-pagamentos.png e painel-pagamentos-mobile.png.

## Migração e Git/publicação

Migração aditiva testada primeiro nos bancos locais descartáveis, com bind 127.0.0.1 e senhas aleatórias. Após a orientação expressa "usa o prod mesmo", aplicada ao banco de .env.prod em 18/10/2026 às 14:02 UTC: 20261017000100_asaas_webhook_inbox e 20261018000100_mercado_pago_orders. Histórico e checksum da migração inicial conferidos antes. Comparação de contagem e fingerprints antes/depois confirmou preservação integral do pedido existente e dos 10 produtos, sem mudanças de estoque. Sem db push/reset, seeds comerciais ou operações financeiras. Evidência operacional sem credenciais em .mp-validation/authorized-prod-migration-result.json, ignorada pelo Git.

Branch local develop; upstream remoto develop → upnodebittup/bittup-dev.git, branch develop. origin → upnodebittup/bittup-upnode.git. Após fetch havia três commits locais anteriores à missão ainda não enviados, todos relacionados a Asaas. Arquivos preexistentes .validation-webhook/ e tests/.validation-webhook.test.mjs permanecem fora do commit. Temporários, credenciais e evidências não são versionados.

Vercel CLI autenticado só disponibilizou geisabitts-projects; project inspect bittup-dev e inspect bittup-dev.vercel.app não localizaram projeto nesse contexto. O usuário forneceu o time upnodebittup-4135s-projects. Esse time retorna scope inexistente para o token CLI e 404 por falta de acesso na sessão geisabitt do navegador. Usuário indicou outra janela Chrome; a enumeração do controle só disponibilizou o perfil Geisa com a conta do Lab. Aguardando disponibilizar o perfil correto. Sem evidência do vínculo Git/domínio/branch, o push foi suspenso conforme instrução expressa da missão. Não vincular este diretório ao projeto do Lab.

.env.dev e .env.prod têm URLs de conexão distintas, mas ambas apontam o site produtivo. O usuário autorizou usar .env.prod e explicou que cada instalação está em uma versão diferente. Leitura inicial confirmou nesse banco somente a migração inicial; as migrações posteriores foram adicionadas sem modificar dados existentes. Não atualizar outros clientes por comparação de versão. Ainda falta acessar o projeto correto e conferir suas variáveis; não transportar configurações Asaas do prod por inferência dessa autorização do banco.

## Pendências externas e próximos passos

1. Identificar e disponibilizar acesso ao time/projeto Vercel de bittup-dev.vercel.app; confirmar repositório upnodebittup/bittup-dev e branch develop. Usar o banco de .env.prod conforme orientação posterior do usuário, sem mudar o destino de publicação.
2. Configurar variáveis privadas e URLs OAuth/webhook da BittUp, conforme MERCADO-PAGO-BITTUP.md. Não trocar configurações do Lab nem Asaas.
3. Migração no banco escolhido concluída. Enviar o commit ao upstream correto após confirmar o vínculo e acompanhar a publicação de desenvolvimento. Sem publicar o site produtivo ou outros clientes.
4. Conectar a conta autorizada na BittUp publicada e repetir PIX/cartão com comprador distinto; comprovar evento oficial recebido, status automático, total/frete, comissão única e créditos de estorno. Separar simulação de evidência financeira real. Sem cobrança semanal automática.
5. Somente depois dessa homologação, abrir a missão do template. Reutilizar os contratos e migrações, adaptando identificador por instalação; nunca distribuir credenciais/dados de teste.

Template UpNode, demais projetos de clientes e arquivos do Lab permaneceram intocados. Não houve pagamento nem estorno real pelo agente.

Dependências: comparação npm audit entre o lockfile anterior e o atual retornou as mesmas 30 ocorrências (1 baixa, 8 moderadas, 20 altas e 1 crítica). Nenhum aumento no total identificado nesta missão; triagem/correção do passivo deve preceder a liberação produtiva. Não executar audit fix --force dentro desta integração sem analisar as mudanças de versão.

## Continuação da publicação

Acesso pelo navegador ao time upnodebittup-4135s-projects liberado pelo usuário. Confirmados projeto bittup-dev, repositório upnodebittup/bittup-dev e domínio bittup-dev.vercel.app. O ambiente que atende esse domínio usava main; develop era somente preview. Após autorização expressa do usuário, alterado **somente bittup-dev** para rastrear develop, com persistência verificada após recarregar. Nenhum merge/push em main ou alteração da configuração do projeto bittup-upnode.

Consulta pública do catálogo confirmou que o site ainda lia .env.dev (IDs/preços/estoques coincidentes), diferente do banco de .env.prod escolhido pelo usuário e já migrado. Preparado arquivo privado ignorado .env.mp-deployment com conexão/aliases do banco escolhido, URL bittup-dev, flags MP inicialmente desativadas e segredos exclusivos de criptografia/cron. Nenhuma variável Asaas incluída. A extensão bloqueou seleção automática do arquivo; importação manual solicitada no formulário do projeto correto antes de salvar e fazer push. Credenciais OAuth e entrega de webhook oficial continuam pendentes.

Importação manual concluída pelo usuário. Conferência na Vercel confirmou DATABASE_URL idêntica à conexão autorizada de .env.prod (comparação sem divulgar segredo), MP_BASE_URL=https://bittup-dev.vercel.app, MP_ENVIRONMENT=test e flags MP_PAYMENTS_ENABLED/MP_WEBHOOK_CONFIGURED=false. A interface também apresentou variáveis Cloudinary e AUTH_JWT_SECRET recém-importadas pelo usuário; o agente não alterou essas configurações. Credenciais OAuth oficiais continuam pendentes. Fetch confirmou zero commits remotos ausentes antes do push exclusivo para develop/develop.
