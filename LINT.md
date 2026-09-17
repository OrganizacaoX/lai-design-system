# Política de lint

Execute `npm run lint`. O Oxlint trata a categoria `correctness` como erro;
avisos também fazem o comando falhar. Diretivas de desativação sem efeito são
erros, para que exceções antigas não permaneçam silenciosamente.

As seis regras do `@shadcn/lint` estão ativas como erro:

- `no-restyle`: consumidores usam variantes/tamanhos em vez de redesenhar componentes.
- `no-raw-colors`: cores vêm do tema.
- `no-arbitrary-values`: tamanhos e valores fixos usam a escala ou tokens.
- `no-inline-styles`: estilos usam classes; valores medidos usam variáveis CSS.
- `no-unknown-classes`: as classes precisam gerar CSS no Tailwind do projeto.
- `require-static-classes`: classes de consumidores precisam ser analisáveis.

## Implementação do próprio design system

`src/components/**` define os componentes LAI e suas composições: nesse diretório
continua permitida a definição de aparência (`no-restyle` desligado). Essa exceção
já existia; páginas, exemplos e demais consumidores não a recebem.

A exceção a `require-static-classes` foi reduzida de todo `src/components/**`
para `src/components/ui/**`. Os primitives encaminham `className` e variantes;
as composições agora também precisam de classes analisáveis.

Somente nos primitives, `no-arbitrary-values` aceita fórmulas de geometria
(`calc`, `min`, `max`, `clamp`), grades, listas de propriedades de transição,
transformações e declarações de variáveis CSS. Esses recursos implementam
posicionamento, swipe e empilhamento do Base UI e não têm equivalentes estáticos
na escala. Valores fixos comuns como `p-[13px]` continuam sendo erros nesses
mesmos arquivos. Cores e classes inexistentes continuam verificadas.

Há duas exceções locais documentadas a `no-inline-styles`:

- `ChartStyle`: as séries e suas cores por tema são definidas em runtime e
  geram variáveis CSS isoladas pelo ID de cada gráfico.
- `ThemeCustomizer`: o editor injeta os tokens escolhidos pelo usuário apenas
  na área de prévia.

## Auditoria e correções

A auditoria inicial das seis regras encontrou 227 ocorrências de valores
arbitrários e 35 de estilos inline. Havia casos em `Drawer`, `Toast`, `Sidebar`,
`NavigationMenu`, `Calendar`, `Button`, `Input`, `Select`, `DataTable`,
`VirtualList`, `SortableList`, entre outros. As fórmulas estruturais acima foram
preservadas; os valores fixos foram substituídos por equivalentes na escala ou
tokens semânticos em `src/index.css`, mantendo as medidas e cores.

Os estilos dinâmicos de virtualização, drag-and-drop e colunas de tabela usam
variáveis CSS. A CI executa `bun test ./tests/lint-policy.test.ts`, que prova que
as seis regras rejeitam exemplos inválidos, inclusive dentro dos primitives,
e continuam aceitando tokens, variantes e variáveis CSS.

A política é voltada ao design system. Não significa habilitar todas as regras
estilísticas, de React Compiler ou de acessibilidade disponíveis no Oxlint.
