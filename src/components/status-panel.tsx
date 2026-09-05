import type { ReactNode } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Inbox,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusPanelProps {
  state: "loading" | "error" | "empty" | "success" | "unavailable";
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}
/** Feedback comum a listagens, formulários e painéis. Textos são definidos pelo produto. */
export function StatusPanel({
  state,
  title,
  description,
  action,
  className,
}: StatusPanelProps) {
  const Icon = {
    loading: Loader2,
    error: CircleAlert,
    empty: Inbox,
    success: CheckCircle2,
    unavailable: LockKeyhole,
  }[state];
  return (
    <section
      data-slot="status-panel"
      data-state={state}
      aria-busy={state === "loading" || undefined}
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "size-6",
          state === "loading" && "animate-spin",
          state === "error" && "text-destructive",
          state === "success" && "text-success",
          (state === "empty" || state === "unavailable") &&
            "text-muted-foreground",
        )}
      />
      <div
        role={state === "error" ? "alert" : "status"}
        aria-atomic="true"
        className="space-y-1"
      >
        <p className="font-semibold">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex flex-wrap justify-center gap-2">{action}</div>
      )}
    </section>
  );
}
