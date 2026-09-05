import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const catalog: { id: string; title: string }[] = JSON.parse(
  readFileSync(new URL("../../site/catalog.json", import.meta.url), "utf8"),
);
for (const component of catalog) {
  test(
    `catálogo: ${component.id}`,
    { tag: [`@component:${component.id}`, "@kind:render"] },
    async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`/componentes/${component.id}`);
      await expect(
        page.getByRole("heading", { name: component.title, exact: true }),
      ).toBeVisible();
      await expect(
        page
          .locator(`#example-${component.id}`)
          .getByRole("tabpanel", { name: "Preview", exact: true }),
      ).toBeVisible();
      expect(errors).toEqual([]);
    },
  );
}
