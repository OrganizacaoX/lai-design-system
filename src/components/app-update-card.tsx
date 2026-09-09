import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLaiTranslation } from "@/hooks/use-lai-translation";

export interface AppUpdateCardProps {
  onUpdate: () => void;
  title?: string;
  /** Substitui o texto padrão quando atualizar agora custa alguma coisa
      (uma ligação em curso, um formulário aberto). */
  description?: ReactNode;
  actionLabel?: string;
  icon?: ReactNode;
  className?: string;
}

/** Aviso persistente, mas não bloqueante: uma versão nova não interrompe o que
    a pessoa está fazendo. Quem detecta a versão é o app; o card só oferece a
    ação e desaparece quando o consumidor para de renderizá-lo. */
export function AppUpdateCard({
  onUpdate,
  title,
  description,
  actionLabel,
  icon,
  className,
}: AppUpdateCardProps) {
  const { t } = useLaiTranslation();
  return (
    <Alert
      role="status"
      aria-live="polite"
      className={cn(
        "fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 border-border/80 bg-card/95 p-4 shadow-lg shadow-black/10 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            {icon ?? <RefreshCw aria-hidden="true" className="size-4" />}
          </span>
          <div className="min-w-0">
            <AlertTitle>{title ?? t("appUpdate.available")}</AlertTitle>
            <AlertDescription className="mt-0.5">
              {description ?? t("appUpdate.availableDescription")}
            </AlertDescription>
          </div>
        </div>
        <Button type="button" size="sm" className="shrink-0" onClick={onUpdate}>
          {actionLabel ?? t("appUpdate.updateNow")}
        </Button>
      </div>
    </Alert>
  );
}

export interface AppUpdatingScreenProps {
  /** `updating` é o caminho feliz (a atualização está em curso). `failed` é a
      saída quando o recarregamento não veio dentro do tempo esperado. */
  variant?: "updating" | "failed";
  onRetry: () => void;
  /** Só renderiza o botão secundário quando o app tem um caminho a mais que o
      retry — limpar o cache e desregistrar o service worker, por exemplo. */
  onClearCache?: () => void;
  /** Marca do produto no lugar do spinner: o design system não conhece o logo
      de cada app. */
  icon?: ReactNode;
  className?: string;
}

/** Overlay de tela cheia para o momento em que a atualização assume a tela. */
export function AppUpdatingScreen({
  variant = "updating",
  onRetry,
  onClearCache,
  icon,
  className,
}: AppUpdatingScreenProps) {
  const { t } = useLaiTranslation();
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground",
        className,
      )}
    >
      {variant === "updating" ? (
        <>
          {/* O container já é a região viva; o ícone não anuncia de novo. */}
          {icon ?? <Spinner role="presentation" aria-label={undefined} className="size-8 text-muted-foreground" />}
          <p className="text-sm text-muted-foreground">{t("appUpdate.updating")}</p>
        </>
      ) : (
        <>
          <p className="text-base font-medium">{t("appUpdate.failed")}</p>
          <p className="max-w-xs text-sm text-muted-foreground">{t("appUpdate.checkConnection")}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button onClick={onRetry}>{t("retry")}</Button>
            {onClearCache && (
              <Button variant="outline" onClick={onClearCache}>
                {t("appUpdate.clearCache")}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
