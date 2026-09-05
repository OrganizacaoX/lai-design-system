import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const source = JSON.parse(readFileSync("site/test-source.json", "utf8"));
// Testes do painel de documentação não são contados como testes do Button.
for (const state of [
  "passed",
  "failed",
  "flaky",
  "stale",
  "missing",
  "incomplete",
]) {
  test(`painel de confiabilidade: ${state}`, async ({ page }) => {
    await page.route("**/component-tests.json", (route) => {
      if (state === "missing")
        return route.fulfill({ status: 404, body: "Not found" });
      const status = state === "failed" || state === "flaky" ? state : "passed";
      return route.fulfill({
        json: {
          schemaVersion: 1,
          generatedAt: "2026-09-05T12:00:00Z",
          sourceFingerprint: state === "stale" ? "old" : source.fingerprint,
          sourceChangedDuringRun: false,
          commit: "abc1234",
          dirty: false,
          runs: [
            { name: "browser", complete: state !== "incomplete", exitCode: 0 },
            { name: "compositions", complete: true, exitCode: 0 },
          ],
          components: {
            button: {
              total: 1,
              passed: status === "passed" ? 1 : 0,
              failed: status === "failed" ? 1 : 0,
              flaky: status === "flaky" ? 1 : 0,
              skipped: 0,
              notRun: 0,
              checks: [
                {
                  id: "example",
                  title: "Verifica botão",
                  file: "example.spec.ts",
                  line: 1,
                  project: "desktop",
                  kind: "render",
                  status,
                  attempts: state === "flaky" ? 2 : 1,
                },
              ],
            },
          },
        },
      });
    });
    await page.goto("/componentes/button");
    const panel = page.getByRole("region", {
      name: "Confiabilidade do componente",
    });
    const label = {
      passed: "Todos os testes associados passaram",
      failed: "Falhas encontradas",
      flaky: "Testes instáveis",
      stale: "Resultado de uma versão anterior",
      missing: "Sem execução registrada",
      incomplete: "Execução incompleta",
    }[state]!;
    await expect(panel.getByRole("status")).toHaveText(label);
    if (state !== "missing") {
      await expect(
        panel.getByText("1 teste associado", { exact: true }),
      ).toBeVisible();
      await panel.getByText("Ver o que foi testado", { exact: true }).click();
      await expect(
        panel.getByText("Renderização (1)", { exact: true }),
      ).toBeVisible();
      await expect(
        panel.getByText(/Ainda não há testes associados de interação/),
      ).toBeVisible();
    }
  });
}
