# Prontidão para publicação — BittUp e Artesanaio

Verificação local: 12/11/2026. Não houve migration externa, publicação, push, merge, configuração Vercel/Mercado Pago ou habilitação de pagamentos.

## Git e composição da entrega

| Projeto | Branch local | Upstream atualmente configurado | Estado |
|---|---|---|---|
| BittUp | develop | develop/develop, repositório upnodebittup/bittup-dev | Implementação não commitada |
| Artesanaio | desenvolvimento | develop/develop, repositório artesanaiosite/artesanaio-develop | Implementação não commitada |

Os remotos origin apontam para outros repositórios: bittup-upnode e artesanaio. Confirmar o caminho de promoção autorizado antes de push/merge. Não presumir que o upstream DEV publique o domínio que recebe pagamentos. Nenhum remoto foi modificado.

Todos os arquivos necessários existem localmente. Há nove arquivos da entrega BittUp e seis da Artesanaio ainda não rastreados (antes deste relatório). Não publicar somente o diff dos arquivos rastreados.

Arquivos comuns aos dois projetos:
- prisma/schema.prisma
- scripts/test-mp-postgres.mjs
- src/core/lib/mp/webhooks.ts
- src/core/lib/mp/relay-auth.ts
- src/core/lib/mp/relay-receiver.ts
- src/app/api/mercado-pago/relay/route.ts
- tests/mp-relay.test.ts

Adicionais BittUp:
- src/core/lib/mp/relay-hub.ts
- src/app/api/mercado-pago/webhook/route.ts
- scripts/register-mp-relay.ts
- prisma/migrations/20261112000100_mp_webhook_distribution/migration.sql
- docs/WEBHOOK-DISTRIBUTION.md, WEBHOOK-DISTRIBUTION-TESTS.md e este relatório

Adicionais Artesanaio:
- prisma/migrations/20261112000100_mp_webhook_receiver/migration.sql
- WEBHOOK-RECEIVER.md

Não incluir automaticamente as alterações preexistentes de SEO/conteúdo da Artesanaio, diretórios de validação, relatórios antigos ou arquivos gerados da BittUp que já estavam modificados. Prisma Client foi gerado somente em cópias de validação. Os scripts build dos projetos já executam prisma generate.

## Verificações executadas

| Projeto | Testes | TypeScript | Build de produção |
|---|---|---|---|
| BittUp | 13 relay + 9 regressão financeira + 41 segurança = 63 aprovados | Aprovado | Aprovado, Next --webpack |
| Artesanaio | 8 relay + 10 regressão financeira + 3 isolamento/PWA = 21 aprovados | Aprovado | Aprovado, Next --webpack |

Total: 84 testes. Cópias isoladas do commit atual mais exclusivamente os arquivos de implementação listados acima; alterações SEO preexistentes ficaram fora. Bancos PostgreSQL temporários apenas em 127.0.0.1, sem arquivos .env, chamadas financeiras reais ou acesso a bancos externos. Builds usaram schema completo em banco local vazio, com flags de hub, receptor e pagamentos desligadas. As migrations foram aplicadas somente nesses bancos temporários. Segredos de teste sintéticos. As 11 unidades de código/migration da BittUp e oito da Artesanaio coincidem com as cópias testadas.

O teste novo exerce a rota real de webhook BittUp com MP_RELAY_HUB_ENABLED ausente e false: confirma Order e comissão pelo processamento anterior sem criar evento central. Na primeira execução desse teste, o import de next/navigation não era compatível com o runtime react-server do executor; o adaptador de teste foi ajustado para rejeitar qualquer uso de redirect e a repetição passou. Não houve correção funcional para fazê-lo passar.

Avisos não impeditivos nos builds: convenção middleware, dependências Browserslist/Serwist e jose/Edge, imagens grandes fora do precache; inferência de workspace decorre das cópias de validação. Não comprovam funcionamento externo nem autorizam ativar flags.

## Backups e riscos antes de tocar nos bancos

Confirmar backup recuperável do banco efetivamente usado pelo webhook BittUp, mesmo que o deployment se chame DEV: pedidos, tentativas, contas/tokens criptografados, inbox, comissões, demonstrativos e histórico Prisma. Confirmar data, origem, identificação do arquivo/snapshot e procedimento de restauração. Preservar o acesso seguro à chave de criptografia existente, sem imprimi-la ou versioná-la.

Confirmar também backup do banco Artesanaio, que agora possui autorização OAuth mesmo sem catálogo/vendas. Não assumir que o antigo estado vazio dispense backup.

As duas migrations novas só criam tabelas/índices e relações entre as novas tabelas. Não alteram tabelas financeiras existentes, tokens ou dados comerciais. Ainda assim, deploy Prisma aplica TODAS as pendentes: consultar status no banco confirmado e interromper se houver outra pendência, falha ou checksum divergente. Especialmente não aplicar por engano a migration histórica BittUp 20261020000100_mercado_pago_only: ela altera defaults e atualiza PaymentSettings.provider.

Antes de publicação, verificar no painel Vercel os comandos de build/install: não presumir que não executam migrations automaticamente. A configuração local package.json contém prisma generate, não migrate deploy. Conferir também os valores efetivos das flags no ambiente alvo; não foram consultados nesta rodada.

## Ordem de implantação proposta — executar separadamente

1. Confirmar primeiro o backup recuperável do banco que atende o webhook BittUp. Depois confirmar o backup Artesanaio. Identificar os deployments/commits de retorno e os ambientes corretos, sem revelar variáveis.
2. Preparar commits revisados com todos os arquivos listados e sem alterações alheias/segredos. Promover pelo fluxo Git autorizado; não executar merge automático. Esta missão não fez commit ou push.
3. BittUp: confirmar que somente 20261112000100_mp_webhook_distribution está pendente e aplicá-la em etapa autorizada. Preservar MP_PAYMENTS_ENABLED atual da BittUp, MP_WEBHOOK_SECRET, URL Mercado Pago, tokens e chaves. Manter MP_RELAY_HUB_ENABLED=false e MP_RELAY_RECEIVER_ENABLED=false.
4. Publicar primeiro a BittUp com as flags novas desligadas. Verificar login, painel, webhook antigo e recuperação/inbox dos pedidos existentes. Não gerar compra automaticamente para essa verificação.
5. Artesanaio: confirmar somente 20261112000100_mp_webhook_receiver pendente, aplicá-la em etapa autorizada e publicar com MP_RELAY_RECEIVER_ENABLED=false, MP_PAYMENTS_ENABLED=false e MP_WEBHOOK_CONFIGURED=false. Preservar OAuth já conectado.
6. Parar neste marco: código publicado nas duas aplicações, nenhuma distribuição ou venda Artesanaio habilitada.
7. Futuramente, em etapas autorizadas: configurar os segredos exclusivos de transporte, IDs e allowlist; habilitar somente o receptor Artesanaio; provisionar registro local BittUp e remoto Artesanaio; verificar autenticação e disponibilidade; então ativar o hub. Só liberar vendas em missão posterior, após comprovação de entrega/recuperação e isolamento.

O cron da BittUp é diário. Backoff não garante reenvio em minutos: depende da próxima execução. Comprovar execução autenticada do job e acompanhar a fila antes de ativar distribuição.

## Reversão sem perda

Na etapa atual, flags desligadas e nenhuma venda remota: voltar ao deployment anterior, mantendo as tabelas aditivas. Não desfazer migrations e não restaurar snapshot como rollback de código.

Depois da ativação: manter a recepção/fila central funcionando e o cadastro remoto habilitado se a Artesanaio estiver indisponível. A fila preserva entregas até recuperação; pode-se reverter o receptor mantendo o hub ativo. Não desligar o hub inteiro nem excluir/desabilitar destinos como rollback normal de lojas que já possuem pedidos. Pausar vendas não elimina eventos posteriores de pagamentos existentes. Um rollback total para código anterior ao hub não tem garantia de distribuição remota e exige planejamento específico, não deve ser tratado como seguro por uma simples flag.

Procedimento detalhado e variáveis: WEBHOOK-DISTRIBUTION.md.
