import { test } from "node:test";
import assert from "node:assert/strict";
import { createLaiTestContext, createStoreReset, createTestRouter } from "@organizacaox/lai-design-system/testing";
import { createRootRoute, createRoute, createMemoryHistory } from "@organizacaox/lai-design-system/router";
import { createStore } from "@organizacaox/lai-design-system/store";
import { transitionAuthState } from "@organizacaox/lai-design-system/auth";
import { createAppAnalytics } from "@organizacaox/lai-design-system/analytics";
import { createChat } from "@organizacaox/lai-design-system/ai/testing";
import { ChatClient } from "@organizacaox/lai-design-system/ai/client";
import { z } from "@organizacaox/lai-design-system/schema";

test("test contexts isolate caches, language and store resets, then dispose", async () => {
  const a = await createLaiTestContext({ lng: "en" });
  const b = await createLaiTestContext({ lng: "es" });
  a.queryClient.setQueryData(["private"], "A");
  assert.equal(b.queryClient.getQueryData(["private"]), undefined);
  await a.i18n.changeLanguage("pt-BR");
  assert.equal(b.i18n.language, "es");
  const store = createStore(() => ({ secret: "" }));
  const reset = createStoreReset(store);
  store.setState({ secret: "private" }); reset();
  assert.equal(store.getState().secret, "");
  await Promise.all([a.dispose(), b.dispose()]);
  assert.equal(a.queryClient.getQueryCache().getAll().length, 0);
});

test("memory router runs route loaders without browser history", async () => {
  const root = createRootRoute();
  const child = createRoute({ getParentRoute: () => root, path: "/test", loader: () => "loaded" });
  const router = createTestRouter({ routeTree: root.addChildren([child]), history: createMemoryHistory({ initialEntries: ["/test"] }) });
  await router.load();
  assert.equal(router.state.matches.at(-1).loaderData, "loaded");
});

test("auth transitions preserve cache on rejection, reset before resuming on success", async () => {
  const ctx = await createLaiTestContext();
  const order = [];
  ctx.queryClient.setQueryData(["session"], "A");
  const base = { queryClient: ctx.queryClient, suspend: () => { order.push("suspend"); }, resume: () => { order.push("resume"); }, resetStores: [() => { order.push("reset"); }] };
  const denied = await transitionAuthState({ ...base, action: async () => ({ error: { message: "denied" } }) });
  assert(denied.error);
  assert.equal(ctx.queryClient.getQueryData(["session"]), "A");
  await assert.rejects(transitionAuthState({ ...base, action: async () => { throw new Error("offline"); } }), /offline/);
  assert.equal(ctx.queryClient.getQueryData(["session"]), "A");
  order.length = 0;
  await transitionAuthState({ ...base, action: async () => { order.push("action"); return { error: null }; } });
  assert.deepEqual(order, ["suspend", "action", "reset", "resume"]);
  assert.equal(ctx.queryClient.getQueryData(["session"]), undefined);
  await ctx.dispose();
});

test("analytics stays inactive on the server and schemas enforce input", () => {
  assert.equal(createAppAnalytics({ key: "test", host: "http://localhost", enabled: false }), null);
  assert.equal(createAppAnalytics({ key: "test", host: "http://localhost" }), null);
  const schema = z.object({ email: z.email() });
  assert.equal(schema.safeParse({ email: "invalid" }).success, false);
  assert.equal(schema.parse({ email: "ana@example.test" }).email, "ana@example.test");
});

test("AI helper streams text, reasoning and tools through the native client without fetch", async () => {
  const chat = createChat().user("Check").assistant(({ writer }) => {
    writer.reasoning("Checking.", { mode: "instant" });
    writer.tool("lookup", { input: { id: 1 } }).output({ ok: true });
    writer.text("All ready.", { mode: "instant" });
  });
  const previousFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error("Unexpected network request"); };
  try {
    const client = new ChatClient({ connection: chat.transport({ delayMs: 0 }) });
    await client.append(chat.next([]));
    const parts = client.getMessages().filter(message => message.role === "assistant").flatMap(message => message.parts);
    assert(parts.some(part => part.type === "text" && part.content === "All ready."));
    assert(parts.some(part => part.type === "thinking" && part.content === "Checking."));
    assert(parts.some(part => part.type === "tool-result"));
    assert.equal(chat.next(client.getMessages()), null);
  } finally { globalThis.fetch = previousFetch; }
});

test("AI helper propagates scripted stream errors", async () => {
  let failure;
  const chat = createChat().user("Fail").error("Fixture failure");
  const client = new ChatClient({ connection: chat.transport({ delayMs: 0 }), onError: error => { failure = error; } });
  await client.append(chat.next([]));
  assert.match(String(failure), /Fixture failure/);
});
