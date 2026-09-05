import { PostHog, type PostHogConfig } from "posthog-js";
export { PostHog } from "posthog-js";
export type { PostHogConfig } from "posthog-js";
export interface AppAnalyticsOptions {
  key: string;
  host: string;
  enabled?: boolean;
  config?: Partial<PostHogConfig>;
}
/** Call once per app, after the product decides to enable analytics. No import-time initialization. */
export function createAppAnalytics({ key, host, enabled = true, config }: AppAnalyticsOptions): PostHog | null {
  if (!enabled || typeof window === "undefined") return null;
  const client = new PostHog();
  client.init(key, { autocapture: false, capture_pageview: false, capture_pageleave: false, disable_session_recording: true,
    ...config, api_host: host });
  return client;
}
