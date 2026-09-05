// Tests the published artifact in isolation: only LAI + React and build tooling.
import assert from "node:assert/strict";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, extname, resolve } from "node:path";
import { execFileSync, spawn } from "node:child_process";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";
const root = process.cwd();
const temp = mkdtempSync(join(tmpdir(), "lai-app-consumer-"));
const run = (cmd, args) => execFileSync(cmd, args, { cwd: temp, stdio: "inherit" });
let server, browser, devServer;
try {
  cpSync(join(root, "tests/fixtures/app-base"), temp, { recursive: true });
  const [pack] = JSON.parse(execFileSync("npm", ["pack", "--json", "--pack-destination", temp], { cwd: root, encoding: "utf8" }));
  writeFileSync(join(temp, "package.json"), JSON.stringify({ name: "lai-app-consumer", private: true, type: "module" }));
  run("npm", ["install", "--no-audit", "--no-fund", "--install-strategy=nested", join(temp, pack.filename), "react@19", "react-dom@19", "vite", "typescript", "@types/react", "@types/react-dom", "@types/node"]);
  const installed = JSON.parse(readFileSync(join(temp, "package.json"), "utf8"));
  assert(!Object.keys(installed.dependencies).some((name) => /^(zustand|i18next|react-i18next|@tanstack\/|@better-fetch\/)/.test(name)));
  for (const name of ["@tanstack/react-query", "@tanstack/react-router", "@better-fetch/fetch", "zustand", "i18next", "react-i18next", "@tanstack/react-table", "@tanstack/react-form", "zod", "@dnd-kit/core", "@tanstack/react-virtual", "better-auth", "posthog-js", "driver.js", "@testing-library/react", "@tanstack/ai-react", "@shadcn/helpers"]) {
    assert(!existsSync(join(temp, "node_modules", name)), `Dependency must stay inside LAI: ${name}`);
  }
  writeFileSync(join(temp, "src/routes/generated.tsx"), "");
  run("npx", ["vite", "build"]);
  const scaffold = readFileSync(join(temp, "src/routes/generated.tsx"), "utf8");
  assert(scaffold.includes("@organizacaox/lai-design-system/router"));
  assert(!scaffold.includes("@tanstack/react-router"));
  const generated = readFileSync(join(temp, "src/routeTree.gen.ts"), "utf8");
  assert(generated.includes('declare module \'@organizacaox/lai-design-system/router\''));
  assert(!generated.includes("@tanstack/react-router"));
  run("npx", ["tsc", "--noEmit"]);
  cpSync(join(root, "tests/app-vite-dev.mjs"), join(temp, "vite-dev.mjs"));
  run("node", ["vite-dev.mjs"]);
  cpSync(join(root, "tests/app-runtime.mjs"), join(temp, "runtime.mjs"));
  cpSync(join(root, "tests/app-i18n-runtime.mjs"), join(temp, "i18n-runtime.mjs"));
  cpSync(join(root, "tests/app-platform-runtime.mjs"), join(temp, "platform-runtime.mjs"));
  run("node", ["--test", "runtime.mjs", "i18n-runtime.mjs", "platform-runtime.mjs"]);

  let contact = { id: "1", name: "Ana" };
  const requests = [];
  server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname.startsWith("/telemetry/")) { res.setHeader("Content-Type", "application/json"); res.end("{}"); return; }
    if (url.pathname === "/api/auth/get-session") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ session: { id: "local", token: "fixture", userId: "1", expiresAt: "2099-01-01T00:00:00.000Z", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" }, user: { id: "1", name: "Local user", email: "ana@example.test", emailVerified: true, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" } })); return;
    }
    if (url.pathname.startsWith("/api/")) {
      requests.push(`${req.method} ${url.pathname}${url.search}`);
      res.setHeader("Content-Type", "application/json");
      if (url.pathname === "/api/contacts") {
        res.end(JSON.stringify(contact.name.toLowerCase().includes((url.searchParams.get("q") ?? "").toLowerCase()) ? [contact] : []));
      } else if (url.pathname === "/api/contacts/1") {
        if (req.method === "PATCH") {
          let body = "";
          for await (const chunk of req) body += chunk;
          contact = { ...contact, name: JSON.parse(body).name };
        }
        res.end(JSON.stringify(contact));
      } else { res.statusCode = 404; res.end(JSON.stringify({ message: "Não encontrado" })); }
      return;
    }
    const dist = join(temp, "dist");
    let file = resolve(dist, `.${url.pathname}`);
    if (!file.startsWith(dist + "/") || !existsSync(file) || url.pathname === "/") file = join(dist, "index.html");
    res.setHeader("Content-Type", ({ ".js": "text/javascript", ".css": "text/css", ".html": "text/html" })[extname(file)] ?? "application/octet-stream");
    res.end(readFileSync(file));
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch();
  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    contact = { id: "1", name: "Ana" };
    requests.length = 0;
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin);
    await expect(page.getByRole("link", { name: "Ana", exact: true })).toBeVisible();
    assert.equal(requests.filter((r) => r.startsWith("GET /api/contacts?")).length, 1, "Loader and hook share Query cache");
    await page.getByRole("textbox", { name: "Rascunho" }).fill("Preferência local");
    await page.reload();
    await expect(page.getByRole("textbox", { name: "Rascunho" })).toHaveValue("Preferência local");
    await page.getByRole("textbox", { name: "Buscar contatos" }).fill("Ana");
    await expect(page).toHaveURL(/q=Ana/);
    await page.getByRole("link", { name: "Ana", exact: true }).click();
    await expect(page).toHaveURL(/\/contacts\/1/);
    await page.getByRole("textbox", { name: "Nome", exact: true }).fill("Ana Maria");
    await page.getByRole("button", { name: "Salvar", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("Contato salvo");
    await page.getByRole("link", { name: "Voltar à lista" }).click();
    await expect(page.getByRole("link", { name: "Ana Maria", exact: true })).toBeVisible();
    assert.equal(requests.filter((r) => r === "PATCH /api/contacts/1").length, 1);
    await page.getByRole("button", { name: "Encerrar sessão de exemplo" }).click();
    await expect(page.getByRole("status")).toContainText("Sessão encerrada");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("lai-app-example-draft"))).toBeNull();
    await page.goto(`${origin}/missing`);
    await expect(page.getByRole("status")).toContainText("Página não encontrada");
    await page.goto(`${origin}/contacts/404`);
    await expect(page.getByRole("alert")).toContainText("Não foi possível carregar esta página");
    const failedRequests = requests.filter((r) => r === "GET /api/contacts/404").length;
    assert.equal(failedRequests, 1, "404 is not retried automatically");
    await page.getByRole("button", { name: "Tentar novamente" }).click();
    await expect.poll(() => requests.filter((r) => r === "GET /api/contacts/404").length).toBe(2);
    await expect(page.getByRole("alert")).toContainText("Não foi possível carregar esta página");
    await page.goto(`${origin}/features`);
    await expect(page.getByRole("heading", { name: "Internacionalização", exact: true })).toBeVisible();
    await page.getByRole("combobox", { name: "Language" }).selectOption("en");
    await expect(page.getByRole("heading", { name: "Internationalization", exact: true })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByTestId("interpolation")).toHaveText("Hello, Ana");
    await expect(page.getByTestId("plural")).toHaveText("2 items");
    await expect(page.getByTestId("number")).toHaveText("1,234.5");
    await expect(page.getByTestId("isolated")).toHaveText("Internacionalización");
    const defaults = page.getByRole("region", { name: "Defaults", exact: true });
    await expect(defaults.getByRole("button", { name: "Next page", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Custom next", exact: true })).toBeVisible();
    await defaults.getByRole("checkbox", { name: "Select row 1", exact: true }).check();
    await expect(defaults.getByText("1 selected", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Range:/ })).toContainText("Jan");
    await page.getByRole("button", { name: /^Range:/ }).click();
    await expect(page.getByRole("button", { name: "Today", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Clear date range", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Open dialog", exact: true }).click();
    await page.getByRole("button", { name: "Close", exact: true }).click();
    const tableRegion = page.getByRole("region", { name: "TanStack Table", exact: true });
    await expect(tableRegion.getByRole("cell")).toHaveText(["Bruno", "Ana"]);
    await tableRegion.getByRole("button", { name: "Sort ascending" }).click();
    await expect(tableRegion.getByRole("cell")).toHaveText(["Ana", "Bruno"]);
    await tableRegion.getByRole("button", { name: "Next table page" }).click();
    await expect(tableRegion.getByRole("cell")).toHaveText(["Carla"]);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Internationalization", exact: true })).toBeVisible();
    await page.getByRole("combobox", { name: "Language" }).selectOption("es");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(defaults.getByRole("button", { name: "Página siguiente", exact: true })).toBeVisible();
    await page.getByRole("button", { name: /^Range:/ }).click();
    await expect(page.getByRole("button", { name: "Ir al mes siguiente", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.goto(`${origin}/platform`);
    await expect(page.getByRole("heading", { name: "Platform integrations" })).toBeVisible();
    await page.getByRole("textbox", { name: "Customer name" }).fill("A");
    await page.getByRole("textbox", { name: "Customer name" }).blur();
    await expect(page.getByRole("alert")).toContainText("Informe ao menos 3 caracteres");
    await page.getByRole("textbox", { name: "Customer name" }).fill("Admin");
    await page.getByRole("button", { name: "Save platform form" }).click();
    await expect(page.getByRole("alert")).toContainText("Nome reservado pela API");
    await page.getByRole("textbox", { name: "Customer name" }).fill("Ana Maria");
    await page.getByRole("button", { name: "Save platform form" }).click();
    await expect(page.getByTestId("saved")).toHaveText("Ana Maria");
    const sortable = page.getByRole("list", { name: "People order" });
    for (const [key, position, order] of [
      ["ArrowDown", "2/3", ["⠿Bruno", "⠿Ana", "⠿Carla"]],
      ["ArrowUp", "1/3", ["⠿Ana", "⠿Bruno", "⠿Carla"]],
      ["ArrowDown", "2/3", ["⠿Bruno", "⠿Ana", "⠿Carla"]],
    ]) {
      await sortable.getByRole("button", { name: "Move Ana" }).focus();
      await page.keyboard.press("Space");
      await expect(sortable.getByRole("button", { name: "Move Ana" })).toHaveAttribute("aria-pressed", "true");
      // KeyboardSensor defers its keydown listener with setTimeout(0), while
      // droppable measurements settle on render. aria-pressed alone is too early.
      // Let activation paint before sending the next distinct keyboard action.
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
      await page.keyboard.press(key);
      await expect(page.locator('[id^="DndLiveRegion"]')).toContainText(position);
      await page.keyboard.press("Space");
      await expect(sortable.getByRole("listitem")).toHaveText(order);
    }
    const virtual = page.getByRole("list", { name: "Virtual people" });
    assert(await virtual.getByRole("listitem").count() < 30);
    await virtual.evaluate(element => { element.scrollTop = element.scrollHeight; });
    await expect(virtual.getByText("Item 999", { exact: true })).toBeVisible();
    assert(await virtual.getByRole("listitem").count() < 30);
    await page.getByRole("button", { name: "Load session" }).click();
    await expect(page.getByTestId("auth")).toHaveText("Local user");
    await page.getByRole("button", { name: "Test analytics" }).click();
    await expect(page.getByTestId("analytics")).toHaveText("platform_clicked");
    await page.getByRole("button", { name: "Start tour" }).click();
    await expect(page.getByText("LAI tour", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Finalizar", exact: true }).click();
    await expect(page.getByText("LAI tour", { exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Run AI fixture" }).click();
    await expect(page.locator('[data-role="assistant"] [data-part="text"]')).toHaveText("Integração pronta.");
    await expect(page.locator('[data-role="assistant"] [data-part="thinking"]')).toHaveText("Verificando a base.");
    await expect(page.locator('[data-part="tool-result"]')).toContainText("true");
    assert.deepEqual(errors, []);
    await context.close();
  }
  // Testing Library uses React act, so exercise the kit with the development build.
  const devPort = server.address().port;
  await new Promise(done => server.close(done));
  server = undefined;
  devServer = spawn(process.execPath, [join(temp, "node_modules/vite/bin/vite.js"), "--host", "127.0.0.1", "--port", String(devPort), "--strictPort"], { cwd: temp, stdio: "inherit" });
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch(origin)).ok) { ready = true; break; } } catch {}
    if (devServer.exitCode !== null) throw new Error("Vite dev server exited");
    await new Promise(done => setTimeout(done, 100));
  }
  assert(ready, "Development consumer must start");
  const kitContext = await browser.newContext();
  const kitPage = await kitContext.newPage();
  const kitErrors = [];
  kitPage.on("pageerror", error => kitErrors.push(error.message));
  await kitPage.goto(`${origin}/platform`);
  await kitPage.getByRole("button", { name: "Test render kit" }).click();
  await expect(kitPage.getByTestId("kit")).toHaveText("isolated and cleaned");
  await expect(kitPage.locator("html")).toHaveAttribute("lang", "pt-BR");
  assert.deepEqual(kitErrors, []);
  await kitContext.close();
  console.log("LAI app: isolated install, generated routes, strict types, runtime contracts and desktop/mobile browser flows passed.");
} finally {
  await browser?.close();
  if (devServer && devServer.exitCode === null) {
    const stopped = new Promise(done => devServer.once("exit", done));
    devServer.kill("SIGTERM"); await stopped;
  }
  if (server) await new Promise((done) => server.close(done));
  rmSync(temp, { recursive: true, force: true });
}
