import { test } from "node:test";
import assert from "node:assert/strict";
import { createApiClient, createAppQueryClient, resetAppState } from "@organizacaox/lai-design-system/app";
import { BetterFetchError } from "@organizacaox/lai-design-system/fetch";
import { createStore, persist, createJSONStorage } from "@organizacaox/lai-design-system/store";

test("HTTP throws typed errors; only Query retries transient reads", async () => {
  let attempts = 0;
  let status = 503;
  const api = createApiClient({ baseURL: "https://fixture.test", customFetchImpl: async () => {
    attempts++;
    return new Response(JSON.stringify({ message: "failed" }), { status, headers: { "Content-Type": "application/json" } });
  } });
  const client = createAppQueryClient({ defaultOptions: { queries: { retryDelay: 0, gcTime: 0 } } });
  try {
    await assert.rejects(client.fetchQuery({ queryKey: ["transient"], queryFn: () => api("/error") }), BetterFetchError);
    assert.equal(attempts, 3);
    status = 401; attempts = 0;
    await assert.rejects(client.fetchQuery({ queryKey: ["unauthorized"], queryFn: () => api("/error") }), (error) => error.status === 401);
    assert.equal(attempts, 1);
    assert.equal(client.getDefaultOptions().mutations.retry, false);
    assert.equal(client.getDefaultOptions().queries.staleTime, 30_000);
  } finally { client.clear(); }
});

test("auth callback reads current token on each request", async () => {
  let token = "first";
  const seen = [];
  const api = createApiClient({ baseURL: "https://fixture.test", auth: { type: "Bearer", token: () => token }, customFetchImpl: async (_url, init) => {
    seen.push(new Headers(init.headers).get("authorization"));
    return Response.json({ ok: true });
  } });
  assert.deepEqual(await api("/me"), { ok: true });
  token = "second";
  await api("/me");
  assert.deepEqual(seen, ["Bearer first", "Bearer second"]);
});

test("session reset aborts reads and clears query and persisted store state", async () => {
  const data = new Map();
  const storage = createJSONStorage(() => ({ getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key) }));
  const store = createStore()(persist(() => ({ selected: null }), { name: "fixture", version: 1, storage }));
  store.setState({ selected: "old-tenant" });
  const client = createAppQueryClient();
  let aborted = false;
  let started;
  const ready = new Promise((resolve) => { started = resolve; });
  const api = createApiClient({ baseURL: "https://fixture.test", customFetchImpl: (_url, init) => new Promise((_resolve, reject) => {
    init.signal.addEventListener("abort", () => { aborted = true; reject(new DOMException("Aborted", "AbortError")); }, { once: true });
    started();
  }) });
  const pending = client.fetchQuery({ queryKey: ["old"], queryFn: ({ signal }) => api("/slow", { signal }) }).catch(() => {});
  await ready;
  await resetAppState({ queryClient: client, resetStores: [async () => {
    store.setState(store.getInitialState(), true);
    await store.persist.clearStorage();
  }] });
  await pending;
  assert.equal(aborted, true);
  assert.equal(client.getQueryCache().getAll().length, 0);
  assert.equal(store.getState().selected, null);
  assert.equal(data.size, 0);
  assert.notEqual(createAppQueryClient(), client);
});

test("timeouts abort HTTP and per-client defaults can be overridden", async () => {
  let aborted = false;
  const api = createApiClient({ baseURL: "https://fixture.test", timeout: 10, customFetchImpl: (_url, init) => new Promise((_resolve, reject) => {
    init.signal.addEventListener("abort", () => { aborted = true; reject(new DOMException("Aborted", "AbortError")); }, { once: true });
  }) });
  await assert.rejects(api("/slow"), (error) => error.name === "AbortError");
  assert.equal(aborted, true);
  const client = createAppQueryClient({ defaultOptions: { queries: { staleTime: 500, retry: false }, mutations: { retry: 1 } } });
  assert.equal(client.getDefaultOptions().queries.staleTime, 500);
  assert.equal(client.getDefaultOptions().queries.retry, false);
  assert.equal(client.getDefaultOptions().mutations.retry, 1);
  client.clear();
});

test("persisted stores migrate old versions through the LAI middleware exports", () => {
  const data = new Map([["versioned", JSON.stringify({ state: { oldName: "Ana" }, version: 0 })]]);
  const storage = createJSONStorage(() => ({ getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key) }));
  const store = createStore()(persist(() => ({ name: "" }), {
    name: "versioned", version: 1, storage,
    migrate: (old) => ({ name: old.oldName }),
  }));
  assert.equal(store.getState().name, "Ana");
  assert.equal(JSON.parse(data.get("versioned")).version, 1);
});
