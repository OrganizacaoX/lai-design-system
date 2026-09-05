import { test } from "node:test";
import assert from "node:assert/strict";
import { createAppI18n, createLocaleFormatters } from "@organizacaox/lai-design-system/i18n";

test("instances isolate language/resources and share LAI plural/fallback conventions", async () => {
  const resources = { en: { app: { title: "Product", greeting: "Hello {{name}}" } } };
  const a = await createAppI18n({ lng: "en", resources, defaultNS: "app" });
  const b = await createAppI18n({ lng: "es" });
  assert.equal(a.t("greeting", { name: "Ana" }), "Hello Ana");
  assert.equal(a.t("table.selected", { ns: "lai", keySeparator: false, count: 2 }), "2 selected");
  assert.equal(b.t("table.selected", { ns: "lai", keySeparator: false, count: 1 }), "1 seleccionado");
  await a.changeLanguage("pt-BR");
  assert.equal(b.language, "es");
  assert.equal(a.t("table.selected", { ns: "lai", keySeparator: false, count: 2 }), "2 selecionados");
  a.addResource("en", "app", "title", "Changed");
  a.addResourceBundle("es", "app", { title: "Changed" });
  assert.equal(b.hasResourceBundle("es", "app"), false);
  assert.deepEqual(resources, { en: { app: { title: "Product", greeting: "Hello {{name}}" } } });
  const fallback = await createAppI18n({ lng: "de" });
  assert.equal(fallback.resolvedLanguage, "pt-BR");
  assert.equal(fallback.t("close", { ns: "lai" }), "Fechar");
  [a, b, fallback].forEach((instance) => instance.dispose());
});

test("persistence is opt-in, resilient and detached by dispose", async () => {
  const values = new Map([["app", "es"]]);
  const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
  const instance = await createAppI18n({ storageKey: "app", storage });
  assert.equal(instance.language, "es");
  await instance.changeLanguage("en");
  assert.equal(values.get("app"), "en");
  instance.dispose();
  await instance.changeLanguage("es");
  assert.equal(values.get("app"), "en");
  const explicit = await createAppI18n({ lng: "pt-BR", storageKey: "app", storage });
  assert.equal(explicit.language, "pt-BR");
  explicit.dispose();
  const blocked = await createAppI18n({ storageKey: "app", detectLanguage: false, storage: { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); } } });
  await blocked.changeLanguage("es");
  assert.equal(blocked.language, "es");
  blocked.dispose();
});

test("formatters use explicit currency and timezone", () => {
  const date = new Date("2025-01-15T00:30:00Z");
  assert.equal(createLocaleFormatters("pt-BR").number(1234.5), "1.234,5");
  assert.equal(createLocaleFormatters("en").currency(10, "USD"), "$10.00");
  assert.equal(createLocaleFormatters("en").date(date, { timeZone: "UTC", day: "numeric" }), "15");
  assert.equal(createLocaleFormatters("en").date(date, { timeZone: "America/Sao_Paulo", day: "numeric" }), "14");
});
