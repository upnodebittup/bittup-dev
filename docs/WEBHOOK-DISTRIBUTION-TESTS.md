# Validação local — distribuição Mercado Pago

Data: 12/11/2026.

| Projeto | Verificação | Resultado |
|---|---|---|
| BittUp | `tests/mp-relay.test.ts` | 12 aprovados |
| BittUp | `tests/mp-db.test.ts` | 9 aprovados |
| BittUp | `tests/security.test.mjs` | 41 aprovados |
| Artesanaio | `tests/mp-relay.test.ts` | 8 aprovados |
| Artesanaio | `tests/mp-db.test.ts` | 10 aprovados |
| Ambos | TypeScript do código de aplicação (e script/testes novos da BittUp) | Aprovado |

Total: 80 testes aprovados. Migrações novas aplicadas somente em PostgreSQL temporário localhost. API Mercado Pago e transporte remoto simulados. Suites executadas em cópias isoladas do código para gerar Prisma Client sem sobrescrever arquivos gerados com alterações preexistentes.

Casos: assinatura original inválida, HMAC/corpo/destinatário alterados, expiração, nonce concorrente, campos não permitidos, receiver desativado, duplicação, estorno e evento atrasado, referência de outra loja com mesmo vendedor, tentativa sem providerId persistido, divergência de valor, indisponibilidade e recuperação, destino fora da allowlist, filas duráveis, workers concorrentes, lease expirado e destino desativado. A regressão inclui OAuth, idempotência Orders, cartão/PIX simulados, comissão, inbox histórica e estoque/frete conforme as suites existentes.

Na primeira execução da suite geral de segurança, três testes de conteúdo falharam porque a cópia temporária não incluía `public`. Incluído o diretório como fonte local de leitura, a suite completa passou (41/41). Um erro inicial de configuração da checagem TypeScript foi corrigido somente na cópia de validação: BittUp não possui `tsconfig.validation.json`.

Nenhum teste acessou bancos externos ou credenciais reais. Nenhuma migration de produção, deploy, configuração Vercel/Mercado Pago, compra real, push ou merge foi realizado. Não foi executada homologação externa nem build/Playwright nesta missão de backend. Para homologação publicada, seguir `WEBHOOK-DISTRIBUTION.md`.
