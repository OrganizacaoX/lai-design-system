import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date("2026-08-15T12:00:00") });
  await page.goto("/tests/fixtures/compositions/index.html");
});
test("selection is isolated from row actions, pruned and disabled during loading", async ({
  page,
}) => {
  const all = page.getByRole("checkbox", { name: "Select all" });
  await page.getByRole("checkbox", { name: "Select row 1" }).check();
  await expect(all).toHaveAttribute("aria-checked", "mixed");
  await expect(page.getByLabel("Clicked", { exact: true })).toBeEmpty();
  await all.check();
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByLabel("Selected", { exact: true })).toHaveText("one,two");
  await page.getByRole("button", { name: "Remove first" }).click();
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByLabel("Selected", { exact: true })).toHaveText("two");
  await page.getByRole("button", { name: "Loading", exact: true }).click();
  await expect(all).toBeDisabled();
  await expect(page.getByRole("button", { name: "Apply", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Loading", exact: true }).click();
  await page.getByRole("button", { name: "Clear selection" }).click();
  await expect(all).not.toBeChecked();
  await page.getByRole("cell", { name: "Bruno" }).click();
  await expect(page.getByLabel("Clicked", { exact: true })).toHaveText("two");
  await page.getByRole("button", { name: "Empty", exact: true }).click();
  await expect(page.getByText("No records")).toBeVisible();
  await expect(all).toBeDisabled();
});
test("pagination boundaries and page size", async ({ page }) => {
  const prev = page.getByRole("button", { name: "Previous", exact: true });
  const next = page.getByRole("button", { name: "Next", exact: true });
  await expect(prev).toBeDisabled();
  await page.getByRole("button", { name: "Go to 12", exact: true }).click();
  await expect(next).toBeDisabled();
  await page.getByRole("combobox", { name: "Page size" }).click();
  await page.getByRole("option", { name: "20", exact: true }).click();
  await expect(page.getByLabel("Limit", { exact: true })).toHaveText("20");
  await expect(page.getByRole("button", { name: "Go to 1", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.getByRole("button", { name: "Single", exact: true }).click();
  await expect(prev).toBeDisabled();
  await expect(next).toBeDisabled();
  await page.getByRole("button", { name: "Empty", exact: true }).click();
  await expect(prev).toBeDisabled();
  await expect(next).toBeDisabled();
  await expect(page.getByText("Página 0 de 0")).toBeVisible();
});
test("date ranges need two clicks, allow same day, and can be cleared", async ({ page }) => {
  await page.locator("#dates").click();
  const day = (n: number) =>
    page.getByRole("button", { name: new RegExp(`^.*August ${n}(st|nd|rd|th), 2026`) }).first();
  await day(3).click();
  await expect(page.getByLabel("Range", { exact: true })).toHaveText("3:");
  await expect(day(7)).toBeVisible();
  await day(7).click();
  await expect(page.getByLabel("Range", { exact: true })).toHaveText("3:7");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.locator("#dates").click();
  await day(7).click();
  await day(7).click();
  await expect(page.getByLabel("Range", { exact: true })).toHaveText("7:7");
  await page.locator("#dates").click();
  await page.getByRole("button", { name: "Clear dates" }).click();
  await expect(page.getByLabel("Range", { exact: true })).toHaveText(":");
});
test("bottom sheet closes, restores focus and reopens; responsiveness follows viewport", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: "Open panel" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Test panel" })).toBeVisible();
  await page.getByRole("textbox", { name: "Message" }).fill("hello");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(page.getByRole("textbox", { name: "Message" })).toBeVisible();
  await page.getByRole("button", { name: "Close panel" }).click();
  await page.setViewportSize({ width: 500, height: 800 });
  await expect(page.getByLabel("Mobile", { exact: true })).toHaveText("true");
  await page.getByRole("button", { name: "Snapshot" }).click();
  await expect(page.getByLabel("Clicked", { exact: true })).toHaveText("true");
  await page.setViewportSize({ width: 1000, height: 800 });
  await expect(page.getByLabel("Mobile", { exact: true })).toHaveText("false");
});
