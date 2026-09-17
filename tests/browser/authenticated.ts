import { test as base } from "@playwright/test";

// Os testes do catálogo começam com uma sessão já autenticada.
// O fluxo de entrada é verificado separadamente em site-auth.test.ts.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("lai-site-access", "granted");
    });
    await use(page);
  },
});

export { expect, type Page } from "@playwright/test";
