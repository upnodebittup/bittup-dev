# BittUp: Mercado Pago exclusivo

Em 20/10/2026, por solicitação do lojista, o Asaas foi retirado da aplicação BittUp. Esta decisão substitui a exigência anterior de convivência entre provedores, exclusivamente neste projeto.

- Removidos menu e cadastro Asaas, APIs de clientes/subcontas, cobranças, QR Code, validação, webhook, reconciliação e formulário de cartão do Asaas.
- Novos pedidos usam exclusivamente Mercado Pago Orders, exigindo conta conectada e confirmada. PIX, cartão, OAuth, webhooks e comissões continuam pelo Mercado Pago.
- Pedidos históricos mantêm provedor, valores, status e referências. Não são convertidos em novas cobranças. A página de pagamento de uma integração descontinuada orienta a contatar a loja.
- Tabelas e campos históricos do Asaas e migrações já aplicadas são preservados, sem código ativo que os utilize. Nenhuma conta ou credencial externa foi alterada.
- A migração `20261020000100_mercado_pago_only` altera somente defaults e o provedor ativo, sem excluir dados.
- Testes exclusivos do Asaas foram retirados; a suíte de segurança compartilhada e as suítes Mercado Pago/PostgreSQL/Playwright permanecem. `npm run test:e2e` usa o ambiente isolado Mercado Pago.
- Administração ganhou um botão de retorno consistente: detalhes/edição voltam à listagem da seção; listagens voltam ao painel. Links diretos também possuem destino válido.

O template e os demais clientes não fazem parte desta alteração. Documentos anteriores descrevem o histórico da integração.

Verificações: TypeScript e lint dos fontes alterados aprovados; 41 testes de segurança, 9 testes PostgreSQL e 2 cenários Playwright aprovados. Playwright exercitou retornos administrativos, checkout digital/físico, OAuth, PIX/cartão, webhooks duplicados e comissão com provedor simulado. Não foram feitas cobranças reais. Migração aplicada ao banco previamente autorizado, com contagem de pedidos, pagamentos e eventos históricos preservada.
