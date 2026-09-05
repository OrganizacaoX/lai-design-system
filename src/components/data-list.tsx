import { useLaiTranslation } from "@/hooks/use-lai-translation";
import type { ReactNode, Key } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
export interface DataListProps<T> {
  items: T[];
  getKey: (item: T) => Key;
  renderItem: (item: T) => ReactNode;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  label?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  loadingLabel?: string;
  retryLabel?: string;
}
export function DataList<T>({
  items,
  getKey,
  renderItem,
  loading,
  error,
  onRetry,
  label,
  emptyTitle,
  emptyDescription,
  emptyAction,
  loadingLabel,
  retryLabel,
}: DataListProps<T>) {
  const { t } = useLaiTranslation();
  label ??= t("list.label");
  emptyTitle ??= t("list.empty");
  emptyDescription ??= t("list.description");
  loadingLabel ??= t("table.loading");
  retryLabel ??= t("retry");

  if (loading)
    return (
      <section
        aria-label={label}
        aria-busy="true"
        className="space-y-3 rounded-xl border p-4"
      >
        <p role="status" className="text-sm text-muted-foreground">
          {loadingLabel}
        </p>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </section>
    );
  if (error)
    return (
      <section aria-label={label} className="space-y-3 rounded-xl border p-6">
        <p role="alert" className="text-destructive">
          {error}
        </p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            {retryLabel}
          </Button>
        )}
      </section>
    );
  if (!items.length)
    return (
      <section
        aria-label={label}
        className="space-y-3 rounded-xl border p-8 text-center"
      >
        <h2 className="font-semibold">{emptyTitle}</h2>
        <p role="status" className="text-sm text-muted-foreground">
          {emptyDescription}
        </p>
        {emptyAction}
      </section>
    );
  return (
    <ul
      aria-label={label}
      className="divide-y rounded-xl border bg-card shadow-surface"
    >
      {items.map((item) => (
        <li key={getKey(item)} className="p-4">
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}
