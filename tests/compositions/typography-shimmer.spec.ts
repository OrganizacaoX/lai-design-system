import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => { await page.goto("/tests/fixtures/typography/index.html"); });

test("typography readable at narrow widths with native semantics and refs", { tag: ["@component:typography", "@kind:accessibility"] }, async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Uma linguagem compartilhada");
  await page.getByRole("button", { name: "Focar texto" }).click();
  await expect(page.locator("#override")).toBeFocused();
  await expect(page.locator("#override")).toHaveCSS("margin-top", "0px");
  await expect(page.getByRole("table")).toHaveAccessibleName("Exemplos de aplicação da hierarquia tipográfica.");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const dark of [false, true]) {
    await page.evaluate(dark => document.documentElement.classList.toggle("dark", dark), dark);
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  }
});

test("shimmer animation, completion, RTL and reduced motion", { tag: ["@component:shimmer", "@kind:interaction"] }, async ({ page }) => {
  const status = page.getByRole("status");
  await expect(status).toHaveCSS("animation-name", "tw-shimmer");
  await expect(status).toHaveCSS("animation-duration", "3.5s");
  await expect(page.getByTestId("rtl")).toHaveCSS("animation-direction", "reverse");
  await page.getByRole("button", { name: "Alternar efeito" }).click();
  await expect(status).toHaveText("Resposta concluída");
  await expect(status).toHaveCSS("animation-name", "none");
  await page.getByRole("button", { name: "Alternar efeito" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(status).toHaveCSS("animation-name", "none");
  await expect(status).toHaveCSS("background-image", "none");
  const colors = await status.evaluate(el => { const css = getComputedStyle(el); return [css.color, css.webkitTextFillColor]; });
  expect(colors[0]).toBe(colors[1]);
});
