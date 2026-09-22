import { test, expect } from "../browser/authenticated";

test.beforeEach(async ({ page }) => {
  await page.goto("/tests/fixtures/app-shell-accordion/index.html");
});

test(
  "accordion keeps a single collapsible group open",
  { tag: ["@component:app-shell", "@kind:interaction"] },
  async ({ page, isMobile }) => {
    test.skip(isMobile, "o acordeão é o mesmo no drawer; o desktop cobre");
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    const group = (name: string) =>
      nav.getByRole("button", { name, exact: true });

    // Começa no grupo da rota ativa.
    await expect(group("Relatórios")).toHaveAttribute("aria-expanded", "true");
    await expect(group("Gestão")).toHaveAttribute("aria-expanded", "false");

    // Abrir outro grupo fecha o aberto.
    await group("Auditoria").click();
    await expect(group("Auditoria")).toHaveAttribute("aria-expanded", "true");
    await expect(group("Relatórios")).toHaveAttribute("aria-expanded", "false");
    await expect(nav.getByRole("link", { name: "Tendência" })).toBeHidden();

    // Fechar o aberto deixa todos fechados.
    await group("Auditoria").click();
    await expect(group("Auditoria")).toHaveAttribute("aria-expanded", "false");
    await expect(group("Relatórios")).toHaveAttribute("aria-expanded", "false");

    // Navegar de fora abre o grupo da nova rota e fecha o que estava aberto.
    await group("Auditoria").click();
    await page.getByRole("button", { name: "Go to Papéis" }).click();
    await expect(group("Gestão")).toHaveAttribute("aria-expanded", "true");
    await expect(group("Auditoria")).toHaveAttribute("aria-expanded", "false");
    await expect(nav.getByRole("link", { name: "Papéis" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
);

test(
  "collapsed sidebar expands and opens only the clicked group",
  { tag: ["@component:app-shell", "@kind:interaction"] },
  async ({ page, isMobile }) => {
    test.skip(isMobile, "sidebar recolhida em ícones só existe no desktop");
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await page.getByRole("button", { name: "Alternar navegação" }).click();
    await nav.getByRole("button", { name: "Gestão", exact: true }).click();
    await expect(
      nav.getByRole("button", { name: "Gestão", exact: true }),
    ).toHaveAttribute("aria-expanded", "true");
    await expect(
      nav.getByRole("button", { name: "Relatórios", exact: true }),
    ).toHaveAttribute("aria-expanded", "false");
    await expect(nav.getByRole("link", { name: "Times" })).toBeVisible();
  },
);
