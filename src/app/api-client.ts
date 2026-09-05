import { createFetch, type CreateFetchOption } from "@better-fetch/fetch";

/** HTTP defaults for Query. Native schema, auth callbacks and hooks stay available. */
export function createApiClient<Options extends Omit<CreateFetchOption, "throw">>(options: Options) {
  return createFetch({ timeout: 15_000, retry: 0, ...options, throw: true as const });
}
