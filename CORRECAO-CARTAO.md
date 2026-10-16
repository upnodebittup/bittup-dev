# Digitação do cartão — BittUp

Branch develop; base a88158b. Única alteração funcional: quatro classes de cor em src/core/components/payment/CreditCardForm.tsx. Nenhum handler, validação, estado, endpoint ou integração de pagamento foi alterado.

## Causa identificada

No navegador real, em cópia isolada com pedido sintético, o input aceitou 16 caracteres, recebeu foco e não tinha disabled, readOnly, value controlado, máscara bloqueante ou elemento sobreposto. Não houve erro no console ou de hidratação durante os testes.

O texto e o cursor herdavam rgb(18,50,74), sobre fundo rgb(10,34,48): contraste aproximado **1,23:1**, quase invisível. Número, titular, validade e CVV eram afetados pela mesma herança. A correção define texto claro no formulário e em sua prévia/total, inclusive no hover do controle de CVV; o cursor acompanha a cor do texto. Contraste verificado após correção: **16,35:1**.

O arquivo do formulário antes da consolidação (0745ba4^) e no HEAD inicial tinha o mesmo blob b067f66d14a0a1e057c5ad6ca46d8bf6fc1c6a4c. Portanto, o defeito visual já existia; não foi identificada regressão lógica causada pela consolidação.

**Limitação:** não foi reproduzido um bloqueio funcional que impedisse o input de receber caracteres. Foi reproduzida e corrigida a digitação quase invisível. O perfil/extensões do navegador do usuário não foi inspecionado. Não se afirma que qualquer outra causa de bloqueio esteja resolvida.

## Validação

- Navegador real (ferramenta de navegador, layout e componentes atuais): digitar, editar com Backspace e apagar os cinco campos; foco, ausência de sobreposição e contraste; exibição/ocultação de CVV sintético; alternância PIX/cartão; voltar ao pedido e retornar ao pagamento. Tudo aprovado, sem erros no console.
- Campos de cartão continuam sendo limpos quando desmontados ao trocar método/rota, como antes. Dados do pedido sintético permaneceram disponíveis ao retornar. Não foi persistido cartão/CVV em cookies ou localStorage.
- A submissão vazia manteve os erros obrigatórios de número e titular. Nenhuma cobrança foi enviada. O cadastro inicial de dados pessoais e a criação real de pedido não foram executados end-to-end; o pedido utilizado já era sintético.
- **45 testes automatizados aprovados**, incluindo a suíte de segurança, pedidos, checkout/provedores simulados, módulos, SEO, PWA e os 18 projetos. Acrescentado teste de contraste/estrutura em tests/security.test.mjs.
- Regressão de navegador reutilizável em tests/checkout-browser-regression.mjs, executada com sucesso através de verifyCheckoutCardFields(tab.playwright). Aceita a API de página do navegador/Playwright. Usar somente com pedido sintético em ambiente isolado; não efetua submit, não imprime valores sensíveis nem persiste cartão. Verifica cinco campos, contraste >=4,5:1, edição/exclusão, PIX e retorno ao pedido.
- TypeScript e build Next 16.2.4/Turbopack + Serwist aprovados. Build executado em cópia separada com código real, sem .env, banco real, prisma generate ou migrations.
- ESLint: zero erros, nove avisos de img preexistentes; nenhum aviso novo. Avisos de build conhecidos (middleware, Browserslist, imagens grandes e lockfile da cópia isolada) mantidos.

## Isolamento e preservação

O teste de navegador usou a rota real de pagamento numa cópia temporária, Prisma somente simulado e cookie de pedido sintético; todas as mutações e acessos aos provedores foram bloqueados nessa cópia. Fixtures e endpoints de teste temporários não integram a aplicação ou o commit. A imagem tests/evidence/checkout-contraste.png mostra o resultado com número/CVV vazios e nome de teste; os números visíveis nos campos vazios são placeholders originais.

APIs, Asaas, Mercado Pago, estoque/frete, regras de autorização, consulta e-mail + CPF, módulos, SEO, portfólio, homepage e Serwist permanecem intactos. Nenhum dado comercial, banco, credencial, migration ou outro projeto foi modificado. Sem push, merge ou deploy. Homologação financeira online permanece fora desta correção.
