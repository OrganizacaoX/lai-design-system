import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

test(
  "playground sincroniza estado, código, densidade e tema",
  { tag: ["@component:button", "@kind:interaction"] },
  async ({ page }) => {
    await page.goto("/componentes/button");
    const area = page.getByRole("region", { name: "Playground", exact: true });
    await area
      .getByRole("combobox", { name: "Variante", exact: true })
      .selectOption("outline");
    await area
      .getByRole("combobox", { name: "Tamanho", exact: true })
      .selectOption("lg");
    await area
      .getByRole("combobox", { name: "Densidade", exact: true })
      .selectOption("compact");
    await area
      .getByRole("combobox", { name: "Estado", exact: true })
      .selectOption("loading");
    const preview = area.getByTestId("playground-preview");
    await expect(
      preview.getByRole("button", { name: "Salvando…" }),
    ).toBeDisabled();
    await expect(preview.getByRole("button")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await expect(area.locator("pre")).toContainText(
      'variant="outline" size="lg" loading',
    );
    await area
      .getByRole("combobox", { name: "Tema do playground", exact: true })
      .selectOption("dark");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await area
      .getByRole("combobox", { name: "Estado", exact: true })
      .selectOption("default");
    await expect(preview.getByRole("button")).toBeEnabled();
    await area
      .getByRole("combobox", { name: "Tamanho", exact: true })
      .selectOption("default");
    await expect(preview.getByRole("button")).toHaveCSS("height", "36px");
  },
);

test(
  "personalização exporta os tokens mostrados na prévia",
  { tag: ["@component:button", "@kind:integration"] },
  async ({ page }) => {
    await page.goto("/fundamentos");
    const area = page.getByRole("region", { name: "Personalização visual" });
    await area.getByLabel("Cor da marca").fill("#112233");
    await area
      .getByRole("combobox", { name: "Raio", exact: true })
      .selectOption("1");
    await area
      .getByRole("combobox", { name: "Densidade da marca", exact: true })
      .selectOption("compact");
    await area
      .getByRole("combobox", { name: "Fonte", exact: true })
      .selectOption("system-ui");
    const preview = area.getByTestId("theme-preview");
    await expect(
      preview.getByRole("button", { name: "Salvar projeto" }),
    ).toHaveCSS("height", "36px");
    await expect(
      preview.getByRole("button", { name: "Salvar projeto" }),
    ).toHaveCSS("background-color", "rgb(17, 34, 51)");
    const downloadPromise = page.waitForEvent("download");
    await area.getByRole("button", { name: "Baixar tema CSS" }).click();
    const download = await downloadPromise;
    const css = readFileSync((await download.path())!, "utf8");
    expect(css).toContain("--primary: #112233;");
    expect(css).toContain("--primary-foreground: #ffffff;");
    expect(css).toContain("--radius: 1rem;");
    expect(css).toContain("--font-sans: system-ui, sans-serif;");
  },
);

test(
  "fluxo de contatos oferece detalhes, edição, confirmação e recuperação",
  {
    tag: [
      "@component:data-table",
      "@component:validated-form",
      "@component:dialog",
      "@component:filter-bar",
      "@kind:integration",
    ],
  },
  async ({ page }) => {
    await page.goto("/fundamentos");
    const flow = page.getByRole("region", {
      name: "Fluxo completo de contatos",
    });
    const open = flow.getByRole("button", {
      name: "Ver contato 1",
      exact: true,
    });
    await open.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("button", { name: "Fechar detalhes", exact: true }),
    ).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: "Detalhes do contato" }),
    ).toBeVisible();
    await dialog
      .getByRole("button", { name: "Editar contato", exact: true })
      .click();
    await dialog.getByLabel("Nome do contato", { exact: true }).fill("");
    await dialog.getByRole("button", { name: "Salvar", exact: true }).click();
    await expect(
      dialog.getByLabel("Nome do contato", { exact: true }),
    ).toBeFocused();
    await dialog
      .getByLabel("Nome do contato", { exact: true })
      .fill("Ana Atualizada");
    await dialog.getByRole("button", { name: "Salvar", exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(
      flow.getByRole("cell", { name: "Ana Atualizada", exact: true }),
    ).toBeVisible();
    await expect(
      flow.getByRole("heading", { name: "Padrão de gestão de contatos" }),
    ).toBeFocused();
    await open.click();
    await dialog
      .getByRole("button", { name: "Excluir contato", exact: true })
      .click();
    await dialog.getByRole("button", { name: "Manter contato" }).click();
    await expect(
      dialog.getByText("Ana Atualizada", { exact: true }),
    ).toBeVisible();
    await dialog
      .getByRole("button", { name: "Excluir contato", exact: true })
      .click();
    await dialog.getByRole("button", { name: "Confirmar exclusão" }).click();
    await expect(dialog).toBeHidden();
    await expect(
      flow.getByRole("cell", { name: "Ana Atualizada", exact: true }),
    ).toHaveCount(0);
    await flow
      .getByLabel("Buscar contatos", { exact: true })
      .fill("inexistente");
    await expect(flow.getByText("Nenhum contato encontrado")).toBeVisible();
    await flow
      .getByRole("button", { name: "Limpar busca", exact: true })
      .click();
    await expect(
      flow.getByRole("cell", { name: "Bruno Lima", exact: true }),
    ).toBeVisible();
  },
);

test(
  "seleção e painéis respeitam movimento reduzido",
  {
    tag: [
      "@component:checkbox",
      "@component:collapsible",
      "@kind:accessibility",
    ],
  },
  async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/componentes/checkbox");
    const check = page.locator("#example-checkbox").getByRole("checkbox");
    await check.focus();
    await page.keyboard.press("Space");
    await expect(check).not.toBeChecked();
    await page.keyboard.press("Space");
    await expect(check).toBeChecked();
    await expect(
      page.locator('[data-slot="checkbox-indicator"]').first(),
    ).toHaveCSS("animation-duration", "1e-05s");
    await page.goto("/componentes/collapsible");
    const trigger = page.locator('[data-slot="collapsible-trigger"]');
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.locator('[data-slot="collapsible-content"]'),
    ).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(
      page.locator('[data-slot="collapsible-content"]'),
    ).toBeHidden();
  },
);

test(
  "feedback de erro permite recuperar e anuncia o resultado",
  { tag: ["@component:status-panel", "@kind:interaction"] },
  async ({ page }) => {
    await page.goto("/componentes/status-panel");
    const example = page.locator("#example-status-panel");
    await example
      .getByRole("combobox", { name: "Estado do feedback", exact: true })
      .selectOption("error");
    await expect(example.getByRole("alert")).toContainText(
      "Não foi possível carregar",
    );
    await example
      .getByRole("button", { name: "Tentar novamente", exact: true })
      .click();
    await expect(example.getByRole("status")).toContainText(
      "Registros carregados",
    );
    await example
      .getByRole("combobox", { name: "Estado do feedback", exact: true })
      .selectOption("unavailable");
    await expect(example.getByRole("status")).toContainText(
      "Seu perfil não tem acesso",
    );
  },
);

for (const id of ["input", "select"]) {
  test(
    `playground ${id}: erro acessível e controle desabilitado`,
    { tag: [`@component:${id}`, "@kind:accessibility"] },
    async ({ page }) => {
      await page.goto(`/componentes/${id}`);
      const area = page.getByRole("region", {
        name: "Playground",
        exact: true,
      });
      await area
        .getByRole("combobox", { name: "Estado", exact: true })
        .selectOption("error");
      const control = area
        .getByTestId("playground-preview")
        .getByRole(id === "input" ? "textbox" : "combobox");
      await expect(control).toHaveAttribute("aria-invalid", "true");
      await expect(control).toHaveAccessibleDescription(
        "Revise o valor informado.",
      );
      await area
        .getByRole("combobox", { name: "Estado", exact: true })
        .selectOption("disabled");
      await expect(control).toBeDisabled();
    },
  );
}

test("button mantém cursor de clique sem a regra global do tema", { tag: ["@component:button", "@kind:interaction"] }, async ({ page }) => {
  await page.goto("/componentes/button");
  const buttons = page.locator('#example-button [data-slot="button"]');
  await expect(buttons.first()).toBeVisible();
  await removeGlobalCursorRules(page);
  for (const button of await buttons.all()) {
    await expect(button).toHaveClass(/\bcursor-pointer\b/);
    await expect(button).toHaveCSS("cursor", "pointer");
  }
  await expect(page.locator('[data-slot="button"][disabled]').first()).toHaveCSS("cursor", "not-allowed");
});

async function removeGlobalCursorRules(page: Page) {
  const removed = await page.evaluate(() => {
    let removed = 0;
    function strip(sheet: CSSStyleSheet | CSSGroupingRule) {
      const rules = sheet.cssRules;
      for (let i = rules.length - 1; i >= 0; i--) {
        const rule = rules[i];
        if (rule instanceof CSSStyleRule && rule.selectorText.startsWith(":is(button")) {
          sheet.deleteRule(i); removed++;
        } else if ("cssRules" in rule && "deleteRule" in rule) strip(rule as CSSGroupingRule);
      }
    }
    for (const sheet of document.styleSheets) {
      try { strip(sheet); } catch { /* Folhas externas de fontes não são editáveis. */ }
    }
    return removed;
  });
  expect(removed).toBeGreaterThan(0);
}

for (const [id, slot] of [["switch", "switch"], ["tabs", "tabs-trigger"], ["select", "select-trigger"]]) {
  test(`${id} mantém cursor e interação sem a regra global`, { tag: [`@component:${id}`, "@kind:interaction"] }, async ({ page }) => {
    await page.goto(`/componentes/${id}`);
    const example = page.locator(`#example-${id}`);
    const controls = example.locator(`[data-slot="${slot}"]`);
    await expect(controls.first()).toBeVisible();
    await removeGlobalCursorRules(page);
    for (const control of await controls.all()) await expect(control).toHaveCSS("cursor", "pointer");
    if (id === "switch") {
      await controls.first().click();
      await expect(controls.first()).not.toBeChecked();
      await expect(controls.first()).toHaveCSS("cursor", "pointer");
    } else if (id === "tabs") {
      await example.getByRole("tab", { name: "Senha", exact: true }).click();
      await expect(example.getByRole("tab", { name: "Senha", exact: true })).toHaveAttribute("aria-selected", "true");
      await expect(example.getByText("Altere sua senha aqui.", {exact:true})).toBeVisible();
    } else {
      await controls.first().click();
      const options = page.getByRole("listbox").getByRole("option");
      await expect(options.first()).toBeVisible();
      for (const option of await options.all()) await expect(option).toHaveCSS("cursor", "pointer");
      await options.first().click();
      await expect(page.getByRole("listbox")).toBeHidden();
      await expect(page.locator('[data-slot="select-trigger"][disabled]').first()).toHaveCSS("cursor", "not-allowed");
    }
  });
}
