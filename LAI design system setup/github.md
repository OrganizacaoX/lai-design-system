repo: OrganizacaoX/lai-design-system
branch: main
path: src/

## Last sync
date: 2026-09-04T15:15:19Z

### Updated in this project
- Sync verificado: `main` continua na mesma árvore `a66696391100` do import. Nenhuma mudança upstream, nenhuma tela reconstruída.

## Sync history
### 2026-09-04T15:10:00Z
- Sync verificado: nenhuma mudança na `main` desde o import (árvore `a66696391100`, mesmos blobs em `src/index.css`, `src/index.ts` e `components.json`).
### 2026-09-04T14:54:35Z
- Ficha do Chart escrita a partir de `src/components/ui/chart.tsx` (tooltip, legenda, injeção de `--color-<chave>` por tema).
- Novas seções: padrões de composição, voz e escrita, ícones canônicos do lucide e regra de light/dark por produto.
- Demos interativas de dialog, drawer, toast e command dentro da documentação.
- Google Sans Flex e Google Sans Code carregando de verdade; snippet de `@import` para o `src/index.css` em `snippets/index-css-fonts.css`.

### 2026-09-04T14:40:00Z
- Documentação visual do tema LAI (cores oklch light/dark, tipografia, raios, espaçamento, estados) recriada a partir de `src/index.css`.
- Fichas de componentes com variantes, tamanhos, valores exatos e regras de uso, lidas de `src/components/ui/*`.
- Telas de exemplo do Disk (discador em operação) e do MeetCore (sala com copiloto) montadas só com os componentes do registry.

## Screen map
| Tela / seção | Arquivos de origem |
| --- | --- |
| Fundamentos (cores, tipografia, raios, estados) | src/index.css, components.json, README.md |
| Ações (button, button-group, toggle, toggle-group, badge, kbd) | src/components/ui/button.tsx, button-group.tsx, toggle.tsx, toggle-group.tsx, badge.tsx, kbd.tsx |
| Entrada (input, textarea, label, field, input-group, input-otp, select, native-select, combobox, checkbox, radio-group, switch, slider, questionnaire, calendar, date-range-picker) | src/components/ui/input.tsx, textarea.tsx, label.tsx, field.tsx, input-group.tsx, input-otp.tsx, select.tsx, native-select.tsx, combobox.tsx, checkbox.tsx, radio-group.tsx, switch.tsx, slider.tsx, questionnaire.tsx, calendar.tsx, src/components/date-range-picker.tsx |
| Layout e navegação (card, item, table, tabs, accordion, collapsible, sidebar, breadcrumb, pagination, navigation-menu, menubar, avatar, progress, skeleton, spinner, empty, marker, aspect-ratio, scroll-area, resizable, carousel, separator) | src/components/ui/card.tsx, item.tsx, table.tsx, tabs.tsx, accordion.tsx, collapsible.tsx, sidebar.tsx, breadcrumb.tsx, pagination.tsx, navigation-menu.tsx, menubar.tsx, avatar.tsx, progress.tsx, skeleton.tsx, spinner.tsx, empty.tsx, marker.tsx, aspect-ratio.tsx, scroll-area.tsx, resizable.tsx, carousel.tsx, separator.tsx |
| Sobreposições e feedback (dialog, alert-dialog, sheet, drawer, popover, hover-card, tooltip, dropdown-menu, context-menu, command, alert, toast, sonner) | src/components/ui/dialog.tsx, alert-dialog.tsx, sheet.tsx, drawer.tsx, popover.tsx, hover-card.tsx, tooltip.tsx, dropdown-menu.tsx, context-menu.tsx, command.tsx, alert.tsx, toast.tsx, sonner.tsx |
| Conversa e IA (message, bubble, attachment, message-scroller, chart) | src/components/ui/message.tsx, bubble.tsx, attachment.tsx, message-scroller.tsx, chart.tsx |
| Padrões, voz, ícones e regra de tema | composição das fichas acima; components.json (iconLibrary lucide); site/App.tsx (persistência `lai-theme`); disk.lai.ia.br e meetcore.lai.ia.br |
| Utilitários (direction, use-mobile) | src/components/ui/direction.tsx, src/hooks/use-mobile.ts |
| Telas de exemplo Disk e MeetCore | composição dos arquivos acima; contexto de produto de disk.lai.ia.br e meetcore.lai.ia.br |
