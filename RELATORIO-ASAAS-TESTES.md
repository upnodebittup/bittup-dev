# Estabilização Asaas e testes de checkout — 17/10/2026

## Escopo e estado inicial

Diretório: `D:\Dev Sistemas\upnode-clientes\bittup`. Branch: `develop`.
HEAD inicial: `cd722df`. Preservados e excluídos da missão: `.validation-webhook/` e `tests/.validation-webhook.test.mjs`, que já existiam não rastreados.
Nenhuma alteração em projeto irmão/template, configuração externa, produção, push, merge ou deploy.

## Diagnóstico com evidência

- REST: **v3**, URLs `https://api-sandbox.asaas.com/v3` e `https://api.asaas.com/v3`, seleção explícita por `ASAAS_ENV`. Não há evidência de migração REST necessária.
- Webhook: `apiVersion` é configuração independente do objeto `/webhooks`; não é definido pelo endpoint receptor. **Versão externa não verificada**. Conferir `apiVersion: 3` no webhook Sandbox correto. Nenhuma chamada autenticada ao painel/API foi feita nesta missão.
- Histórico `71d0879`: webhook reconhecia `PAYMENT_CONFIRMED`, mas ignorava `PAYMENT_RECEIVED`, necessário para PIX; confiava no corpo e registrava dados pessoais. Isso comprova uma falha histórica, não que esse commit esteja publicado ou seja o último estado funcional em ambiente real.
- Histórico `0745ba4` até HEAD: já havia consulta autenticada do pagamento e validação de referência, cliente e valor; `1a0bd54` acrescentou diagnóstico de erros e User-Agent. Não há execução online registrada que permita rotular um commit como último funcional.
- Defeitos confirmados no HEAD inicial: sem inbox persistente/ID de evento, chamada síncrona ao Asaas com timeout padrão de 65s antes de persistir, exceções indiscriminadamente convertidas em HTTP 400 na criação de cobrança. O 400 local, por isso, não comprova rejeição de payload pelo Asaas.
- Autenticação do webhook usa `asaas-access-token`, comparado sem normalização com `ASAAS_WEBHOOK_TOKEN`. Token do webhook é independente da chave REST. Diagnósticos temporários de tamanho/presença do segredo foram removidos.
- CPF inválido, dados incompletos, cartão recusado, cliente de outra conta, configuração/chave inválida e ambiente incorreto são hipóteses distintas para falhas de cobrança. Não há resposta real/status/códigos do provedor nesta missão que confirme qual ocorreu em homologação. Consultar logs estruturados e entrega do mesmo horário no painel. Auditoria anterior em `AUDITORIA-ASAAS.md` registra problemas de carregamento local de ambiente; não foi revalidada nem alterada a configuração local nesta missão.
- Playwright reproduziu erro adicional: dois cliques adicionavam três unidades porque o atualizador do carrinho mutava o item anterior; corrigido com cópia imutável. A gravação inicial de carrinho vazio também podia apagar o conteúdo antes da hidratação; agora aguarda leitura do armazenamento.
- Build detectou export extra `serwistGET` na rota PWA já existente em HEAD. Corrigido apenas o contrato de exports e valores estáticos equivalentes do Serwist para permitir a verificação Next, sem alterar cache.

## Implementação e garantias

`AsaasWebhookEvent`: inbox mínima com ID opaco único, tipo, ID de pagamento, recebimento, processamento e resultado. Não guarda JSON bruto, cartão, CPF, e-mail ou token. Migração SQL criada; **não aplicada a banco externo**.

O receptor autentica, valida envelope, persiste via upsert antes da consulta remota, consulta estado atual (timeout 4s), valida referência + cliente + valor e aplica compare-and-set. Registra processamento somente depois da atualização. Duplicata concluída retorna 200 sem consultar provedor. Se houver interrupção após atualizar pedido, repetir é seguro. Concorrência que perder compare-and-set retorna 503 para repetição; não há efeitos de estoque/e-mail nesse processamento.

Proteção existente impede pendente/vencido/recusado/cancelado de substituir liquidação e impede aprovação de substituir estorno/disputa. Acrescentado bloqueio de estorno concluído para estorno pendente/disputa. O estado atual consultado no provedor reduz efeitos de eventos fora de ordem. Casos de reversão legítima de estorno/disputa continuam exigindo revisão; não se introduziu uma ordenação temporal inventada.

Respostas: 200 processado/duplicado/sem pedido correspondente/status não suportado, 400 envelope inválido, 401 token inválido, 409 reuso de ID com pagamento/tipo divergente, 503 configuração/banco/provedor indisponível. Evento fica pendente quando processamento falha. Eventos de conta compartilhada sem referência BittUp são registrados como `unrelated`. Monitorar resultados `unsupported` antes de habilitar eventos adicionais.

Sem promises em segundo plano após resposta. Limite Vercel do webhook: 15s; normalmente uma consulta de até 4s mais operações no banco. Banco lento pode exceder o orçamento: não há garantia de resposta em 10s se PostgreSQL indisponível; monitorar latência e pool. Falha de persistência nunca confirma sucesso. Cartão mantém timeout de 65s recomendado pelo provedor, com função de 90s; cliente usa transação existente de 90s e função de 120s. **Conferir suporte desses limites no plano/runtime Vercel**.

Criação de cobrança mantém PIX/cartão e payload existente. Validação do formulário continua 400; rejeição tipada do provedor é 422, configuração 503, timeout 504, outras falhas do provedor 502, falha interna 500. Logs contêm categorias/status/códigos permitidos, sem resposta bruta.

## Recuperação complementar

`scripts/reconcile-asaas.ts` usa somente GET no Asaas e atualiza o banco local informado explicitamente. Não carrega `.env`. Exige `ASAAS_ENV=sandbox` e `BITTUP_TEST_DATABASE_CONFIRMED=yes` no processo.

- `npm run asaas:reconcile -- pending`: tenta até 20 eventos pendentes por execução.
- `npm run asaas:reconcile -- order <orderId>`: busca cobrança por referência + cliente, exige exatamente uma e reconsulta o estado atual; divergência ou múltiplas cobranças exige revisão manual.

Informar `DATABASE_URL` do banco isolado e `ASAAS_API_KEY` da conta Sandbox no processo. Não executado contra banco/conta real nesta missão. Não foi criado cron ou endpoint público. Operador deve acompanhar fila pendente e executar recuperação após reparar falhas. Histórico de cobranças ambíguas após timeout não deve gerar novos POSTs cegamente; a criação atual ainda não fornece garantia exatamente uma cobrança em concorrência/timeout.

## Testes e comandos

No diretório BittUp:

```powershell
npm run test:install
npm run typecheck
npm run lint
npm run test:unit
npm run test:e2e
npm run test:report
npm run build:isolated
```

`test:unit`: testes unitários e integração de handlers com dependências simuladas, sem rede/PostgreSQL.
`test:e2e`: Playwright/Chromium com Next real em `.asaas-validation/`, banco e API Asaas substituídos **somente nessa cópia**, frete assinado fictício. Testa loja, produto, dois cliques, preços/quantidade, preenchimento, criação de pedido e cliente, PIX, webhook repetido, status no armazenamento simulado e interface. Não comprova PostgreSQL ou entrega Asaas.
`build:isolated`: compila código real em `.asaas-build/` sem arquivos `.env`, com URL PostgreSQL fictícia inacessível. Não executa migrações, seed ou consultas a banco externo.

Playwright gera `playwright-report/index.html`, screenshot e trace em falhas em `test-results/`. Esses artefatos locais são ignorados no Git. Browsers/cache de instalação ficam dentro da BittUp.

### Sandbox separado

`npm run test:e2e:sandbox`: exige opt-in `BITTUP_SANDBOX_TESTS=yes`, `ASAAS_ENV=sandbox`, `BITTUP_TEST_DATABASE_CONFIRMED=yes`, `DATABASE_URL` do mesmo banco de testes da aplicação, `ASAAS_API_KEY` Sandbox, `BITTUP_SANDBOX_BASE_URL` (localhost ou https://bittup-dev.vercel.app), `BITTUP_TEST_PRODUCT_SLUG` começando com `sandbox-`, produto exclusivo de testes com estoque e sem variações e `BITTUP_SANDBOX_TEST_CPF` fictício aceito no Sandbox. Informar também `BITTUP_SANDBOX_ADMIN_COOKIE` com a sessão administrativa de desenvolvimento para a consulta de validação já existente; o teste verifica ambiente Sandbox do servidor antes de criar pedido/cobrança. A sessão é enviada por fetch nativo, fora dos traces, e não é gravada em arquivo. Exige aplicação em execução com frete funcional e webhook externo acessível; não inicia nem altera a Vercel.

Cria pedido pela interface, verifica cobrança diretamente na API Sandbox, confirma somente essa nova cobrança via endpoint exclusivo Sandbox `/sandbox/payment/{id}/confirm`, espera banco aprovado e registro de webhook processado e verifica interface. Nenhum POST sintético é enviado ao receptor nessa suíte. A confirmação financeira é uma simulação do Sandbox; comprovação de entrega HTTP real deve ser correlacionada no log de entregas do painel. Não executar recuperação manual em paralelo, pois isso confundiria a origem da atualização.

Os registros de teste e estoque consumido são mantidos para evidência, sem limpeza destrutiva automática. Nunca usar banco/conta de produção.

## Checklist externo pendente

1. Confirmar banco e credenciais exclusivos de desenvolvimento; conferir precedência `.env.local` e `ASAAS_ENV=sandbox` no runtime efetivo. Não enviar segredos em logs. Não copiar chaves de outros projetos.
2. Aplicar a migração da inbox **somente no banco de desenvolvimento confirmado**, antes de publicar o receptor. Usar processo de migração aprovado; esta missão não executou migração externa.
3. No Asaas Sandbox: URL exata `https://bittup-dev.vercel.app/api/asaas/webhook`, sem redirect; `apiVersion: 3`, enabled true, interrupted false e token idêntico ao runtime, com requisitos de comprimento do Asaas. Conferir envio sequencial e assinaturas `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_REFUNDED`, `PAYMENT_REFUND_IN_PROGRESS`, `PAYMENT_CHARGEBACK_REQUESTED`, `PAYMENT_CHARGEBACK_DISPUTE`, `PAYMENT_AWAITING_CHARGEBACK_REVERSAL`. O código consulta status atual, não deduz aprovação do nome do evento.
4. Conferir logs de entrega: status exato, corpo de erro sanitizado, timeout, autenticação, URL, escopo de ambiente e horário. Verificar Vercel Deployment Protection/WAF, módulos loja/checkout habilitados e runtime/plano. Falhas de token, limite de execução e payload são causas distintas.
5. Reativar fila penalizada somente após correção publicada e validada com autorização. Reentrega deve receber **HTTP 200**, que é a confirmação aceita pelo Asaas. Não houve reativação nem publicação nesta missão.
6. Executar suíte Sandbox e conferir também logs reais do painel. Investigar status `unsupported`, eventos pendentes e cobranças incompatíveis. Reembolsos parciais, remoção de cobrança e reversões não foram modelados como novos estados; não habilitar fluxos adicionais sem regras próprias.

## Migração futura ao template

Após homologação real na BittUp: transportar somente biblioteca, inbox/migração e testes com configurações parametrizadas; garantir aplicação de migração antes da rota, configurar segredos próprios por projeto e executar suites mocks + Sandbox. Não copiar banco, IDs, credenciais, dados pessoais ou configuração comercial da BittUp. Nenhum arquivo do `upnode-template` foi acessado ou modificado.

## Referências oficiais consultadas

- https://docs.asaas.com/reference/create-new-payment-with-credit-card — v3, campos, cartão recusado 400, timeout mínimo 60s.
- https://docs.asaas.com/reference/create-new-webhook — `apiVersion` independente, token e eventos.
- https://docs.asaas.com/docs/payment-events — eventos, PIX recebido e exemplo de ID opaco com `&`.
- https://docs.asaas.com/docs/webhooks-faq — HTTP 200, duplicatas, repetição e penalização.
- https://docs.asaas.com/docs/webhooks-1 — persistência, autenticação e processamento.
- https://docs.asaas.com/reference/list-payments — filtro por referência e reconciliação complementar.
- https://docs.asaas.com/reference/confirmar-pagamento — confirmação exclusiva Sandbox.

## Resultado das verificações desta missão

- TypeScript (`npm run typecheck`): aprovado, sem erros.
- ESLint (`npm run lint`): aprovado, 0 erros e 9 avisos de imagens preexistentes.
- Unitários/integração de handlers (`npm run test:unit`): **56 aprovados, 0 reprovados**. Rede e banco simulados; não equivalem a integração PostgreSQL.
- Playwright mocks (`npm run test:e2e`): **1 aprovado**, fluxo completo em Chromium. As primeiras execuções detectaram os dois problemas de carrinho corrigidos; também houve ajustes do endereço local e tempo de espera da configuração de teste. Última execução sem falha de asserção. Next dev emitiu avisos de imagens/React/Fast Refresh e uma falha transitória de geração durante compilação, da qual se recuperou; não equivalem a confirmação de estabilidade da hospedagem real.
- Sandbox (`npm run test:e2e:sandbox`): **1 pulado**, sem opt-in/configurações confirmadas. Nenhuma chamada a cobrança real. PostgreSQL real, concorrência real, migração e entrega efetiva do Asaas permanecem não homologados.
- Prisma Generate: aprovado; cliente gerado inclui inbox. Migração SQL não executada em banco externo.
- Build (`npm run build:isolated`): **aprovado**, Next 16.2.4/webpack, código real, credenciais fictícias e sem `.env`. Avisos de middleware, Node APIs no Edge, dependência dinâmica Browserslist e precache Serwist permanecem. O build padrão Turbopack na pasta original não foi executado para evitar carregar configuração externa; isso é uma diferença explícita de validação.
- Comando de recuperação sem confirmação de ambiente: bloqueou corretamente com saída 1, antes de consultar banco/provedor. Não confundir essa recusa esperada com falha da integração.
- Commit local deve conter exclusivamente os arquivos listados abaixo; itens preexistentes permanecem não rastreados. Não houve push, merge ou deploy.

## Arquivos alterados

- `.gitignore`
- `RELATORIO-ASAAS-TESTES.md`
- `package-lock.json`
- `package.json`
- `playwright.config.ts`
- `playwright.sandbox.config.ts`
- `prisma/migrations/20261017000100_asaas_webhook_inbox/migration.sql`
- `prisma/schema.prisma`
- `scripts/build-isolated.mjs`
- `scripts/e2e-mock-server.mjs`
- `scripts/playwright.mjs`
- `scripts/reconcile-asaas.ts`
- `src/app/api/asaas/create-customer/route.ts`
- `src/app/api/asaas/create-payment/route.ts`
- `src/app/api/asaas/webhook/route.ts`
- `src/app/serwist/[path]/route.ts`
- `src/core/context/CartContext.tsx`
- `src/core/lib/asaas-reconciliation.ts`
- `src/core/lib/payment-security.ts`
- `src/generated/browser.ts`
- `src/generated/client.ts`
- `src/generated/commonInputTypes.ts`
- `src/generated/internal/class.ts`
- `src/generated/internal/prismaNamespace.ts`
- `src/generated/internal/prismaNamespaceBrowser.ts`
- `src/generated/models.ts`
- `src/generated/models/AsaasWebhookEvent.ts`
- `tests/e2e/checkout.mock.spec.ts`
- `tests/e2e/checkout.sandbox.spec.ts`
- `tests/fixtures/asaas.ts`
- `tests/fixtures/prisma.ts`
- `tests/security.test.mjs`
- `tsconfig.json`
