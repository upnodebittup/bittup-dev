# Auditoria Mercado Pago → BittUp — 18/10/2026

Análise concluída antes das alterações de implementação. Escopo: BittUp; Lab somente leitura. Template e clientes excluídos. Estado inicial: develop, HEAD 2a5b2be, três commits à frente de develop/develop, sem divergência após fetch. Arquivos preexistentes não relacionados: .validation-webhook/ e tests/.validation-webhook.test.mjs; não integrar ao commit.

## Evidência da origem

Lab: Next 16.4, Prisma 6, PostgreSQL, autenticação própria por loja, Orders, OAuth PKCE, AES-GCM, reconciliação autenticada, inbox, ledger único e fechamento semanal. HOMOLOGACAO.md documenta PIX real de R$1 com webhook e comissão única. Cartão, estorno, concorrência e fechamento têm testes simulados/PG; aprovação financeira real de cartão e estorno não está documentada. Não equiparar essas evidências à homologação integral de todos os cenários.

## Destino e preservação

BittUp: Next 16.2, React 19, Prisma 7 com adapter-pg e cliente gerado em src/generated. Uma instalação equivale a um lojista; AdminUser é administrador, Client é cadastro de cliente/conta Asaas, não tenant. Pedidos não possuem storeId. Manter esse desenho; configuração singleton interna BittUp e vínculos históricos de contas MP em tabelas próprias.

Carrinho em CartContext/localStorage; CheckoutForm coleta comprador/endereço e cotação assinada. POST orders valida produtos/preços/variações no servidor, soma quantidades e decrementa estoque atomicamente. Order.total contém subtotal; frete é separado. Nenhum modelo de cupom/desconto foi encontrado: não introduzir regras fictícias. Cadastro Asaas cria customerId associado ao pedido. Pagamento atual PIX/cartão Asaas em página própria; consulta de pedidos por concessão assinada ou identidade e-mail+CPF. Administração JWT/jose com verificação do usuário no banco e proteção de origem; reutilizar. PWA já exclui /api, /admin e pedidos do cache.

Asaas: rotas customer/payment/QR, asaasFetch, payment-security, inbox AsaasWebhookEvent, script de recuperação sandbox. Preservar credenciais, rotas, contas e semântica. Rotas MP existentes usam preferência/Checkout Pro e payment webhook; não são Orders nem OAuth e não devem iniciar pagamentos no novo fluxo. Encerrar criação de novas preferências; manter processamento legado validado, impedindo que altere pedidos Orders.

## Reuso e adaptações

- Reusar algoritmos puros de centavos, estados, semana São Paulo, totais, criptografia, HMAC, payload Orders e princípio de ledger idempotente.
- Adaptar persistência para Prisma 7, Order existente, autenticação administrativa, acesso comprador e valor subtotal+frete.
- Seleção administrativa de provedor para novos pedidos; pedidos existentes continuam Asaas, e o provedor fica fixado no pedido. Evita cobrança em dois provedores. Não criar framework genérico de pagamentos.
- Cada pagamento Orders referencia pedido e conta histórica, com chave persistida antes da rede. Webhook consulta essa conta, não a seleção atual. Reconexão não reescreve pedidos antigos. Desconexão remove autorização local; eventos antigos aguardam reconexão da respectiva conta.
- Comissão MP de 100 centavos por pedido liquidado, crédito único por reversão, delta de reembolso e demonstrativo semanal. Sem cobrança semanal de rede nesta missão; sem backfill financeiro Asaas.
- Laboratório exclusivo: produto fixo R$1/50, contas/seeds fictícios, mock financeiro em runtime, login do Lab, configuração Vercel do Lab, faturamento de cobrança de teste. Não transportar.

## Riscos e publicação

Prisma 6→7 impede cópia literal. Valores não podem omitir frete. Novas tabelas/colunas aditivas, sem renomear/remover dados. Proteger tokens, state consumível vinculado à sessão, refresh serializado e logs sem dados financeiros privados. Eventos fora de ordem não podem desfazer liquidação/estorno. Não aumentar estoque em estorno: política comercial existente não o faz. Evitar troca de provedor de pedido já criado.

Arquivos .env.dev/.env.prod não confirmam isolamento e apontam o site produtivo; nenhum banco pode ser migrado por inferência. Vercel autenticado só apresenta geisabitts-projects; bittup-dev não encontrado nesse time. Não fazer push enquanto vínculo da branch/repositório ao projeto correto não for confirmado. Upstream develop é remoto develop (bittup-dev.git), diferente de origin (bittup-upnode.git).

## Ordem

1. Persistência aditiva e rotinas puras; 2. OAuth/painel com seleção; 3. Orders e checkout preservado; 4. webhook/recuperação/ledger/demonstrativos; 5. testes unitários, PostgreSQL descartável e Playwright incluindo regressões Asaas; 6. revisão/commit; 7. somente após confirmação de Vercel e banco dev, migração, push e homologação publicada. Testes financeiros reais exigem conta conectada e ação final do comprador; não os simular como aprovação real.
