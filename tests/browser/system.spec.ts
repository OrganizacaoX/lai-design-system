import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const theme of ["light", "dark"]) {
  test(`fundamentos, densidade e acessibilidade ${theme}`, async ({ page }) => {
    await page.addInitScript(
      (theme) => localStorage.setItem("lai-theme", theme),
      theme,
    );
    await page.goto("/fundamentos");
    await expect(
      page.getByRole("heading", { name: "Fundamentos", exact: true }),
    ).toBeVisible();
    const input = page.getByRole("textbox", { name: "Nome de exemplo" });
    await expect(input).toHaveCSS("height", "44px");
    await page.getByRole("button", { name: "Compacta", exact: true }).click();
    await expect(input).toHaveCSS("height", "36px");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
test("URL direta, recarga e histórico", async ({ page }) => {
  await page.goto("/componentes/button");
  await expect(
    page.getByRole("heading", { name: "Button", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Exemplo", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Button", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Todos os componentes", exact: true })
    .click();
  await page
    .getByRole("main")
    .getByRole("link", { name: /Input & Label/ })
    .click();
  await expect(page).toHaveURL(/componentes\/input$/);
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Componentes", exact: true }),
  ).toBeVisible();
});
test(
  "formulário valida, foca e envia",
  { tag: ["@component:validated-form", "@kind:interaction"] },
  async ({ page }) => {
    await page.goto("/componentes/validated-form");
    await page.getByRole("button", { name: "Salvar", exact: true }).click();
    await expect(page.getByLabel("Nome", { exact: true })).toBeFocused();
    await expect(
      page.getByText("Informe seu nome.", { exact: true }),
    ).toBeVisible();
    await page.getByLabel("Nome", { exact: true }).fill("Ana");
    await page.getByLabel("E-mail", { exact: true }).fill("ana@example.com");
    await page.getByRole("button", { name: "Salvar", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Salvando…", exact: true }),
    ).toBeDisabled();
    await expect(
      page.locator("#example-validated-form").getByRole("status"),
    ).toHaveText("Alterações salvas.");
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  },
);
test(
  "listagem busca, estados e recuperação",
  {
    tag: ["@component:data-list", "@component:filter-bar", "@kind:interaction"],
  },
  async ({ page }) => {
    await page.goto("/componentes/data-list");
    await page.getByRole("searchbox", { name: "Buscar registros" }).fill("Ana");
    await expect(
      page.getByRole("list", { name: "Resultados" }).getByRole("listitem"),
    ).toHaveCount(1);
    await page.getByRole("button", { name: "Erro", exact: true }).click();
    await expect(page.getByRole("alert")).toHaveText(
      "Falha ao buscar os contatos.",
    );
    await page.getByRole("button", { name: "Tentar novamente" }).click();
    await expect(page.getByRole("list", { name: "Resultados" })).toBeVisible();
    await page.getByRole("button", { name: "Vazio", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Nenhum resultado" }),
    ).toBeVisible();
  },
);
test(
  "seletor de período abre e fecha com teclado",
  { tag: ["@component:date-range-picker", "@kind:interaction"] },
  async ({ page, isMobile }) => {
    await page.goto("/componentes/date-range-picker");
    const trigger = page.getByRole("button", { name: /^Selecionar período/ });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("button", { name: "Hoje", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("grid")).toHaveCount(isMobile ? 1 : 2);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.getByRole("button", { name: "Hoje", exact: true }).click();
    await expect(page.getByRole("grid")).toHaveCount(0);
  },
);
test(
  "diálogo preserva foco e seleção funciona pelo teclado",
  { tag: ["@component:dialog", "@component:select", "@kind:interaction"] },
  async ({ page }) => {
    await page.goto("/componentes/dialog");
    const demo = page.locator("#example-dialog");
    const trigger = demo.getByRole("button").first();
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await page.goto("/componentes/select");
    const select = page.locator("#example-select").getByRole("combobox");
    await select.focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("listbox")).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await expect(select).toBeFocused();
  },
);
test("busca acessível e tema persistido", async ({ page }) => {
  await page.goto("/componentes");
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: "Buscar" })).toBeVisible();
  await page.getByRole("combobox").fill("Validated Form");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/validated-form$/);
  await page.getByRole("button", { name: "Ativar tema escuro" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
test(
  "período respeita idioma e limites em atalhos",
  { tag: ["@component:date-range-picker", "@kind:interaction"] },
  async ({ page }) => {
    await page.goto("/componentes/date-range-picker");
    const picker = page.getByRole("button", {
      name: /^Choose reporting dates/,
    });
    await picker.click();
    await expect(
      page.getByRole("button", { name: "Outside limits", exact: true }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "January", exact: true }).click();
    await expect(picker).toContainText("Jan 1, 2030 – Jan 31, 2030");
    await expect(page.getByRole("grid")).toHaveCount(0);
  },
);
