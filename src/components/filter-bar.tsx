import { useLaiTranslation } from "@/hooks/use-lai-translation";
import { useId, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export interface FilterBarProps {
  ariaLabel?: string;
  query: string;
  onQueryChange: (query: string) => void;
  onReset?: () => void;
  label?: string;
  resetLabel?: string;
  children?: ReactNode;
}
export function FilterBar({
  ariaLabel,
  query,
  onQueryChange,
  onReset,
  label,
  resetLabel,
  children,
}: FilterBarProps) {
  const { t } = useLaiTranslation();
  ariaLabel ??= t("filter.label");
  label ??= t("filter.search");
  resetLabel ??= t("filter.clear");
  const id = useId();
  return (
    <section
      aria-label={ariaLabel}
      className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4"
    >
      <div className="min-w-0 flex-1 basis-48">
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {label}
        </label>
        <Input
          id={id}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      {children}
      {onReset && (
        <Button variant="outline" onClick={onReset}>
          {resetLabel}
        </Button>
      )}
    </section>
  );
}
