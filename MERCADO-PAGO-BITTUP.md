# Integração Orders na BittUp

## Operação

Administração → Pagamentos (/admin/configuracoes/pagamentos): conectar por OAuth oficial com PKCE, conferir ID/nome e confirmar conta recebedora. Escolher Mercado Pago para novos pedidos somente depois da configuração completa. Asaas continua padrão. Pedidos existentes mantêm o provedor; não existe troca pelo comprador nem fallback silencioso entre provedores.

Mercado Pago usa a página de pagamento existente, o seletor PIX/cartão e o resumo comercial. Cartão pelo Card Payment Brick oficial em uma parcela, com onReady em remontagens. Somente token e campos permitidos chegam ao servidor; PAN/CVV não passam pelas rotas MP. O servidor ignora preços do navegador, usa subtotal+frete do pedido e não recebe valores arbitrários no pagamento. Criação de pedido/estoque/carrinho/cadastro/frete permanecem nas rotas comerciais existentes. Não havia cupom no modelo atual.

## Contas e histórico

Uma instalação BittUp representa um lojista. MercadoPagoAccount guarda identidades históricas; MercadoPagoPayment referencia a conta e o pedido. OAuth não muda essas referências. Conectar outra conta afeta novas tentativas, nunca uma cobrança em andamento. Desconectar apaga tokens locais e pausa cobranças dessa autorização; não revoga permissões externas no Mercado Pago nem apaga pedidos. Para recuperar eventos ou autorizações de pedidos antigos, reconectar a conta original. É possível conectar novamente a conta atual pelo painel.

State tem dez minutos, é consumido atomicamente e vinculado ao cookie administrativo existente por hash. Tokens/verificadores e corpos de solicitações incertas usam AES-256-GCM com chave exclusiva da BittUp. O corpo temporário serve para repetir exatamente a mesma intenção após timeout e é apagado ao vincular a order ou receber rejeição definitiva. Nenhum token é devolvido pelo painel/API de pedidos. Não reutilizar chave criptográfica, banco ou cookies do Lab.

## Eventos, recuperação e comissão

Webhook Order em /api/mercado-pago/webhook valida HMAC oficial e data.id; inbox durável registra apenas identidade/recurso/evento, sem payload privado. Consulta autenticada confere conta, referência da tentativa, valor, moeda/país e crédito. Duplicatas/concor­rência não repetem a comissão. Estados atrasados não desfazem aprovação/reversão. Webhooks legados payment continuam disponíveis para histórico, mas não podem alterar pedidos Orders. A rota preference retorna 410 e não cria Checkout Pro.

GET /api/mercado-pago/jobs requer Authorization: Bearer CRON_SECRET. Vercel Cron diário às 06:00 UTC, compatível com frequência Hobby, recupera inbox e consulta pagamentos, incluindo tentativas com resposta perdida e histórico para reversões. Recuperação é paginada e limitada em tempo; o webhook é o caminho imediato. Falhas persistem para a próxima execução. A UI consulta o banco a cada 2,5 segundos; aprovação oculta QR/copia-e-cola automaticamente. Não depende do administrador para confirmar o pagamento.

Comissão contábil MP: 100 centavos por pedido efetivamente creditado, com chave única por pedido. Qualquer estorno parcial/total ou contestação credita a comissão inteira uma única vez, conforme política do Lab; valores reembolsados registram somente deltas. Cancelamento/recusa/pendência sem pagamento não geram comissão. Não há backfill nem alteração financeira de pedidos Asaas nesta missão. Estoque não é reposto automaticamente por estorno, preservando a política comercial atual.

Fechamento semanal segunda 00h São Paulo: demonstrativo imutável, vendas/estornos/comissões/ajustes e saldo devido, com créditos tardios para o próximo fechamento e saldo negativo transportado. Status billing_disabled é obrigatório: não existe chamada para gerar cobrança semanal nesta integração. O demonstrativo aparece no painel. Não há split nem application_fee.

## Configuração de desenvolvimento e publicação

.env.mercadopago.example contém somente nomes/valores vazios. MP_ENVIRONMENT=test exige vendedor test_user brasileiro na lista MP_TEST_SELLER_IDS. Orders usa o token OAuth compatível (test_token=false); TEST- é recusado, conforme diagnóstico do Lab. MP_ENVIRONMENT=live aceita somente conta brasileira real. MP_PAYMENTS_ENABLED e MP_WEBHOOK_CONFIGURED precisam de true explícito para novos pagamentos. Não habilitar live por inferência de testes simulados.

Cadastrar na aplicação MP destinada à BittUp:

- Redirect URI exata: https://bittup-dev.vercel.app/api/mercado-pago/oauth/callback; PKCE e permissões necessárias de leitura/escrita/offline.
- Webhook Order: https://bittup-dev.vercel.app/api/mercado-pago/webhook; segredo correspondente no ambiente da BittUp.
- Public Key e Client ID/Secret pertencentes à aplicação configurada; gerar MP_TOKEN_ENCRYPTION_KEY de 32 bytes aleatórios em base64 e CRON_SECRET exclusivos. Guardar em configuração privada, sem commit.

Antes de publicar: confirmar na Vercel projeto/time, domínio bittup-dev.vercel.app, repositório upnodebittup/bittup-dev e branch develop. O remoto de desenvolvimento chama-se develop; origin aponta para outro repositório. Há três commits anteriores à missão ainda não enviados ao upstream. Não executar git push sem essa confirmação. Os arquivos locais .env.dev/.env.prod não constituem evidência de isolamento do banco.

Migração: prisma/migrations/20261018000100_mercado_pago_orders/migration.sql; somente ADD COLUMN, CREATE TABLE/INDEX e FKs. Em novas instalações, aplicar prisma migrate deploy com DATABASE_URL confirmada antes de servir código que usa a coluna/tabelas. Nunca usar db push/reset ou sincronizar dados entre clientes. Depois, push no upstream develop/develop e acompanhar o deploy correto; testar OAuth, comprador/vendedor distintos, PIX/cartão e entrega real de webhook. Nenhuma operação financeira externa foi feita pelo agente.

Orientação posterior do usuário nesta missão: usar o banco de .env.prod mesmo, pois as instalações estão em versões distintas. Usar somente a conexão escolhida, mantendo o destino de publicação bittup-dev.vercel.app; não alterar o site produtivo nem copiar credenciais Asaas externas. Migrate deploy concluído em 18/10/2026: inbox Asaas anterior e tabelas Orders adicionadas; pedido existente e dez produtos preservados por comparação de fingerprints. Time Vercel confirmado: upnodebittup-4135s-projects. Somente bittup-dev passou a rastrear develop, com autorização expressa. Push e deploy Ready concluídos; credenciais e homologação financeira ainda pendentes.

## Testes reproduzíveis

- npm run test:unit: regressões e segurança com rede financeira simulada.
- npm run test:mp:db: PostgreSQL real descartável somente em 127.0.0.1, sem ler .env; migrations, preservação de pedido Asaas/estoque, OAuth, idempotência, concorrência, respostas perdidas, reversão e fechamento. Binários embedded-postgres são dependência exclusiva de desenvolvimento, sem serviço pago.
- npm run test:mp:e2e: cópia ignorada da BittUp com PG local, login/OAuth, carrinho/quantidades/frete/estoque, PIX/cartão e atualização por webhook. Só a rede MP/SDK é substituída por fixture; não existe modo mock financeiro no runtime publicado.
- npm run test:e2e: regressão Asaas com fixtures existentes. Aguardar persistência do carrinho antes de navegação evita corrida do teste com useEffect.
- npm run typecheck; npm run lint; npm run build:isolated: build sem arquivos .env/banco externo, com cliente Prisma gerado.

As pastas .mp-validation, .asaas-validation, .asaas-build e relatórios são locais ignorados. Inicialização e encerramento do PostgreSQL são limitados à pasta descartável verificada, com bind 127.0.0.1 e senha aleatória. Os testes não confirmam aprovação financeira real nem recebimento de webhook oficial da BittUp. Não transportar credenciais/seeds/test fixtures para configurações de cliente.

## Transporte futuro ao template

Somente após homologação publicada da BittUp: adaptar o identificador do lojista, guardar vínculos históricos, manter nomes/rotas centralizados, documentar upgrade Prisma e migração aditiva; repetir a regressão por instalação. Não copiar a configuração BittUp, contas, banco ou arquivos gerados entre versões incompatíveis. Template e demais clientes não foram modificados nesta missão.
