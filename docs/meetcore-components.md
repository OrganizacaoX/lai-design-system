# Composições compartilhadas

O pacote e o registry oferecem `DataTable`, `DataPagination` e `BottomSheet`.
Essas composições usam as primitivas LAI e não dependem de rotas, APIs, i18next ou
animações do aplicativo consumidor. A aplicação fornece os textos traduzidos.
`Pagination` continua sendo a primitiva de navegação; sua API não mudou.

```tsx
import {
  DataTable, DataPagination, BottomSheet, DateRangePicker,
  useIsMobile, isMobile,
  type DataTableColumn, type DataTableBulkAction,
} from '@organizacaox/lai-design-system';
import { Trash2 } from 'lucide-react';

const columns: DataTableColumn<{ id: string; name: string }>[] = [
  { key: 'name', label: 'Nome', render: (item) => item.name },
];
const actions: DataTableBulkAction[] = [
  { label: 'Excluir', icon: Trash2, variant: 'destructive', onAction: deleteIds },
];
<DataTable data={rows} columns={columns} bulkActions={actions}
  isLoading={loading} onRowClick={openRecord}
  labels={{
    selectAll: t('table.selectAll'), selectRow: (row) => t('table.selectRow', { row }),
    selected: (count) => t('table.selected', { count }),
    clear: t('table.clear'), empty: t('table.empty'),
  }} />;
<DataPagination page={page} limit={limit} totalPages={totalPages}
  onPageChange={setPage} onLimitChange={setLimit}
  pageSizeOptions={[10, 20, 50]}
  labels={{
    limit: t('table.limit'), pagination: t('table.pagination'),
    previous: t('table.previous'), next: t('table.next'),
    page: (page, total) => t('table.page', { page, total }),
    goTo: (page) => t('table.goTo', { page }),
  }} />;
<BottomSheet isOpen={open} onClose={() => setOpen(false)}
  title={t('table.panel')} closeLabel={t('table.closePanel')}>
  {children}
</BottomSheet>;
<DateRangePicker value={range} onChange={setRange} locale={locale}
  placeholder={t('common.selectPeriod')} presets={[]} allowFuture
  clearable clearLabel={t('common.clearPeriod')} closeOnSelect
  id="period" formatLabel={formatRange} />;
```

## Contratos

- `DataTable` recebe registros com `id` único e estável. Seleção é local ao conjunto
  atual de registros: IDs removidos deixam de participar das ações em lote.
  Durante loading, seleção e ações em lote ficam indisponíveis. Ícones são
  componentes Lucide, não nomes em strings. `emptyState` aceita conteúdo React.
- `DataPagination` recebe página baseada em 1. Zero páginas desativa a navegação
  e mostra 0 de 0. Não altera os dados nem decide se uma troca de limite deve
  reiniciar a página: essa decisão pertence ao callback do consumidor.
- `BottomSheet` preserva os parâmetros `snapPoints`, `initialSnapIndex`, `maxHeight`
  e `minHeight` usados na reunião. Alturas são frações do viewport. O título e o
  botão de fechar têm padrões em português e podem ser traduzidos. Ao reabrir,
  retorna ao snap inicial. O Drawer mantém foco, portal e gestos.
- `DateRangePicker` mantém locale, presets, limites e responsividade existentes.
  `clearable` e `closeOnSelect` são opt-in. A primeira data inicia o intervalo e
  a segunda o completa, inclusive quando são iguais. `formatLabel` permite o
  formato e a indicação de fim pendente definidos pelo produto.
- `useIsMobile()` é reativo e deve ser chamado no topo do componente.
  `isMobile()` consulta a largura no momento de um evento e retorna false no SSR.

## Migração do MeetCore

Após disponibilizar uma versão do pacote contendo essas exportações:

1. Atualizar a dependência e lockfile do front.
2. Trocar imports dos adapters por imports do pacote e passar as traduções acima.
3. Renomear os tipos para `DataTableColumn` / `DataTableBulkAction` e trocar
   strings de ícone por componentes Lucide; usar `DataPagination` nas listagens.
4. Usar `useIsMobile` no render e `isMobile` na ação de abrir gravação.
5. Remover `components/ui` e seus reexports, atualizar fixtures e executar os E2E
   de páginas, custos, seleção, paginação, drawer e mídia local do MeetCore.

Não vincular permanentemente o front a um caminho absoluto ou a um pacote local
com o mesmo número de uma versão já publicada.

## Validação local

```bash
bun run package:check
bun run package:build
bun run registry:build
bunx playwright test --config playwright.compositions.config.ts
bun run test:consumers
```

A suíte de composições usa uma fixture sem backend na porta 4185 e executa em
Chromium desktop e mobile. O teste de consumidores instala o pacote empacotado e
os itens do registry em um diretório temporário.
