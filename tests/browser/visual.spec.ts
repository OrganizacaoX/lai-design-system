import { test, expect } from "@playwright/test";
for (const theme of ["light", "dark"]) {
  for (const component of ["button", "input", "select", "data-list"]) {
    test(
      `${component} ${theme}`,
      { tag: [`@component:${component}`, "@kind:visual"] },
      async ({ page }) => {
        await page.addInitScript(
          (theme) => localStorage.setItem("lai-theme", theme),
          theme,
        );
        await page.goto(`/componentes/${component}`);
        const example = page.locator(`#example-${component}`);
        await expect(example).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        await expect(example).toHaveScreenshot(`${component}-${theme}.png`, {
          animations: "disabled",
          maxDiffPixelRatio: 0.01,
        });
      },
    );
  }
}
