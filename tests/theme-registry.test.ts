import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const theme = JSON.parse(readFileSync("public/r/theme.json", "utf8"));

test("tema exportado preserva tokens que o formatter distribui em várias linhas", () => {
  expect(theme.cssVars.theme["color-primary-hover"].replace(/\s/g, "")).toBe(
    "color-mix(inoklch,var(--primary),var(--foreground)10%)",
  );
  expect(theme.cssVars.theme["shadow-mobile-nav"]).toContain("inset 0 1px 0 0");
  expect(theme.cssVars.theme["font-mono"]).toContain("Google Sans Code");
});

test("registry distribui as utilities exigidas pelos componentes copiados", () => {
  expect(theme.css["@utility icon-stroke-emphasis"]).toEqual({
    "stroke-width": "2.5",
  });
  expect(theme.css["@utility content-empty"]).toEqual({
    "--tw-content": '""',
    content: "var(--tw-content)",
  });
  expect(theme.css["@utility message-item-containment"]).toEqual({
    "contain-intrinsic-size": "auto 10rem",
    "content-visibility": "auto",
  });
});
