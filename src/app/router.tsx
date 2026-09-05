import { useLaiTranslation } from "../hooks/use-lai-translation";
import { createRouter, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { StatusPanel } from "../components/status-panel";

export function AppPending() {
  const { t } = useLaiTranslation();
  return <StatusPanel state="loading" title={t("app.loading")} />;
}
export function AppNotFound() {
  const { t } = useLaiTranslation();
  return <StatusPanel state="unavailable" title={t("app.notFound")} />;
}
export function AppRouteError(_props: ErrorComponentProps) {
  const { t } = useLaiTranslation();
  const router = useRouter();
  return <StatusPanel state="error" title={t("app.error")}
    action={<Button onClick={() => void router.invalidate()}>{t("retry")}</Button>} />;
}

/** Preserves TanStack's route inference. Override defaults to localize the UI. */
export const createAppRouter: typeof createRouter = (options) => createRouter({
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: AppPending,
  defaultErrorComponent: AppRouteError,
  defaultNotFoundComponent: AppNotFound,
  ...options,
});
