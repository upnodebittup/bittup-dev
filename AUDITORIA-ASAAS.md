# Asaas — diagnóstico e homologação

## Evidências

- O checkout valida identificação em `src/core/lib/validators/checkoutSchema.ts`, cria o pedido em `src/app/api/orders/route.ts` e concede acesso assinado. A página `src/app/(site)/loja/pedido/[id]/pagamento/page.tsx` envia o `orderId` para `/api/asaas/create-customer` antes de solicitar a cobrança.
- A API usa os dados persistidos do pedido, não os dados reenviados pelo navegador. Origem, autorização e módulos continuam obrigatórios. A mensagem investigada vem do catch dessa API, com HTTP interno 502; não comprova que o Asaas respondeu 502.
- Consulta limitada a nomes/presença: `ASAAS_API_KEY` declarada em `.env`, `.env.local`, `.env.dev` e `.env.prod`; `ASAAS_ENV` ausente nesses arquivos e no processo da auditoria. Nenhum valor de chave foi exibido. O processo manual do usuário e a Vercel não foram inspecionados.
- Verificação posterior de carregamento em processo novo, usando `@next/env` sem iniciar aplicação/banco: Next development seleciona `.env.local` e `.env`; a chave efetiva fica vazia e o ambiente continua ausente. Há sintaxe de expansão `$` sem escape nas declarações da chave desses dois arquivos. O carregador interpreta essa sintaxe como variável; não foi copiado ou exibido nenhum valor secreto. A simples presença de texto na declaração não comprova que a chave chega ao processo.
- Sem `ASAAS_ENV`, a biblioteca falha antes da chamada ao provedor. Substituir apenas a chave não resolve esse bloqueio. A exigência já existia antes da consolidação. Não há status/código real do Asaas disponível nesta auditoria.

## Compatibilidade e alterações

- `access_token`, `Content-Type`, URLs v3 e campos planos `name`, `email`, `cpfCnpj`, `mobilePhone`, `address`, `addressNumber`, `province`, `postalCode`, `externalReference` correspondem à referência atual. Data de nascimento não é requisito desse endpoint. O checkout aceita CPF com 11 dígitos, mas isso não comprova validade cadastral; o Asaas pode rejeitá-lo. Não há evidência de endpoint obsoleto nesse fluxo.
- Adicionado `User-Agent: BittUp/1.0` e marcador `server-only`. A documentação exige User-Agent para novas contas raiz; não foi comprovado que essa era a rejeição da conta BittUp, e o runtime pode já enviar um valor padrão.
- Erros tipados preservam status e códigos de uma lista permitida. Logs de cadastro, cobrança e validação de chave registram somente operação, etapa, categoria, status e códigos conhecidos. Descrições, respostas brutas, URLs com parâmetros, payloads, IDs, CPF, contatos, cartões e chaves não são registrados. Códigos desconhecidos são omitidos.
- Categorias distinguem configuração, autenticação (401), ambiente (`invalid_environment`), permissão/IP (403), validação (400/422), limite (429), indisponibilidade (5xx), timeout, rede, resposta inválida e falha interna. 403 sozinho não permite distinguir IP de outra permissão; 401 genérico não comprova expiração. Para o comprador permanece a mensagem simples.
- Antes de criar, consulta `/customers?externalReference=<pedido>` sem corpo. Reutiliza somente resultado único com referência, CPF e e-mail correspondentes. Duplicidade, paginação incompleta ou divergência bloqueiam a operação. Mantidos bloqueio de linha e reutilização do ID já persistido. Não há repetição automática do POST após timeout.
- A consulta prévia permite recuperar cadastro deixado por timeout/rollback quando já estiver visível na listagem. Não garante exatamente uma criação diante de resposta ambígua, atraso de consistência ou processos externos. Nesses casos, reconciliar no Sandbox antes de insistir. Não foi introduzida garantia de idempotência não documentada.
- Mantidos `/payments` para PIX/cartão, timeout padrão de 65s para cartão, valores calculados no servidor, titular real do pedido, consulta do QR Code e validação de `asaas-access-token` dos webhooks. A consulta de recuperação tem timeout de 15s, dentro da transação existente de 90s. O limite de execução da hospedagem precisa comportar esse fluxo.

## Ações externas antes de testar

1. Corrigir manualmente o armazenamento da chave nos arquivos locais: caracteres `$` literais precisam de escape `\$` no formato `.env` do Next. Exemplo exclusivamente fictício: `ASAAS_API_KEY=\$CHAVE_FICTICIA`. Confirmar a configuração efetiva prioritária em `.env.local`; atualizar somente `.env` pode não surtir efeito. Essa regra de escape é do arquivo local, não uma instrução para adicionar barras ao valor literal configurado no painel da Vercel.
2. No ambiente de homologação, definir `ASAAS_ENV=sandbox` e confirmar que a chave está ativa, é da mesma conta Sandbox e não está expirada, revogada ou limitada por IP incompatível. Não enviar a chave para diagnóstico.
3. Reiniciar o processo local após atualização. O Next carrega arquivos padrão como `.env.local`; `.env.dev` e `.env.prod` não são selecionados automaticamente pelos scripts atuais. Conferir a precedência e possíveis variáveis herdadas. O diagnóstico desta auditoria não confirma qual chave está na memória do servidor já aberto.
4. Na Vercel, conferir o escopo das variáveis e publicar novamente somente quando autorizado. Nenhuma configuração externa foi alterada nesta etapa.
5. Confirmar banco de desenvolvimento, domínio e webhook de Sandbox separados. `ASAAS_WEBHOOK_TOKEN` deve corresponder ao token do webhook, e não à chave de API. IDs de clientes são específicos da conta/ambiente: não reutilizar banco com IDs de produção no Sandbox.
6. Após confirmar isolamento, testar a leitura administrativa de validação da chave e um cadastro sintético. Em caso de falha, fornecer apenas `operation`, `stage`, `category`, `status` e `codes` do registro `[Asaas]`. Não enviar logs brutos, requisições ou dados pessoais.

## Validação e limites

Testes automatizados sem rede/banco reais cobrem headers, URLs Sandbox/produção, configuração ausente/inválida, sucesso, erros 400/401/403/422/429/503, respostas inválidas, timeout/rede, sanitização, reuso e reconciliação de cliente, acesso negado e continuidade até cobrança PIX simulada. A suíte também preserva testes existentes de cartão, webhooks, consulta e-mail + CPF, módulos, SEO, PWA e 18 projetos.

Resultado: 50 testes aprovados, incluindo regressão sintética de expansão de `$` pelo carregador do Next; TypeScript sem erros; ESLint com 0 erros e 9 avisos preexistentes de imagens; build de produção aprovado em cópia isolada, sem arquivos de ambiente e com conexão fictícia inacessível. Permanecem avisos de middleware, Browserslist e limite de precache do Serwist, sem alteração de política nesta etapa.

HTTP local nesse build: checkout, portfólio, manifesto e worker responderam 200; cadastro sem autorização respondeu 404 com `private, no-store`, antes de consultar banco/provedor.

Não foi feita chamada real ao Asaas: não foi comprovado o isolamento do ambiente. Autenticação da nova chave, cadastro real de teste, checkout no navegador, entrega de webhooks, restrições da conta e concorrência no PostgreSQL permanecem para homologação. Sucesso simulado não equivale à aprovação dessas integrações.

## Documentação oficial consultada

- [Autenticação e headers](https://docs.asaas.com/docs/authentication-2)
- [Next.js: expansão de variáveis e precedência dos arquivos](https://nextjs.org/docs/pages/guides/environment-variables)
- [Chaves e restrições](https://docs.asaas.com/docs/chaves-de-api)
- [Cadastro de clientes e repetição após timeout](https://docs.asaas.com/reference/create-new-customer)
- [Listagem e filtros de clientes](https://docs.asaas.com/reference/list-customers)
- [Sandbox](https://docs.asaas.com/docs/sandbox) e [referência geral](https://docs.asaas.com/reference/comece-por-aqui)
- [Cobranças](https://docs.asaas.com/reference/create-new-payment), [cartão](https://docs.asaas.com/reference/create-new-payment-with-credit-card), [QR Code PIX](https://docs.asaas.com/reference/get-qr-code-for-pix-payments) e [webhooks](https://docs.asaas.com/docs/sobre-os-webhooks)
