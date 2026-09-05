# Evolução do LAI após 0.2.1

Critérios de entrega solicitados:
- [x] Tabela: ação por teclado, foco visível e isolamento das ações internas.
- [x] Estados: Button com loading e feedback reutilizável de carregamento, erro, vazio, sucesso e indisponibilidade.
- [x] Playground: variante, tamanho, densidade, tema, estado e código sincronizados.
- [x] Telas completas: listagem/filtros/paginação, edição, detalhes e confirmação de exclusão.
- [x] Personalização: marca, raios, densidade e fonte com prévia e exportação CSS.
- [x] Hierarquia de ações, estados vazios/erro e regras de movimento documentadas.
- [x] Textos acessíveis personalizáveis nas composições.
- [x] Testes: teclado, foco, estados, configurações e fluxos completos; pacote e registry sincronizados.

A publicação não faz parte desta etapa sem nova solicitação de release.

## Evidências de entrega

- `src/components/data-table.tsx`: coluna de ação nativa, isolamento de controles internos, rótulos e recuperação de erro. Verificado em `tests/compositions/compositions.spec.ts` (teclado, contagem de chamadas e seleção).
- `src/components/ui/button.tsx` e `status-panel.tsx`: loading desabilita o botão e sinaliza aria-busy; testes garantem uma única submissão e recuperação. O catálogo demonstra e exercita os cinco estados de feedback.
- `site/components/component-playground.tsx`: Button/Input/Select com configuração e exemplo completo sincronizados; `tests/browser/evolution.spec.ts` verifica código, estado, densidade, tema e descrição acessível de erro.
- `site/components/workflow-demo.tsx`: fluxo local de busca, paginação, detalhes, edição, cancelamento e exclusão; testes exercitam teclado, validação, persistência local do estado, retorno de foco e recuperação de busca vazia.
- `site/components/theme-customizer.tsx`: prévia de marca, raio, fonte e densidade; teste baixa o arquivo CSS e compara os tokens. Conferência adicional no navegador confirmou raio de 16px, fonte system-ui, altura compacta e ausência de overflow no mobile.
- `site/pages/foundations-page.tsx`, README e usage-guidance: orientações de hierarquia, feedback, movimento e adoção.
- `FilterBar.ariaLabel`, labels da tabela, `DialogContent/SheetContent.closeLabel` e labels internos de Combobox expõem textos antes fixos.
- `bun run check` e `bun run build`: aprovados.
- Suíte completa de navegador: 120 testes aprovados; após os últimos ajustes, os 14 testes de evolução foram reexecutados e aprovados.
- Composições: 12 testes aprovados em desktop/mobile.
- Consumidores: pacote React 19 e 20 itens transitivos/tema do registry em React 18 aprovados.
- 73 arquivos publicados no registry comparados com os fontes: idênticos.
- Imagens existentes permaneceram aprovadas sem atualização dos snapshots; editor visual e fluxo mobile inspecionados separadamente.
- Servidores de teste próprios, com portas estritas; diretórios de artefatos separados.

Este registro descreve a validação local anterior ao commit. A publicação de uma nova versão do pacote é uma etapa separada.
