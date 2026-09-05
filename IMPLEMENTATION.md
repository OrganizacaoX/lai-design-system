# Evolução do LAI Design System

Escopo aprovado: aplicar as seis frentes da revisão de 4 de setembro de 2026.
Preservar alterações locais preexistentes nos controles e no registry.

- [x] Guia visual React com tokens e componentes reais; compatibilidade com /design-system/.
- [x] Tokens de status, gráficos, tipografia, elevação, movimento e densidade documentados e usados.
- [x] Página e URL por componente, API, estados, orientação de uso/acessibilidade e instalação nos dois formatos.
- [x] DateRangePicker configurável e responsivo; idioma consistente e substituível no questionário.
- [x] CI de PR com tipos, build, testes de interação/acessibilidade/visual e consumo de pacote/registry.
- [x] Composições reutilizáveis de cabeçalho, filtros, listagem e formulário com exemplos.
- [x] Verificação final de navegador em claro/escuro e mobile, artefatos gerados e documentação de manutenção.

## Evidência inicial

`npm run package:check` e `npx tsc --noEmit` passaram antes das alterações.

## Evidência final

- `npm run check`: passou, cobrindo biblioteca e site.
- `npm run build`: site, tipos do pacote e registry gerados com sucesso.
- `npm run test:e2e`: 102 testes passaram, sem skips (68 páginas do catálogo, 18 verificações de fluxo e 16 comparações visuais).
- `npm run test:consumers`: instalação isolada, árvore de peers válida, TypeScript e bundle passaram para o pacote em React 19 e 12 itens transitivos do registry com seu tema em React 18.
- 70 itens no registry; os 69 arquivos de código gerados foram comparados com os fontes e são iguais.
- 16 PNGs de referência revisados; guia completo inspecionado em desktop e mobile.
- Axe sem violações nas páginas/estados cobertos; isso não representa certificação de acessibilidade de toda composição possível.
- `git diff --check` e `npm ls --depth=0`: passaram.

## Mapa de entrega

| Frente | Implementação |
| --- | --- |
| Guia unificado | `site/pages/foundations-page.tsx`, `public/design-system/index.html` |
| Tokens e densidade | `src/index.css`, controles, `scripts/build-registry.mjs` |
| Documentação individual | `site/pages/components-page.tsx`, `site/catalog.json`, `site/usage-guidance.ts`, `scripts/build-docs.mjs` |
| Componentes adaptáveis | `src/components/date-range-picker.tsx`, `src/components/ui/questionnaire.tsx` |
| Validação | `.github/workflows/validate.yml`, `tests/browser`, `scripts/check-consumers.mjs` |
| Composições | `src/components/page-header.tsx`, `filter-bar.tsx`, `data-list.tsx`, `validated-form.tsx` |
| Manutenção e migração | `README.md`, `CHANGELOG.md` |

## Compatibilidade encontrada durante a verificação

A faixa anterior de React 18/19 do pacote estava incorreta: `@shadcn/react@0.3.1`
exige React e tipos de React >=19. A compilação isolada inicialmente não revelou
o conflito; a inspeção de peers (`npm ls`) revelou. O pacote agora declara React
19. Os itens independentes do registry têm uma validação separada em React 18.
Essa mudança está descrita no changelog e nos guias de instalação.

## Limites da entrega

Alterações locais, sem commit, publicação de pacote ou deploy. O workflow de CI
foi adicionado; as verificações descritas acima foram executadas localmente.
O build emite um aviso da versão interna do TypeScript no API Extractor, mas a
geração dos tipos e os consumidores isolados passaram.
