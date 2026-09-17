import { afterAll, beforeAll, expect, test } from "bun:test";
import { spawn, type ChildProcess } from "node:child_process";
import { chromium, type Browser } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import catalog from "../site/catalog.json";
import { sourceFingerprint } from "../scripts/reliability/source.mjs";
import type {
  AccessibilityReport,
  AccessibilityRun,
} from "../site/accessibility-report";

let server: ChildProcess;
let browser: Browser;
const port = String(43000 + Math.floor(Math.random() * 10000));
const url = `http://127.0.0.1:${port}`;
const report: AccessibilityReport = {
  generatedAt: new Date().toISOString(),
  fingerprint: sourceFingerprint(),
  engine: "axe-core",
  components: {},
};
beforeAll(async () => {
  server = spawn(
    "node",
    [
      "node_modules/vite/bin/vite.js",
      "--host",
      "127.0.0.1",
      "--port",
      port,
      "--strictPort",
    ],
    {
      env: { ...process.env, VITE_SITE_PASSWORD: "audit-password" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let serverOutput = "";
  server.stderr?.on("data", (chunk) => {
    serverOutput += String(chunk);
  });
  let ready = false;
  for (let attempt = 0; attempt < 200; attempt++) {
    if (server.exitCode !== null)
      throw new Error(`Vite encerrou: ${serverOutput}`);
    try {
      if ((await fetch(url, { signal: AbortSignal.timeout(2000) })).ok) {
        ready = true;
        break;
      }
    } catch {
      /* Aguardar Vite. */
    }
    await Bun.sleep(100);
  }
  if (!ready) throw new Error(`Vite não iniciou: ${serverOutput}`);
  browser = await chromium.launch();
}, 120000);
afterAll(async () => {
  await browser?.close();
  server?.kill();
  await Bun.write(
    process.env.AUDIT_REPORT_PATH ?? "public/component-accessibility.json",
    JSON.stringify(report),
  );
});

// Esta suíte coleta diagnósticos. Violações são publicadas no card, não ocultadas
// por uma asserção que interromperia a coleta dos demais cenários.
for (const { id } of catalog) {
  test(`auditoria de acessibilidade: ${id}`, async () => {
    const runs = await Promise.all(
      [390, 1280].flatMap((width) =>
        ["light", "dark"].map(async (theme) => {
          const run: AccessibilityRun = {
            width,
            theme,
            rules: [],
            textSizes: [],
          };
          const context = await browser.newContext({
            viewport: { width, height: 900 },
            reducedMotion: "reduce",
          });
          try {
            await context.addInitScript(() =>
              sessionStorage.setItem("lai-site-access", "granted"),
            );
            const page = await context.newPage();
            await page.goto(`${url}/componentes/${id}`);
            // Base UI mantém o painel ativo visível; o wrapper isola a demo dos controles do catálogo.
            const preview = page
              .locator(`#example-${id} [role="tabpanel"]:visible > div`)
              .first();
            await preview.waitFor({ state: "visible", timeout: 20000 });
            await preview.evaluate((el) =>
              el.setAttribute("data-accessibility-audit", "true"),
            );
            await page.evaluate((theme) => {
              document.documentElement.classList.toggle(
                "dark",
                theme === "dark",
              );
              document.documentElement.classList.toggle(
                "light",
                theme === "light",
              );
            }, theme);
            await page.addStyleTag({
              content:
                "*, *::before, *::after { transition: none !important; animation: none !important; }",
            });
            await page.evaluate(() => document.fonts.ready);
            const result = await new AxeBuilder({ page })
              .include('[data-accessibility-audit="true"]')
              .withTags([
                "wcag2a",
                "wcag2aa",
                "wcag21a",
                "wcag21aa",
                "wcag22aa",
              ])
              .analyze();
            report.engine = `axe-core ${result.testEngine.version}`;
            for (const [key, status] of [
              ["violations", "failed"],
              ["incomplete", "review"],
              ["passes", "passed"],
              ["inapplicable", "inapplicable"],
            ] as const) {
              run.rules.push(
                ...result[key].map((rule) => ({
                  id: rule.id,
                  title: rule.help,
                  url: rule.helpUrl,
                  status,
                  nodes:
                    status === "failed" || status === "review"
                      ? rule.nodes.map((node) => ({
                          target: node.target.join(" · "),
                          detail:
                            node.failureSummary ?? "Requer inspeção manual.",
                        }))
                      : [],
                })),
              );
            }
            run.textSizes = await preview.evaluate((el) =>
              [
                ...new Set(
                  [...el.querySelectorAll("*")]
                    .filter(
                      (node) =>
                        [...node.childNodes].some(
                          (child) =>
                            child.nodeType === Node.TEXT_NODE &&
                            child.textContent?.trim(),
                        ) && node.getBoundingClientRect().width > 0,
                    )
                    .map((node) =>
                      Number.parseFloat(getComputedStyle(node).fontSize),
                    ),
                ),
              ].sort((a, b) => a - b),
            );
          } catch (error) {
            run.error = String(error);
          } finally {
            await context.close();
          }
          return run;
        }),
      ),
    );
    report.components[id] = runs;
    expect(runs.filter((run) => run.error).map((run) => run.error)).toEqual([]);
  }, 120000);
}
