import { afterAll, beforeAll, expect, test } from "bun:test";
import { spawn, type ChildProcess } from "node:child_process";
import { chromium, type Browser } from "@playwright/test";
import source from "../site/test-source.json";

let server: ChildProcess;
let browser: Browser;
const url = "http://127.0.0.1:4296";

beforeAll(async () => {
  server = spawn(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      "--host",
      "127.0.0.1",
      "--port",
      "4296",
      "--strictPort",
    ],
    {
      env: { ...process.env, VITE_SITE_PASSWORD: "test-password" },
      stdio: "ignore",
    },
  );
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if ((await fetch(url)).ok) break;
    } catch {
      /* Aguardar Vite. */
    }
    await Bun.sleep(100);
  }
  browser = await chromium.launch();
}, 30000);

afterAll(async () => {
  await browser?.close();
  server?.kill();
});

for (const width of [390, 1280]) {
  for (const state of [
    "passed",
    "failed",
    "stale",
    "incomplete",
    "missing",
  ] as const) {
    test(`card de testes: ${state}, ${width}px`, async () => {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      try {
        await context.addInitScript(() =>
          sessionStorage.setItem("lai-site-access", "granted"),
        );
        const page = await context.newPage();
        await page.route("**/component-tests.json", (route) =>
          state === "missing"
            ? route.fulfill({ status: 404 })
            : route.fulfill({
                json: {
                  schemaVersion: 1,
                  generatedAt: "2026-09-17T12:00:00Z",
                  sourceFingerprint:
                    state === "stale" ? "previous-version" : source.fingerprint,
                  sourceChangedDuringRun: false,
                  commit: "abc1234",
                  dirty: false,
                  runs: [
                    { name: "browser", complete: state !== "incomplete" },
                    { name: "compositions", complete: true },
                  ],
                  components: {
                    button: {
                      total: 1,
                      passed: state === "failed" ? 0 : 1,
                      failed: state === "failed" ? 1 : 0,
                      flaky: 0,
                      skipped: 0,
                      notRun: 0,
                      checks: [
                        {
                          id: "keyboard",
                          title: "Ativa o botão pelo teclado",
                          file: "tests/button.spec.ts",
                          line: 12,
                          project: "desktop",
                          kind: "interaction",
                          status: state === "failed" ? "failed" : "passed",
                          attempts: 1,
                        },
                      ],
                    },
                  },
                },
              }),
        );
        await page.goto(`${url}/componentes/button`);
        const panel = page.getByRole("region", {
          name: "Confiabilidade do componente",
        });
        const summary = {
          passed: "Todos os testes associados passaram",
          failed: "Falhas encontradas",
          stale: "Resultado de uma versão anterior",
          incomplete: "Execução incompleta",
          missing: "Sem execução registrada",
        }[state];
        await panel.getByRole("status").filter({ hasText: summary }).waitFor();
        expect((await panel.locator(".text-success").count()) > 0).toBe(
          state === "passed",
        );
        expect(await panel.locator("details").count()).toBe(0);
        if (state !== "missing") {
          const trigger = panel.getByRole("button", {
            name: "Ver o que foi testado",
          });
          expect(await trigger.getAttribute("aria-expanded")).toBe("false");
          expect(await trigger.locator("svg").count()).toBe(0);
          await trigger.focus();
          await trigger.press("Enter");
          await panel
            .getByText("Ativa o botão pelo teclado", { exact: true })
            .waitFor();
          expect(await trigger.getAttribute("aria-expanded")).toBe("true");
          expect(await panel.locator("li .text-success").count()).toBe(
            state === "passed" ? 1 : 0,
          );
          await trigger.press("Enter");
          expect(await trigger.getAttribute("aria-expanded")).toBe("false");
        }
        expect(
          await panel.evaluate(
            (element) => element.scrollWidth <= element.clientWidth,
          ),
        ).toBe(true);
      } finally {
        await context.close();
      }
    }, 30000);
  }
}
