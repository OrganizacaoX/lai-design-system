import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

/** Retry transient reads twice; mutations and client errors are not retried. */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false;
  if (error instanceof Error && error.name === "AbortError") return false;
  const status = typeof error === "object" && error !== null && "status" in error
    ? Number(error.status) : undefined;
  return status === undefined || status === 408 || status === 429 || status >= 500;
}

/** Call once per browser app, or once per request when rendering on the server. */
export function createAppQueryClient(config: QueryClientConfig = {}) {
  return new QueryClient({
    ...config,
    defaultOptions: {
      ...config.defaultOptions,
      queries: {
        staleTime: 30_000,
        retry: shouldRetryQuery,
        ...config.defaultOptions?.queries,
      },
      mutations: { retry: false, ...config.defaultOptions?.mutations },
    },
  });
}
