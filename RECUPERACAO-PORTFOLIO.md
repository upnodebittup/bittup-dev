# Recuperação do portfólio BittUp

Fonte: develop/main, commit 35d63b8d743cc60155d68818ca8847f28383c35e. Base local preservada: 0745ba4. Branch de trabalho: develop.

## Recuperado

O cadastro agora contém **18 projetos**, preservando os nove anteriores e adicionando:

- Psicóloga Acolhedor e Contemporâneo: modelo-psicologa-1 e modelo-psicologa-2.
- Psicólogo Sóbrio e Urbano: modelo-psicologo-1 e modelo-psicologo-2.
- Clínica Neuro Especializada e Prisma: modelo-clinica-neuro-1 e modelo-clinica-neuro-2.
- Pet Shop Playful, Premium e Bold: modelo-petshop-1, modelo-petshop-2 e modelo-petshop-3.

48 arquivos recuperados: nove registros src/client/projects/modelo-*.ts, 27 imagens public/assets/portfolio/modelo-*.png, nove demonstrações em public/modelos/{petshop,psicologos}/ e três arquivos atualizados: src/client/projects/{index.ts,types.ts,ProjectFilter.tsx}. Categoria e filtro Modelos restaurados. Apenas espaços finais sem significado foram removidos do índice.

Não foi necessário substituir componentes, páginas, homepage ou configurações: sitemap, metadados, breadcrumbs e preparação offline já derivam seus registros do índice compartilhado. Os 18 projetos passaram a integrar esses fluxos automaticamente.

## Preservação UpNode

Nenhuma mudança em src/app, src/core, src/middleware.ts, src/client/home, src/client/config ou nos componentes de identidade. Guards, autorização, checkout, pagamentos, consulta e-mail + CPF, módulos, SEO e Serwist permanecem como em 0745ba4. Os nove arquivos de projetos originais e as imagens anteriores não foram alterados. Nenhum banco, migration, credencial, .env, matriz ou outro cliente foi modificado. Sem merge, rebase, reset, pull, push ou deploy.

## Validação

- **42 testes automatizados aprovados**, incluindo os 39 anteriores e três verificações de recuperação: quantidade/uniqueness, preservação dos registros anteriores, categoria/filtro, existência dos HTMLs/imagens, metadados/canonical/breadcrumbs/404 e rotas de preparação offline para os 18 projetos.
- TypeScript aprovado, sem emissão/incremental.
- ESLint: **0 erros e 9 avisos de img preexistentes**, sem novas ocorrências.
- Build de produção Next 16.2.4/Turbopack e Serwist aprovado em cópia isolada sem .env, usando banco sintético inacessível e sem prisma generate ou migrations. Foram geradas as 18 páginas individuais.
- **85 verificações HTTP locais aprovadas**: listagem/filtro, 18 páginas individuais, canonical/Twitter/JSON-LD BreadcrumbList, nove demonstrações HTML, 53 URLs únicas de imagens, 404 real, sitemap com os 18 projetos, preparação offline e worker. A imagem já conhecida como ausente foi explicitamente verificada como 404; esse resultado é pendência, não imagem recuperada.
- O sitemap foi conferido sem banco real: fontes dinâmicas indisponíveis foram isoladas e os registros estáticos do portfólio permaneceram disponíveis.

## Pendências e limites

1. **resgatando-anas-03.png:** ausente na árvore local, em 35d63b8 e no histórico disponível de todas as referências para esse caminho. Apenas -01 e -02 foram encontrados; não há prova de que sejam a versão mobile correspondente. A referência no registro foi mantida, conforme orientação, e precisa da imagem original correta ou de decisão editorial posterior.
2. Preparação offline inclui as 18 páginas de estudo de caso. As demonstrações HTML em /modelos/ continuam disponíveis online e não foram adicionadas ao cache do PWA. As restrições financeiras/privadas do Serwist não foram ampliadas. Instalação e preparação em tablet/navegador real, imagens lazy e comportamento sem internet ainda precisam de homologação; executar novamente a preparação após atualizar o aplicativo.
3. Avisos do build: middleware depreciado, Browserslist antigo e lockfile duplicado da cópia temporária, já conhecidos. A imagem modelo-petshop-3-01.png tem aproximadamente 2,11 MB e ultrapassa o limite de precache, assim como algumas imagens anteriores. Os limites de cache não foram ampliados automaticamente.
4. Links internos para as nove demonstrações e todas as páginas foram testados localmente. A disponibilidade dos sites externos dos projetos originais não foi revalidada nesta recuperação. Não foram efetuadas cobranças nem homologação de provedores.

A referência develop/develop possui três commits ausentes da branch local desde o fetch da auditoria. Esta recuperação não os integra; o futuro envio precisa reconciliar a divergência com autorização, sem push forçado.

A recuperação está restrita ao portfólio. Aguardar autorização para qualquer envio remoto ou implantação.
