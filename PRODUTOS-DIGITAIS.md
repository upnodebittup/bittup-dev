# Produtos digitais na BittUp

Em Administração → Produtos → editar/criar, selecione a categoria **Produto digital (sem frete)**. Ela pode coexistir com as categorias comerciais do produto. O identificador reservado é `produto-digital`; não renomear esse slug sem adaptar a regra.

- Produtos existentes não são reclassificados automaticamente.
- Pedido exclusivamente digital: frete zero no servidor e dispensa de endereço de entrega.
- Carrinho misto: somente quantidades dos itens físicos entram na cotação.
- O servidor consulta categorias no banco; flags/preços de frete enviados pelo comprador não substituem essa classificação.
- No cartão Asaas, CEP e número de cobrança são solicitados na etapa do cartão se não houver endereço. São dados do titular, sem cobrança de frete. PIX/Mercado Pago mantêm seus fluxos.
- Estoque e variações mantêm as regras existentes. Esta mudança não inclui entrega automática de arquivos, licenças ou downloads.

A migração `20261019000100_digital_product_category` somente insere a categoria se o slug ainda não existir. Sem alteração de schema ou reclassificação de produtos/pedidos. Aplicar no banco autorizado com `prisma migrate deploy`.

Validação: testes unitários de segurança/regressão, PostgreSQL isolado para digital/misto/frete adulterado/estoque e Playwright do checkout digital. Rede financeira de testes simulada; nenhum pagamento real necessário para esta mudança.
