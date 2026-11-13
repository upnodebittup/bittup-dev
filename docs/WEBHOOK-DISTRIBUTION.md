# Distribuição de notificações Mercado Pago

Estado: implementação local. Nenhuma migration externa, variável Vercel, configuração Mercado Pago ou publicação foi executada.

## Contrato e isolamento

A URL já cadastrada continua `/api/mercado-pago/webhook` na BittUp. Com `MP_RELAY_HUB_ENABLED` ausente/false, o fluxo antigo permanece intacto, inclusive o webhook legado de Payments. O modo hub afeta exclusivamente o tópico `order`.

O hub valida a assinatura original, salva o evento e cria uma entrega por instalação autorizada, atomicamente. Não confirma recebimento antes do commit. O corpo distribuído contém apenas `eventKey` e `resourceId`: nenhum token, vendedor, status, comprador ou dado financeiro. Cada instalação confirma propriedade consultando Orders com seus próprios tokens e procurando o vínculo conta/tentativa/referência no próprio banco. `reconcile` continua verificando valores e atualizando pedidos/comissões.

Para as primeiras instalações, o conjunto de candidatos é o cadastro explícito de destinos, e não o `user_id` do evento. O mesmo vendedor pode operar várias instalações: a referência da tentativa e o vínculo histórico de conta decidem onde processar. Não há cadastro público nem destino fornecido pelo navegador/webhook. Instalações cadastradas recebem o identificador da Order; não cadastre organizações fora do grupo autorizado UpNode.

Sem uma tentativa local, a instalação pode devolver `ignored` somente após verificação conclusiva. Falhas de autorização, contas desconectadas, timeout ou indisponibilidade permanecem pendentes, mesmo que isso gere reenvios conservadores. Uma conta nova ainda não cadastrada na instalação não é descoberta por este sistema. Cadastre e valide OAuth antes de liberar vendas.

Cada entrega remota usa HMAC-SHA256 específico da instalação, cobrindo versão, método, caminho, destinatário, timestamp, nonce e corpo exato. Timestamp aceita desvio de cinco minutos. Nonces são únicos no PostgreSQL e mantidos por dez minutos; pedidos autenticados e a recuperação limpam os expirados. Um reenvio legítimo usa novo nonce e o mesmo eventKey. Inbox e conciliação protegem contra duplicação financeira.

O hub faz tentativas iniciais limitadas; depois o job existente `/api/mercado-pago/jobs` executa a recuperação. Backoff de até uma hora, sem descarte por número máximo de tentativas. Leases de dois minutos são recuperáveis após interrupção do processo; o token de lease impede um worker antigo de finalizar uma tentativa nova. Não há promises de envio soltas após a resposta HTTP.

## Variáveis novas

### BittUp (hub)

- `MP_RELAY_HUB_ENABLED`: ausente/false mantém processamento antigo; habilitar apenas após provisionamento.
- `MP_RELAY_INSTANCE_ID`: identificador estável do hub (por exemplo `bittup-hub`). Independente da criptografia existente.
- `MP_RELAY_ALLOWED_ORIGINS`: origens HTTPS exatas aprovadas, separadas por vírgula. Para Artesanaio produção: `https://www.artesanaio.com.br`.
- `MP_RELAY_KEY_ARTESANAIO`: segredo exclusivo da entrega para Artesanaio, pelo menos 43 caracteres aleatórios. Configurar por canal seguro, nunca em Git/URL/log. Novos destinos recebem novos nomes `MP_RELAY_KEY_<NOME>`.
- `CRON_SECRET`: já usado pelo job existente; confirmar que está configurado e o cron está executando.

### Artesanaio (receptor)

- `MP_RELAY_RECEIVER_ENABLED`: true somente depois da migration local e publicação.
- `MP_RELAY_INSTANCE_ID`: ID cadastrado no hub, por exemplo `artesanaio-prod`. Não altera `MP_INSTANCE_ID` nem chaves de tokens.
- `MP_RELAY_SHARED_SECRET`: exatamente o segredo de entrega exclusivo da Artesanaio no hub. Não é Client Secret, chave de criptografia de tokens ou assinatura Mercado Pago.

`MP_WEBHOOK_SECRET` continua no hub para validar o Mercado Pago. O receptor relay não precisa recebê-lo: ele autentica o hub e verifica a Order por conta própria. O código atual de checkout da Artesanaio ainda exige `MP_WEBHOOK_SECRET` e `MP_WEBHOOK_CONFIGURED=true` para habilitar cobranças; não marque a entrega configurada antes de homologar o fluxo. Não modificar esses flags nem `MP_PAYMENTS_ENABLED=false` durante implantação.

## Implantação progressiva (operador, não executado)

1. Revisar backups, histórico Prisma e pendências em cada banco confirmado. As novas migrations só criam tabelas/índices; não atualizam contas, pedidos, estoque, tokens ou cobranças. Verificar que nenhuma outra migration inesperada será aplicada.
2. Na BittUp aplicar `20261112000100_mp_webhook_distribution`; na Artesanaio aplicar `20261112000100_mp_webhook_receiver`. Rodar `prisma generate` no build. Os clients gerados usados nos testes foram produzidos apenas em cópias isoladas para preservar alterações preexistentes.
3. Publicar BittUp com hub desligado e Artesanaio com receptor desligado. Não trocar URL/assinatura do Mercado Pago. Testar o fluxo histórico BittUp.
4. Configurar os segredos de transporte e origens aprovadas nos servidores. Preservar todas as chaves OAuth/criptografia já utilizadas. Habilitar somente o receptor Artesanaio; pagamentos seguem false. Novas variáveis precisam de deployment para entrar em vigor.
5. Provisionar o registro no banco **da BittUp** usando a ferramenta interna. Nunca executar isso com DATABASE_URL da Artesanaio. Em sessão de operador previamente configurada com o ambiente correto:

```powershell
$env:MP_RELAY_PROVISIONING = 'yes'
node --env-file=.env --conditions=react-server --import tsx scripts/register-mp-relay.ts bittup-hub local - --local
node --env-file=.env --conditions=react-server --import tsx scripts/register-mp-relay.ts artesanaio-prod https://www.artesanaio.com.br/api/mercado-pago/relay MP_RELAY_KEY_ARTESANAIO
Remove-Item Env:MP_RELAY_PROVISIONING
```

O arquivo `.env` deve representar o banco confirmado e as variáveis provisionadas; não copiá-lo entre instalações. Os comandos não recebem segredos em argumentos. O operador cadastra destino e nome da variável segura; o segredo não é persistido nas tabelas. Apenas um registro local é permitido pelo banco. Para desativar um destino, preservar registro e entregas pendentes e alterar `enabled=false` por procedimento de operador revisado, sem excluir dados. Reativar permite retomar as entregas.

6. Confirmar cadastro local único e destino remoto exato, e então publicar `MP_RELAY_HUB_ENABLED=true`. A URL externa permanece a mesma. Eventos antigos já na inbox BittUp continuam recuperáveis pelo fluxo anterior. Retentativas externas de eventos antigos também passam pela conciliação idempotente. Não alterar IDs, referências ou tokens históricos.
7. Confirmar execução real do job e seu Bearer `CRON_SECRET`. O cron atual da BittUp é diário; o backoff só é atendido quando há nova execução, não cria um timer. Para homologar recuperação rapidamente, executar o endpoint de job autenticado em ambiente autorizado. Uma frequência maior é escolha operacional da hospedagem, sem necessidade de serviço novo. A Artesanaio não precisa de cron próprio para receber os reenvios do hub.

Monitorar `MercadoPagoRelayDelivery.status`, `attempts`, `lastError`, `nextAttemptAt`, `leaseUntil`, `deliveredAt` e a inbox local. A falha persiste como `delivery_failed`, sem conteúdo sensível. Não excluir a fila. Um destino que devolve `ignored` conclui a entrega para aquela instalação; `processed` significa conciliação local concluída.

## Critérios antes de liberar uma venda real na Artesanaio

- Deployments corretos, migrations aditivas aplicadas e tokens existentes legíveis.
- BittUp segue conciliando seus pedidos; eventos históricos não regressam.
- Entrega assinada chega à Artesanaio; assinatura inválida, corpo alterado, destinatário errado, expiração e replay são recusados.
- Mesma conta em duas instalações não confirma pedido sem referência local correspondente.
- Notificação de uma Order realmente conhecida pela Artesanaio é consultada por ela na API oficial, registrada em sua inbox e conciliada uma vez. Simulação com ID inexistente não comprova isso.
- Indisponibilidade/remessa interrompida deixa pendência durável; recuperação autenticada drena a fila após restabelecimento.
- Duplicados/atrasados não duplicam comissão nem reabrem estornos.
- Só depois autorizar, em missão separada, flags e provedor para novas vendas. Nenhuma compra real foi feita nesta implementação.

## Testes locais

Nos dois projetos: `node scripts/test-mp-postgres.mjs --relay` (PostgreSQL temporário localhost, segredos sintéticos e API simulada). Sem `--relay`, roda a regressão financeira existente. Não executa contra `.env` de produção. Estes testes não comprovam entrega externa Mercado Pago/Vercel.

Para transportar ao template/novos clientes, reutilizar `relay-auth.ts`, `relay-receiver.ts`, rota `relay`, modelo/migration de nonce e limpeza, preservando guards de módulos. Somente o hub possui cadastro/eventos/entregas centrais. Não é necessário replicar o hub ou os tokens da BittUp nos clientes.

Rollback antes de ativar o hub, nesta etapa sem vendas Artesanaio: retornar ao deployment anterior mantendo as flags desligadas. Manter as tabelas aditivas, sem desfazer migrations nem restaurar o banco.

Rollback depois de ativar o hub: preservar a versão capaz de receber e persistir na fila central. Se o receptor Artesanaio falhar, manter seu cadastro habilitado e o hub ativo; a entrega fica pendente até o receptor voltar. Não excluir nem desabilitar o cadastro remoto para "pausar" o envio: eventos novos precisam continuar ganhando entregas duráveis. Suspender novas vendas não elimina notificações de pedidos existentes, estornos ou eventos atrasados. Portanto, depois de vendas reais remotas, simplesmente desligar o hub ou voltar a uma versão anterior ao distribuidor não é um rollback completo sem risco. Reverter apenas o receptor ou corrigir o hub preservando sua fila é o procedimento conservador. Não restaurar um snapshot antigo de produção como rollback de código: isso poderia apagar pagamentos e rotações de tokens posteriores ao backup.
