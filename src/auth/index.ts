import { resetAppState, type ResetAppStateOptions } from "../app/reset";
export { createAuthClient, createAuthClient as createAppAuthClient } from "better-auth/react";
export interface AuthTransitionOptions<T> extends ResetAppStateOptions {
  /** Unmount protected queries and settle/cancel product mutations before resolving. */
  suspend: () => void | Promise<void>;
  action: () => Promise<T>;
  resume: () => void | Promise<void>;
}
/** Works with signOut and organization.setActive. Failed requests preserve cached state. */
export async function transitionAuthState<T extends { error?: unknown }>({ suspend, action, resume, ...state }: AuthTransitionOptions<T>): Promise<T> {
  await suspend();
  try {
    const result = await action();
    if (!result.error) await resetAppState(state);
    return result;
  } finally {
    await resume();
  }
}
