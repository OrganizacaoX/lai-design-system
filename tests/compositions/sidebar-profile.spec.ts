import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page, isMobile }) => {
  await page.goto("/examples/app-shell");
  if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
});

test("profile standard actions, keyboard and collapsed sidebar", { tag: ["@component:sidebar-profile", "@kind:interaction"] }, async ({ page, isMobile }) => {
  const trigger = page.getByRole("button", { name: "Perfil de Ana Silva" });
  if (!isMobile) await page.getByRole("button", { name: "Alternar navegação", exact: true }).click();
  await trigger.focus();
  await page.keyboard.press("Enter");
  for (const name of ["Meu perfil", "Trocar organização", "Instalar aplicativo", "Tema", "Idioma", "Sair"]) {
    await expect(page.getByRole("menuitem", { name, exact: true })).toBeVisible();
  }
  await expect(page.getByRole("menu").first().getByText("ana@exemplo.com")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("menuitem", { name: "Meu perfil", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Meu perfil", exact: true })).toBeVisible();
});

test("profile controlled theme and language selections", { tag: ["@component:sidebar-profile", "@kind:accessibility"] }, async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Perfil de Ana Silva" });
  await trigger.click();
  const theme = page.getByRole("menuitem", { name: "Tema", exact: true });
  await theme.focus();
  await page.keyboard.press("ArrowRight");
  await page.getByRole("menuitemradio", { name: "Escuro", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("menuitemradio", { name: "Escuro", exact: true })).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("Escape");
  await page.getByRole("menuitem", { name: "Idioma", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await page.getByRole("menuitemradio", { name: "English", exact: true }).click();
  await expect(page.getByRole("menuitemradio", { name: "English", exact: true })).toHaveAttribute("aria-checked", "true");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("profile optional actions, links, avatar fallback and pending sign out", { tag: ["@component:sidebar-profile", "@kind:interaction"] }, async ({ page, isMobile }) => {
  await page.goto("/tests/fixtures/app-shell/index.html");
  if (isMobile) await page.getByRole("button", { name: "Toggle navigation", exact: true }).click();
  const trigger = page.getByRole("button", { name: "Account", exact: true });
  await expect(trigger.getByText("AS", { exact: true })).toBeVisible();
  await trigger.click();
  await expect(page.getByRole("menuitem", { name: "Tema", exact: true })).toHaveCount(0);
  await expect(page.getByRole("menuitem", { name: "Instalar aplicativo", exact: true })).toHaveCount(0);
  await expect(page.getByRole("menuitem", { name: "Trocar organização", exact: true })).toHaveAttribute("aria-disabled", "true");
  await page.getByRole("menuitem", { name: "Profile", exact: true }).click();
  await expect(page).toHaveURL(/#profile$/);
  await trigger.click();
  await page.getByRole("menuitem", { name: "Sign out", exact: true }).click();
  await expect(page.getByLabel("Sign out attempts")).toHaveText("1");
  await trigger.click();
  await expect(page.getByRole("menuitem", { name: "Signing out", exact: true })).toHaveAttribute("aria-disabled", "true");
  await expect(page.getByRole("menuitem", { name: "Signing out", exact: true })).toHaveAttribute("aria-busy", "true");
});
