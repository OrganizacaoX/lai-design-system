# Changelog

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
