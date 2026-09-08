import { test, expect } from "@playwright/test";

// Largura realmente pintada do elemento: interseção com todos os ancestrais que
// recortam. Mede o que o usuário vê, sem depender de qual camada faz o recorte.
const PAINTED_WIDTH = `el => {
  const box = el.getBoundingClientRect();
  let left = box.left, right = box.right;
  for (let parent = el.parentElement; parent; parent = parent.parentElement) {
    if (getComputedStyle(parent).overflowX === "visible") continue;
    const pb = parent.getBoundingClientRect();
    left = Math.max(left, pb.left);
    right = Math.min(right, pb.right);
  }
  return Math.max(0, right - left);
}`;

test.describe("sidebar em modo ícone", () => {
  test.skip(({ isMobile }) => Boolean(isMobile), "o trilho de ícones só existe no desktop");

  test("colapsada mostra só os ícones, sem sobra de rótulo", { tag: ["@component:sidebar", "@kind:layout"] }, async ({ page }) => {
    await page.goto("/examples/app-shell");
    const sidebar = page.locator('[data-slot="sidebar"]').first();
    const nav = page.getByRole("navigation", { name: "Navegação principal", exact: true });
    await expect(nav.getByRole("link", { name: "Contatos", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Alternar navegação" }).first().click();
    await expect(sidebar).toHaveAttribute("data-collapsible", "icon");
    await page.waitForTimeout(400);

    const painted = await nav.evaluate((root, paintedWidth) => {
      const width = new Function("return " + paintedWidth)();
      return [...root.querySelectorAll('[data-sidebar="menu-button"] span')]
        .filter(el => !el.hasAttribute("aria-hidden") && (el.textContent ?? "").trim().length > 0)
        .map(el => ({ text: (el.textContent ?? "").trim(), width: Math.round(width(el)) }))
        .filter(item => item.width > 0);
    }, PAINTED_WIDTH);
    expect(painted).toEqual([]);

    // Voltar ao estado expandido precisa reexibir os rótulos por inteiro.
    await page.getByRole("button", { name: "Alternar navegação" }).first().click();
    await expect(sidebar).toHaveAttribute("data-collapsible", "");
    await page.waitForTimeout(400);
    const label = nav.getByRole("link", { name: "Contatos", exact: true }).locator("span", { hasText: "Contatos" }).last();
    expect(await label.evaluate((el, paintedWidth) => new Function("return " + paintedWidth)()(el), PAINTED_WIDTH)).toBeGreaterThan(0);
  });
});
