import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => { await page.goto("/tests/fixtures/app-update/index.html"); });

test("card anuncia a versão nova sem interromper o app", { tag: ["@component:app-update-card", "@kind:interaction"] }, async ({ page }) => {
  const card = page.getByRole("status").filter({ hasText: "Nova versão disponível" });
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute("aria-live", "polite");
  await expect(card).toContainText("Atualize quando for conveniente");
  await page.getByRole("button", { name: "Atualizar agora", exact: true }).click();
  await expect(page.getByLabel("Updates", { exact: true })).toHaveText("1");
  // O app segue utilizável embaixo do card: nada de overlay bloqueando a tela.
  await page.getByRole("button", { name: "Alternar textos", exact: true }).click();
  await expect(card).toContainText("Atualizar agora interrompe a ligação.");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("tela mostra o progresso e oferece saída quando a atualização falha", { tag: ["@component:app-update-card", "@kind:interaction"] }, async ({ page }) => {
  await page.getByRole("button", { name: "Tela atualizando", exact: true }).click();
  const screen = page.getByRole("status").filter({ hasText: "Atualizando para a nova versão" });
  await expect(screen).toBeVisible();
  await expect(screen).toHaveAttribute("aria-live", "polite");
  await expect(page.getByText("Isso leva alguns segundos.")).toBeVisible();
  await expect(page.getByTestId("brand")).toBeVisible();
  await expect(page.getByRole("button", { name: "Tentar novamente", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Tela falha", exact: true }).click();
  await expect(page.getByText("Não foi possível atualizar")).toBeVisible();
  await expect(page.getByText("Verifique sua conexão e tente novamente.")).toBeVisible();
  // A marca fica nas duas variantes: uma tela cheia sem ela parece página de
  // terceiro travando o app. A descrição é só do progresso.
  await expect(page.getByTestId("brand")).toBeVisible();
  await expect(page.getByText("Isso leva alguns segundos.")).toHaveCount(0);
  // Sem onClearCache não existe segundo botão: dois rótulos para a mesma saída confundem.
  await expect(page.getByRole("button", { name: "Limpar cache e reiniciar", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Tentar novamente", exact: true }).click();
  await expect(page.getByLabel("Retries", { exact: true })).toHaveText("1");
  await page.getByRole("button", { name: "Alternar limpar cache", exact: true }).click();
  await page.getByRole("button", { name: "Limpar cache e reiniciar", exact: true }).click();
  await expect(page.getByLabel("Cleared", { exact: true })).toHaveText("1");
});

test("card e tela acessíveis nos dois temas", { tag: ["@component:app-update-card", "@kind:accessibility"] }, async ({ page }) => {
  for (const dark of [false, true]) {
    for (const state of ["none", "failed"] as const) {
      if (state === "failed") await page.getByRole("button", { name: "Tela falha", exact: true }).click();
      else await page.getByRole("button", { name: "Fechar tela", exact: true }).click();
      await page.evaluate(async dark => {
        document.documentElement.classList.toggle("dark", dark);
        // Audita a paleta final, não uma cor de transição do tema anterior.
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        await Promise.allSettled(document.getAnimations()
          .filter(animation => animation.effect?.getTiming().iterations !== Infinity)
          .map(animation => animation.finished));
      }, dark);
      expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    }
  }
});
