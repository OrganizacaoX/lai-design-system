import { StatusPanel } from "@/components/status-panel";
import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  width?: number | string;
  align?: "left" | "center" | "right";
  render: (item: T) => ReactNode;
}

export interface DataTableBulkAction {
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "destructive" | "outline" | "ghost";
  onAction: (selectedIds: string[]) => void;
}

export interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: DataTableColumn<T>[];
  onRowClick?: (item: T) => void;
  bulkActions?: DataTableBulkAction[];
  isLoading?: boolean;
  emptyState?: ReactNode;
  error?: string;
  onRetry?: () => void;
  labels?: Partial<DataTableLabels>;
}

export interface DataTableLabels {
  actions: string;
  openRow: (row: number) => string;
  loading: string;
  retry: string;
  selected: (count: number) => string;
  selectRow: (row: number) => string;
  selectAll: string;
  clear: string;
  empty: string;
}
const defaultLabels: DataTableLabels = {
  actions: "Ações",
  openRow: (row) => `Abrir linha ${row}`,
  loading: "Carregando resultados…",
  retry: "Tentar novamente",
  selected: (count) => `${count} selecionado(s)`,
  selectRow: (row) => `Selecionar linha ${row}`,
  selectAll: "Selecionar todos",
  clear: "Limpar seleção",
  empty: "Nenhum resultado encontrado.",
};

function useSelection(ids: string[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedIds((prev) => {
      const idSet = new Set(ids);
      const filtered = new Set([...prev].filter((id) => idSet.has(id)));
      return filtered.size === prev.size ? prev : filtered;
    });
  }, [ids]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.size === ids.length ? new Set() : new Set(ids),
    );
  }, [ids]);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  const allSelected = ids.length > 0 && selectedIds.size === ids.length;

  return { selectedIds, toggle, toggleAll, clear, allSelected };
}

function BulkActionBar({
  count,
  actions,
  selectedIds,
  onClear,
  labels,
}: {
  count: number;
  actions: DataTableBulkAction[];
  selectedIds: string[];
  onClear: () => void;
  labels: DataTableLabels;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-4 py-2.5"
      aria-live="polite"
    >
      <span className="text-sm text-muted-foreground flex-1">
        {labels.selected(count)}
      </span>
      <div className="flex items-center gap-2">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={action.label}
              variant={action.variant ?? "outline"}
              onClick={() => action.onAction(selectedIds)}
              size="sm"
            >
              {IconComponent && <IconComponent data-icon="inline-start" />}
              {action.label}
            </Button>
          );
        })}
        <Button variant="ghost" size="sm" onClick={onClear}>
          {labels.clear}
        </Button>
      </div>
    </div>
  );
}

const selectionColClass =
  "w-14 min-w-[3.5rem] max-w-14 px-2 align-middle [&:has([role=checkbox])]:w-14";

function TableSkeleton({
  columns,
  rows = 5,
  hasBulkActions = false,
}: {
  columns: number;
  rows?: number;
  hasBulkActions?: boolean;
}) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {hasBulkActions && (
            <TableCell className={selectionColClass}>
              <div className="flex items-center justify-center py-0.5">
                <Skeleton className="size-5 shrink-0 rounded-md" />
              </div>
            </TableCell>
          )}
          {Array.from({ length: columns }).map((__, colIdx) => (
            <TableCell key={colIdx}>
              <Skeleton className="w-[80%] h-[18px] rounded" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  bulkActions,
  isLoading,
  emptyState,
  error,
  onRetry,
  labels: customLabels,
}: DataTableProps<T>) {
  const labels = { ...defaultLabels, ...customLabels };
  const ids = useMemo(() => data.map((item) => item.id), [data]);
  const { selectedIds, toggle, toggleAll, clear, allSelected } =
    useSelection(ids);

  const hasBulkActions = (bulkActions?.length ?? 0) > 0;
  const hasSelection = selectedIds.size > 0;

  if (error && !isLoading)
    return (
      <StatusPanel
        state="error"
        title={error}
        action={
          onRetry && (
            <Button variant="outline" onClick={onRetry}>
              {labels.retry}
            </Button>
          )
        }
      />
    );

  return (
    <div className="flex flex-col gap-2">
      {isLoading && (
        <p role="status" className="text-sm text-muted-foreground">
          {labels.loading}
        </p>
      )}
      {hasBulkActions && hasSelection && !isLoading && (
        <BulkActionBar
          count={selectedIds.size}
          actions={bulkActions!}
          selectedIds={Array.from(selectedIds)}
          onClear={clear}
          labels={labels}
        />
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <Table aria-busy={isLoading || undefined}>
          <TableHeader>
            <TableRow>
              {hasBulkActions && (
                <TableHead className={selectionColClass}>
                  <div className="flex w-full items-center justify-center">
                    <Checkbox
                      aria-label={labels.selectAll}
                      checked={allSelected}
                      indeterminate={hasSelection && !allSelected}
                      disabled={isLoading || data.length === 0}
                      onCheckedChange={toggleAll}
                    />
                  </div>
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  style={{
                    ...(col.width && { width: col.width }),
                    ...(col.align && { textAlign: col.align }),
                  }}
                >
                  {col.label}
                </TableHead>
              ))}
              {onRowClick && <TableHead>{labels.actions}</TableHead>}
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton
              columns={columns.length + (onRowClick ? 1 : 0)}
              rows={5}
              hasBulkActions={hasBulkActions}
            />
          ) : data.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell
                  style={{ textAlign: "center", padding: 40 }}
                  className="text-muted-foreground"
                  colSpan={
                    columns.length +
                    (hasBulkActions ? 1 : 0) +
                    (onRowClick ? 1 : 0)
                  }
                >
                  {emptyState ?? labels.empty}
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {data.map((item, index) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <TableRow
                    key={item.id}
                    className={onRowClick ? "cursor-pointer" : undefined}
                    onClick={
                      onRowClick
                        ? (event) => {
                            if (
                              !(event.target as Element).closest(
                                "button, a, input, select, textarea, [role=button], [role=checkbox]",
                              )
                            )
                              onRowClick(item);
                          }
                        : undefined
                    }
                    data-state={isSelected ? "selected" : undefined}
                  >
                    {hasBulkActions && (
                      <TableCell className={selectionColClass}>
                        <div
                          className="flex w-full items-center justify-center py-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            aria-label={labels.selectRow(index + 1)}
                            checked={isSelected}
                            onCheckedChange={() => toggle(item.id)}
                          />
                        </div>
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        style={{
                          ...(col.align && { textAlign: col.align }),
                          ...(col.width ? { width: col.width } : undefined),
                        }}
                      >
                        {col.render(item)}
                      </TableCell>
                    ))}
                    {onRowClick && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRowClick(item)}
                        >
                          {labels.openRow(index + 1)}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
}

export default DataTable;
