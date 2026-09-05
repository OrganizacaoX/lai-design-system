import { test, expect } from "@playwright/test";

test("selected indicator follows navigation with subtle fill and stronger icon", { tag: ["@component:sidebar", "@kind:interaction"] }, async ({ page, isMobile }) => {
  await page.goto("/examples/app-shell");
  const nav = page.getByRole("navigation", { name: isMobile ? "Atalhos de navegação" : "Navegação principal", exact: true });
  const initial = nav.locator('[data-slot="sidebar-active-indicator"]');
  await expect(initial).toBeVisible();
  await page.waitForTimeout(400);
  const origin = await initial.boundingBox();
  const target = nav.getByRole("link", { name: "Contatos", exact: true });
  // Capture frames in the same browser task as selection so assertion round trips
  // cannot miss the short linear animation.
  const positions = await target.evaluate(async link => {
    link.click();
    const samples: { x: number; y: number; weight: number; stroke: number }[] = [];
    for (let i = 0; i < 35; i++) {
      await new Promise(requestAnimationFrame);
      const el = link.querySelector('[data-slot="sidebar-active-indicator"]')!;
      const { x, y } = el.getBoundingClientRect();
      samples.push({ x, y, weight: Number(getComputedStyle(link).fontWeight), stroke: parseFloat(getComputedStyle(link.querySelector("svg")!).strokeWidth) });
    }
    return samples;
  });
  await expect(target).toHaveAttribute("aria-current", "page");
  await expect(target).toHaveCSS("font-weight", "600");
  await expect(target.locator("svg").first()).toHaveCSS("stroke-width", "2.5px");
  const indicator = target.locator('[data-slot="sidebar-active-indicator"]');
  expect(positions.some(p => p.weight > 400 && p.weight < 600)).toBe(true);
  expect(positions.some(p => p.stroke > 2 && p.stroke < 2.5)).toBe(true);
  const destination = await target.boundingBox();
  expect(origin).not.toBeNull();
  expect(destination).not.toBeNull();
  const axis = isMobile ? "x" : "y";
  expect(positions.some(p => Math.abs(p[axis] - destination![axis]) > 1)).toBe(true);
  expect(Math.abs(positions.at(-1)![axis] - destination![axis])).toBeLessThan(1);
  await expect(indicator).toHaveCSS("background-color", /0\.1\)/);
  await target.hover();
  await expect(target).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(nav.locator('[data-slot="sidebar-active-indicator"]')).toHaveCount(1);
});

test("reduced motion places the indicator directly on the selected item", { tag: ["@component:sidebar", "@kind:interaction"] }, async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/examples/app-shell");
  const nav = page.getByRole("navigation", { name: isMobile ? "Atalhos de navegação" : "Navegação principal", exact: true });
  const target = nav.getByRole("link", { name: "Contatos", exact: true });
  await target.click();
  const indicator = target.locator('[data-slot="sidebar-active-indicator"]');
  await expect(indicator).toBeVisible();
  await expect(indicator).toHaveCSS("transform", "none");
  const box = await indicator.boundingBox();
  const item = await target.boundingBox();
  expect(box!.x).toBeCloseTo(item!.x, 0);
  expect(box!.y).toBeCloseTo(item!.y, 0);
});
