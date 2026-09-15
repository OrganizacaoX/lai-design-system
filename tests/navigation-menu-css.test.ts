import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const build = spawnSync("npm", ["run", "package:build"], {
  cwd: root,
  encoding: "utf8",
});

if (build.status !== 0) {
  throw new Error(
    `Production CSS build failed:\n${build.stdout}\n${build.stderr}`,
  );
}

const css = readFileSync(new URL("../lib/styles.css", import.meta.url), "utf8");

function emittedRule(selector: string) {
  const start = css.indexOf(selector);
  expect(start).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf("}", start) + 1);
}

describe("NavigationMenu production CSS", () => {
  for (const [phase, direction, offset] of [
    ["ending", "left", "50%"],
    ["ending", "right", "-50%"],
    ["starting", "left", "-50%"],
    ["starting", "right", "50%"],
  ] as const) {
    test(`${phase} toward ${direction} translates ${offset}`, () => {
      const escapedOffset = offset.replace("%", String.raw`\%`);
      const selector =
        String.raw`data-\[` +
        `${phase}-style` +
        String.raw`\]\:data-\[activation-direction\=` +
        direction +
        String.raw`\]\:translate-x-\[` +
        escapedOffset +
        String.raw`\]`;
      const rule = emittedRule(selector);
      expect(rule).toContain(`[data-${phase}-style]`);
      expect(rule).toContain(`[data-activation-direction=${direction}]`);
      expect(rule).toContain(`--tw-translate-x:${offset}`);
    });
  }

  test("ending popup uses an emitted ease rule", () => {
    const rule = emittedRule(String.raw`data-\[ending-style\]\:ease-\[ease\]`);
    expect(rule).toContain("[data-ending-style]");
    expect(rule).toContain("transition-timing-function:ease");
  });
});
