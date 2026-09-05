import type { QueryClient } from "@tanstack/react-query";

export interface ResetAppStateOptions {
  queryClient: QueryClient;
  /** Product-owned resets, including persisted storage if applicable. */
  resetStores?: ReadonlyArray<() => void | Promise<void>>;
}

/** Unmount the authenticated tree first. Switch session and remount after awaiting this. */
export async function resetAppState({ queryClient, resetStores = [] }: ResetAppStateOptions) {
  await queryClient.cancelQueries();
  queryClient.clear();
  await Promise.all(resetStores.map((reset) => reset()));
}
