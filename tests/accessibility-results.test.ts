import { afterAll, beforeAll, expect, test } from "bun:test";
import { spawn, type ChildProcess } from "node:child_process";
import { chromium, type Browser } from "@playwright/test";
import source from "../site/test-source.json";

let server: ChildProcess;
let browser: Browser;
const url = "http://127.0.0.1:4298";

beforeAll(async () => {
  server = spawn(
    "node",
    [
      "node_modules/vite/bin/vite.js",
      "--host",
      "127.0.0.1",
      "--port",
      "4298",
      "--strictPort",
    ],
    {
      env: { ...process.env, VITE_SITE_PASSWORD: "test-password" },
      stdio: "ignore",
    },
  );
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if ((await fetch(url, { signal: AbortSignal.timeout(2000) })).ok) break;
    } catch {
      /* Aguardar Vite. */
    }
    await Bun.sleep(100);
  }
  browser = await chromium.launch();
}, 60000);

afterAll(async () => {
  await browser?.close();
  server?.kill();
});

for (const state of [
  "passed",
  "failed",
  "review",
  "inapplicable",
  "stale",
  "missing",
  "error",
] as const) {
  test(`resultados de acessibilidade: ${state}`, async () => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 900 },
    });
    try {
      await context.addInitScript(() =>
        sessionStorage.setItem("lai-site-access", "granted"),
      );
      const page = await context.newPage();
      await page.route("**/component-accessibility.json", (route) =>
        state === "missing"
          ? route.fulfill({ status: 404 })
          : route.fulfill({
              json: {
                generatedAt: "2026-09-17T12:00:00Z",
                fingerprint: state === "stale" ? "old" : source.fingerprint,
                engine: "axe-core",
                components: {
                  button: [
                    {
                      width: 390,
                      theme: "light",
                      textSizes: [14],
                      error: state === "error" ? "Timeout" : undefined,
                      rules: [
                        {
                          id: "color-contrast",
                          title: "Contrast",
                          url: "https://dequeuniversity.com/rules/axe/4.13/color-contrast",
                          status:
                            state === "stale" || state === "error"
                              ? "passed"
                              : state,
                          nodes:
                            state === "failed"
                              ? [
                                  {
                                    target: "button",
                                    detail:
                                      "Contraste observado 2:1; esperado 4.5:1",
                                  },
                                ]
                              : [],
                        },
                      ],
                    },
                  ],
                },
              },
            }),
      );
      await page.goto(`${url}/componentes/button`);
      const panel = page.getByRole("region", {
        name: "Acessibilidade",
        exact: true,
      });
      if (state === "missing") {
        await panel
          .getByText("Sem auditoria registrada para este componente.")
          .waitFor();
      } else {
        await panel.getByRole("button", { name: /Ver resultados/ }).click();
        await panel.getByText(/Tamanhos de texto observados: 14 px/).waitFor();
        if (state === "failed")
          await panel
            .getByText("Contraste observado 2:1; esperado 4.5:1")
            .waitFor();
        if (state === "stale")
          await panel.getByText("Auditoria de uma versão anterior").waitFor();
        if (state === "review")
          await panel
            .getByText("Há verificações que exigem revisão manual")
            .waitFor();
        if (state === "inapplicable")
          await panel.getByText(/Não se aplica ao exemplo/).waitFor();
        if (state === "error")
          await panel
            .getByText("Auditoria incompleta", { exact: true })
            .waitFor();
        expect(await panel.locator(".text-success").count()).toBe(
          state === "passed" || state === "error" ? 1 : 0,
        );
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    } finally {
      await context.close();
    }
  }, 60000);
}
