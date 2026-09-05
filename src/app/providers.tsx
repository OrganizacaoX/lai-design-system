import type { i18n } from "i18next";
import { LaiI18nProvider } from "../i18n/provider";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import type { ReactNode, ComponentProps } from "react";
import { ThemeProvider } from "../components/theme-provider";

export interface AppProvidersProps {
  queryClient: QueryClient;
  i18n?: i18n;
  updateDocumentLanguage?: boolean;
  children: ReactNode;
  theme?: Omit<ComponentProps<typeof ThemeProvider>, "children">;
}

/** Pass the same queryClient to the router context. No hidden global clients. */
export function AppProviders({ queryClient, children, theme, i18n, updateDocumentLanguage }: AppProvidersProps) {
  return <QueryClientProvider client={queryClient}>
    <ThemeProvider {...theme}>{i18n
      ? <LaiI18nProvider i18n={i18n} updateDocument={updateDocumentLanguage}>{children}</LaiI18nProvider>
      : children}</ThemeProvider>
  </QueryClientProvider>;
}
