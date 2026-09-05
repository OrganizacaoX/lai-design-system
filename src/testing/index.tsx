import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { type ReactElement, type ReactNode, type ComponentType } from "react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { createAppQueryClient } from "../app/query-client";
import { createAppI18n, type AppI18n } from "../i18n/create-app-i18n";
import { LaiI18nProvider } from "../i18n/provider";
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
export interface LaiTestContext {
  queryClient: QueryClient;
  i18n: AppI18n;
  Wrapper: ComponentType<{ children: ReactNode }>;
  dispose(): Promise<void>;
}
export async function createLaiTestContext(options: Parameters<typeof createAppI18n>[0] = {}): Promise<LaiTestContext> {
  const queryClient = createAppQueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false } } });
  const i18n = await createAppI18n({ ...options, storageKey: undefined, detectLanguage: false });
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}><LaiI18nProvider i18n={i18n} updateDocument={false}>{children}</LaiI18nProvider></QueryClientProvider>;
  }
  return { queryClient, i18n, Wrapper, async dispose() { await queryClient.cancelQueries(); queryClient.clear(); i18n.dispose(); } };
}
export async function renderWithLai(ui: ReactElement, options: Omit<RenderOptions, "wrapper"> & { i18n?: Parameters<typeof createAppI18n>[0] } = {}): Promise<RenderResult & LaiTestContext> {
  const { i18n, ...renderOptions } = options;
  const context = await createLaiTestContext(i18n);
  try {
    const view = render(ui, { ...renderOptions, wrapper: context.Wrapper });
    return { ...view, ...context, async dispose() { view.unmount(); await context.dispose(); } };
  } catch (error) { await context.dispose(); throw error; }
}
/** Same typed options as the native router; supply context for context-aware route trees. */
export const createTestRouter: typeof createRouter = options => createRouter({
  ...options, history: options.history ?? createMemoryHistory({ initialEntries: ["/"] }),
});
/** Capture the initial state of a store created for this test; restores persisted middleware too. */
export function createStoreReset<T>(store: { getInitialState(): T; setState(state: T, replace: true): void }) {
  return () => store.setState(store.getInitialState(), true);
}
