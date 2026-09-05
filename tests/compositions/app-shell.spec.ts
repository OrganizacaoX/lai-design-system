import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => { await page.goto("/examples/app-shell"); });

test("shell navigation, collapse and mobile drawer", { tag: ["@component:app-shell", "@kind:interaction"] }, async ({ page, isMobile }) => {
  await expect(page.getByRole("heading", { name: "Visão geral", exact: true })).toBeVisible();
  const toggle = page.getByRole("button", { name: "Alternar navegação", exact: true });
  await expect(page.getByRole("main").locator(":scope > header")).toHaveCount(0);
  if (isMobile) {
    const shortcuts = page.getByRole("navigation", { name: "Atalhos de navegação" });
    await expect(shortcuts).toBeVisible();
    await shortcuts.getByRole("link", { name: "Contatos" }).click();
    await expect(page.getByRole("heading", { name: "Contatos", exact: true })).toBeVisible();
    await shortcuts.getByRole("button", { name: "Menu", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Perfil de Ana Silva" })).toBeVisible();
    await dialog.getByRole("link", { name: "Ajuda", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Ajuda", exact: true })).toBeVisible();
    await shortcuts.getByRole("button", { name: "Menu", exact: true }).click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(shortcuts.getByRole("button", { name: "Menu", exact: true })).toBeFocused();
    await shortcuts.getByRole("button", { name: "Menu", exact: true }).click();
    await dialog.getByRole("button", { name: "Alternar navegação", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await shortcuts.getByRole("button", { name: "Menu", exact: true }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Ajuda", exact: true }).click();
    await expect(dialog).toHaveCount(0);
  } else {
    const navigation = page.getByRole("navigation", { name: "Navegação principal", exact: true });
    await navigation.getByRole("link", { name: "Contatos" }).click();
    await expect(navigation.getByRole("link", { name: "Contatos" })).toHaveAttribute("aria-current", "page");
    await expect(page.locator('[data-sidebar="header"]').getByRole("button", { name: "Alternar navegação" })).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await navigation.getByRole("link", { name: "Ajuda" }).click();
    await expect(page.getByRole("heading", { name: "Ajuda", exact: true })).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("shell keyboard skip link and accessibility in both themes", { tag: ["@component:app-shell", "@kind:accessibility"] }, async ({ page }) => {
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pular para o conteúdo" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator('[tabindex="-1"]').filter({ has: page.getByRole("heading", { name: "Visão geral", exact: true }) })).toBeFocused();
  for (const dark of [false, true]) {
    await page.evaluate(async dark => {
      document.documentElement.classList.toggle("dark", dark);
      // Audit the selected palette after CSS color transitions finish, rather
      // than a transient foreground from the previous theme on the new surface.
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      await Promise.allSettled(document.getAnimations()
        .filter(animation => animation.effect?.getTiming().iterations !== Infinity)
        .map(animation => animation.finished));
    }, dark);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
  }
});

test("shell controlled state, drawer-only mode and wide content", { tag: ["@component:app-shell", "@kind:interaction"] }, async ({ page, isMobile }) => {
  await page.goto("/tests/fixtures/app-shell/index.html");
  const toggle = page.getByRole("button", { name: "Toggle navigation", exact: true });
  await expect(page.getByRole("navigation", { name: "Atalhos de navegação" })).toHaveCount(0);
  await expect(page.getByText("Hidden group")).toHaveCount(0);
  await page.getByRole("button", { name: "External toggle" }).click();
  await expect(page.getByLabel("Sidebar state")).toHaveText("open");
  await toggle.click();
  if (isMobile) {
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("link", { name: "Home", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  } else {
    await expect(page.getByLabel("Sidebar state")).toHaveText("closed");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("shell expandable groups select subitems and reveal the collapsed sidebar", { tag: ["@component:app-shell", "@kind:interaction"] }, async ({ page, isMobile }) => {
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  if (isMobile) await menu.click();
  const nav = page.getByRole("navigation", { name: "Navegação principal", exact: true });
  await nav.getByRole("link", { name: "Novos leads", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Novos leads", exact: true })).toBeVisible();
  if (isMobile) {
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await menu.click();
  } else {
    await page.getByRole("button", { name: "Alternar navegação", exact: true }).click();
  }
  const group = nav.getByRole("button", { name: "Administração", exact: true });
  await group.click();
  await expect(group).toHaveAttribute("aria-expanded", "true");
  await expect(nav.getByRole("link", { name: "Permissões", exact: true })).toBeVisible();
  await group.click();
  await expect(nav.getByRole("link", { name: "Permissões", exact: true })).toBeHidden();
  await group.focus();
  await page.keyboard.press("Enter");
  await nav.getByRole("link", { name: "Permissões", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Permissões", exact: true })).toBeVisible();
  if (isMobile) await expect(page.getByRole("dialog")).toHaveCount(0);
  else await expect(nav.getByRole("link", { name: "Permissões", exact: true })).toHaveAttribute("aria-current", "page");
});
