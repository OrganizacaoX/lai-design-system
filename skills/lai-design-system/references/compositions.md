# Composições de alto nível

Gerado por `scripts/extract_api.py` a partir de `src/components/`. Não edite à mão: rode o script de novo.

Estes componentes montam telas inteiras e já carregam acessibilidade, i18n e os estados de carregamento, erro e vazio. Antes de compor uma tela a partir das primitivas, verifique se uma destas resolve: refazer à mão custa mais e perde comportamento que não é óbvio que existia.

## AppUpdateCard

- `onUpdate: () => void`
- `title?: string`
- `description?: ReactNode`
- `actionLabel?: string`
- `icon?: ReactNode`
- `className?: string`

## BottomSheet

- `title?: ReactNode`
- `closeLabel?: string`
- `isOpen: boolean`
- `onClose: () => void`
- `children: ReactNode`
- `className?: string`
- `snapPoints?: number[]`
- `initialSnapIndex?: number`
- `maxHeight?: number`
- `minHeight?: number`

## DataList

- `items: T[]`
- `getKey: (item: T) => Key`
- `renderItem: (item: T) => ReactNode`
- `loading?: boolean`
- `error?: string`
- `onRetry?: () => void`
- `label?: string`
- `emptyTitle?: string`
- `emptyDescription?: string`
- `emptyAction?: ReactNode`
- `loadingLabel?: string`
- `retryLabel?: string`

## DataPagination

- `labels?: Partial<DataPaginationLabels>`
- `pageSizeOptions?: number[]`
- `page: number`
- `limit: number`
- `totalPages: number`
- `onPageChange: (page: number) => void`
- `onLimitChange: (limit: number) => void`

## DataTable

- `data: T[]`
- `columns: DataTableColumn<T>[]`
- `onRowClick?: (item: T) => void`
- `bulkActions?: DataTableBulkAction[]`
- `isLoading?: boolean`
- `emptyState?: ReactNode`
- `error?: string`
- `onRetry?: () => void`
- `labels?: Partial<DataTableLabels>`

## DateRangePicker

- `value?: DateRange`
- `id?: string`
- `onChange: (range: DateRange | undefined) => void`
- `className?: string`
- `locale?: Locale`
- `placeholder?: string`
- `ariaLabel?: string`
- `presets?: DateRangePreset[]`
- `minDate?: Date`
- `maxDate?: Date`
- `allowFuture?: boolean`
- `numberOfMonths?: number`
- `disabled?: boolean`
- `clearable?: boolean`
- `clearLabel?: string`
- `closeOnSelect?: boolean`
- `formatLabel?: (range: DateRange, locale: Locale) => string`

## FilterBar

- `ariaLabel?: string`
- `query: string`
- `onQueryChange: (query: string) => void`
- `onReset?: () => void`
- `label?: string`
- `resetLabel?: string`
- `children?: ReactNode`

## PageHeader

- `title: string`
- `description?: string`
- `actions?: ReactNode`
- `breadcrumbs?: ReactNode`
- `badges?: ReactNode`
- `meta?: ReactNode` — Linha discreta abaixo do título: data, identificador, origem.
- `back?: PageHeaderBack`
- `variant?: "page" | "bar"`
- `className?: string`

## SidebarProfile

- `user: { name: string; email?: string; image?: string; initials?: string }`
- `profile?: SidebarProfileAction`
- `organization?: SidebarProfileAction`
- `install?: SidebarProfileAction`
- `theme?: { value: "light" | "dark" | "system"; onChange: (value: "light" | "dark" | "system") => void; }`
- `language?: { value: string; options: { value: string; label: string }[]; onChange: (value: string) => void; }`
- `signOut?: { onSelect: () => void; pending?: boolean; disabled?: boolean }` — The product owns async errors and sets pending while signing out.
- `actions?: (SidebarProfileAction & { id: string; label: string; icon?: ReactNode; })[]`
- `labels?: Partial<SidebarProfileLabels>`
- `className?: string`

## StatusPanel

- `state: "loading" | "error" | "empty" | "success" | "unavailable"`
- `title: string`
- `description?: string`
- `action?: ReactNode`
- `className?: string`

## ValidatedForm

- `fields: FormFieldDefinition[]`
- `initialValues?: Record<string, string>`
- `onSubmit: (values: Record<string, string>) => void | Promise<void>`
- `submitLabel?: string`
- `pendingLabel?: string`
- `successMessage?: string`
- `errorMessage?: string`
