# Changelog

## 0.4.0 — 2026-09-05

- Base de aplicação: subpaths para TanStack Form/Zod, DnD Kit, TanStack Virtual, Better Auth, Motion, date-fns, Lucide, PostHog, Driver.js, kit Testing Library e TanStack AI com helper shadcn de streaming local.


- Internacionalização integrada em `/i18n`: i18next/react-i18next como dependências diretas, factory por aplicação, provider, recursos LAI pt-BR/en/es, persistência opcional, formatação e locale de calendário. Componentes compartilhados traduzem rótulos quando há provider; props explícitas e os padrões anteriores sem provider são preservados. Os hooks de tradução/locale também acompanham os componentes no registry.
- TanStack Table 9 como dependência direta, com APIs e tipos em `/table`. A API visual de `DataTable` é preservada. `test:app` cobre instalação isolada, tipos de tradução/colunas, idiomas e ordenação/paginação reais no navegador.

- Tipografia: exports renomeados para `Title`, `SubTitle`, `SectionTitle`, `SectionSubTitle`, `Text`, `Quote`, `BulletList`, `NumberedList`, `InlineCode`, `Lead`, `Highlight`, `Caption`, `Description` e `TextLink`. Atualize os imports/JSX com prefixo `Typography`; estilos, propriedades e elementos HTML permanecem iguais. `Label` continua disponível para rótulos de campos.

- `Shimmer` e `@lai/shimmer`: efeito de texto do shadcn com ativação, duração, cor, largura, passagem única e direção configuráveis; CSS incluído no registry e respeito a movimento reduzido.

- `@lai/typography`: 14 componentes semânticos para títulos H1–H4, parágrafos, citação, listas, código inline, links e textos Lead/Large/Small/Muted; exportados pelo pacote, com exemplo completo no catálogo.

- `AppShell`: botão de recolher/fechar movido para dentro da sidebar; removido o cabeçalho interno e a prop `header`. No modo mobile `drawer`, um botão flutuante abre o menu. Renderize cabeçalhos específicos da página em `children`.

- Base de aplicação: Better Fetch, TanStack Query, TanStack Router e Zustand como dependências diretas com versões fixadas; APIs e tipos em `/fetch`, `/query`, `/router` e `/store`. `/app` oferece factories, providers, estados de rota e reset de cache/stores. `/router/vite` fornece geração de rotas com imports LAI. Adição compatível com o entrypoint de UI; consumidores adotam os novos imports conforme migram. Novo `test:app` valida o tarball instalado, tipos, HTTP e fluxos Chromium desktop/mobile.

- `SidebarProfile`: avatar, identificação e dropdown padronizado com ações opcionais de perfil, organização, instalação, tema, idioma e saída; suporte a links, estado de saída pendente e sidebar recolhida/mobile.

- `AppShell` exportado pelo pacote e registry (`@lai/app-shell`): sidebar recolhível, grupos de navegação, slots de marca/usuário/cabeçalho/alertas, integração com links do roteador, atalhos mobile e menu completo. API aditiva; os produtos podem migrar seus layouts sem mover regras de acesso para o design system.

## 0.3.0

- **Atenção ao atualizar:** `DataTableLabels` passou a exigir `actions`, `openRow`, `loading` e `retry`. Quem monta o objeto à mão precisa acrescentar os quatro rótulos.

- Primitivas do `recharts` (`Area`, `Bar`, `BarChart`, `XAxis`, `ResponsiveContainer` e demais) reexportadas pelo pacote. `ChartContainer` só funciona junto delas, e importá-las direto do `recharts` fazia o consumidor carregar uma segunda cópia da biblioteca quando a versão divergia da nossa, dividindo o contexto do React entre duas instâncias. `Label`, `Tooltip` e `Legend` saem como `RechartsLabel`, `RechartsTooltip` e `RechartsLegend`, porque os nomes simples pertencem aos componentes homônimos do LAI.
- Tipos `DateRange` e `Locale` reexportados. `DateRangePickerProps` e `DateRangePreset` são API pública e dependiam deles, o que obrigava o consumidor a instalar `react-day-picker` e `date-fns` só para nomear uma prop.

- Cada componente mostra contagem e resultado real dos testes associados, com data, cenários e detecção de evidências desatualizadas.
- Novo comando `test:reliability` gera o relatório após construir e validar as duas suítes completas; CI preserva os resultados.

- Button com loading/aria-busy e StatusPanel para estados comuns.
- Ações de tabela acessíveis por teclado, eventos internos isolados e recuperação de erro.
- Playground de controles, editor de tema com exportação CSS e fluxo completo de contatos.
- Rótulos acessíveis configuráveis e curva de movimento compartilhada.
- Testes de teclado, estados, exportação de tokens e edição/exclusão.

## 0.2.1

- Google Sans Flex e Google Sans Code carregadas pelo CSS do pacote e pelo tema do registry, sem configuração adicional no HTML.

- Cursor de clique consistente nos controles interativos e nas linhas acionáveis de tabelas.
- Animações discretas em abas, seleção e painéis expansíveis, com suporte a movimento reduzido no pacote e registry.

## 0.2.0

- Documentação em largura total e exemplos de comandos com Bun.

- `DataTable`, `DataPagination` e `BottomSheet` compartilhados no pacote e registry, com textos configuráveis e testes em desktop/mobile.
- `DateRangePicker`: limpeza opcional, fechamento após completar o intervalo e seleção de um único dia; `isMobile()` para consultas de largura em eventos.
- Guia visual React em `/fundamentos`, usando os tokens e componentes do pacote. A rota `/design-system/` encaminha para o novo guia.
- URLs individuais em `/componentes/<nome>`, catálogo com carregamento sob demanda, orientações de uso e API extraída dos fontes.
- Tokens de sucesso, aviso, informação, tipografia, elevação, movimento e densidade; gráficos com paleta categórica.
- `data-density="compact"` para controles de 36px; padrão confortável de 44px. Tamanhos explicitamente escolhidos continuam disponíveis.
- `DateRangePicker`: locale, textos, atalhos, limites, datas futuras, formato e estado desabilitado configuráveis; um mês no mobile.
- Ações do `Questionnaire` com padrões em português e personalização por children.
- Novos `PageHeader`, `FilterBar`, `DataList` e `ValidatedForm` no pacote e registry.
- Correções de acessibilidade do CommandDialog e dos blocos de código.
- CI para tipos, build, artefatos, instalação independente, interação, acessibilidade e regressão visual.

### Compatibilidade

O pacote completo declara React 19, corrigindo a faixa anterior de React 18/19:
`@shadcn/react`, uma dependência já existente, exige React 19. Essa correção é uma mudança de compatibilidade nesta versão. Itens do
registry sem essa dependência são validados separadamente com React 18.

### Migração

Importe a nova versão dos estilos junto com os componentes. Projetos que copiam pelo registry devem atualizar `@lai/theme` junto com os controles; revise alterações locais antes de sobrescrever arquivos.

A paleta de gráficos mudou: confira legendas e qualquer significado atribuído às cores antigas. O seletor mantém bloqueio de datas futuras por padrão; `maxDate` explícito substitui esse limite e `allowFuture` o remove quando não há `maxDate`. Datas de limite são interpretadas como dias no fuso local.

Para outro idioma no seletor, passe `locale`, `placeholder`, `ariaLabel` e `presets` traduzidos. Para o questionário, passe children às ações. Valores existentes do tema continuam em `localStorage["lai-theme"]`.
