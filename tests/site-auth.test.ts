import { afterAll, beforeAll, expect, test } from "bun:test";
import { spawn, type ChildProcess } from "node:child_process";
import { chromium, type Browser } from "@playwright/test";

const servers: ChildProcess[] = [];
let browser: Browser;
const configured = "http://127.0.0.1:4298";
const unconfigured = "http://127.0.0.1:4299";

beforeAll(async () => {
  for (const [port, password] of [
    [4298, "test-site-password"],
    [4299, ""],
  ] as const) {
    servers.push(
      spawn(
        process.execPath,
        [
          "node_modules/vite/bin/vite.js",
          "--host",
          "127.0.0.1",
          "--port",
          String(port),
          "--strictPort",
        ],
        {
          env: { ...process.env, VITE_SITE_PASSWORD: password },
          stdio: "ignore",
        },
      ),
    );
    const url = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        if ((await fetch(url)).ok) {
          ready = true;
          break;
        }
      } catch {
        /* Aguardar o servidor iniciar. */
      }
      await Bun.sleep(100);
    }
    if (!ready) throw new Error(`Servidor indisponível: ${url}`);
  }
  browser = await chromium.launch();
}, 30000);

afterAll(async () => {
  await browser?.close();
  for (const server of servers) server.kill();
});

test("protege links diretos, valida a senha e mantém apenas a sessão da aba", async () => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(`${configured}/componentes/button`);
    await page.getByRole("heading", { name: "Acesso restrito" }).waitFor();
    expect(await page.locator("#example-button").count()).toBe(0);
    await page.getByLabel("Senha", { exact: true }).fill("incorreta");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await page.getByRole("alert").waitFor();
    expect(await page.getByRole("alert").textContent()).toContain(
      "Senha incorreta",
    );
    await page.getByLabel("Senha", { exact: true }).fill("test-site-password");
    await page.getByLabel("Senha", { exact: true }).press("Enter");
    await page.locator("#example-button").waitFor();
    await page.reload();
    await page.locator("#example-button").waitFor();
    const freshTab = await context.newPage();
    await freshTab.goto(`${configured}/examples/app-shell`);
    await freshTab.getByRole("heading", { name: "Acesso restrito" }).waitFor();
    expect(
      await freshTab.getByLabel("Senha", { exact: true }).inputValue(),
    ).toBe("");
  } finally {
    await context.close();
  }
}, 30000);

test("sem variável de ambiente, permanece bloqueado", async () => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto(unconfigured);
    await page.getByRole("alert").waitFor();
    expect(await page.getByRole("alert").textContent()).toContain(
      "Acesso indisponível",
    );
    expect(
      await page.getByRole("button", { name: "Entrar" }).isDisabled(),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  } finally {
    await context.close();
  }
}, 30000);
