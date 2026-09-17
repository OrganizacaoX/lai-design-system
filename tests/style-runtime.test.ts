import { afterAll, beforeAll, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { chromium, type Browser, type Page } from "@playwright/test";

let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await chromium.launch();
  page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.route("**/*", (route) => route.abort());
  await page.setContent('<main id="fixture"></main>');
  // Geometry does not depend on downloading Google Fonts.
  const css = readFileSync("lib/styles.css", "utf8").replace(
    /@import "[^"]*";/g,
    "",
  );
  await page.addStyleTag({ content: css });
});

afterAll(async () => {
  await browser?.close();
});

test("tokens preservam medidas, fonte e limites do viewport", async () => {
  const values = await page.evaluate(() => {
    const root = document.getElementById("fixture")!;
    root.style.width = "400px";
    root.innerHTML = `
      <div id="width" class="w-viewport-inset"></div>
      <div id="max" class="max-w-screen-inset" style="width:1000px"></div>
      <span id="text" class="text-(length:--text-control-sm)">Label</span>
      <span id="switch" data-size="default" class="data-[size=default]:h-switch block"></span>
      <span id="code" style="font-size:20px"><code class="text-(length:--text-code)">code</code></span>
      <div data-active class="data-active:[&_svg]:icon-stroke-emphasis"><svg id="icon"><path /></svg></div>
    `;
    const style = (id: string) =>
      getComputedStyle(document.getElementById(id)!);
    return {
      width: style("width").width,
      max: style("max").maxWidth,
      font: style("text").fontSize,
      height: parseFloat(style("switch").height),
      codeFont: getComputedStyle(root.querySelector("code")!).fontSize,
      stroke: style("icon").strokeWidth,
    };
  });
  expect(values.width).toBe("368px");
  expect(values.max).toBe("768px");
  expect(values.font).toBe("12.8px");
  expect(values.height).toBeCloseTo(18.4, 1);
  expect(values.codeFont).toBe("17.5px");
  expect(values.stroke).toBe("2.5px");
});

test("variáveis de virtualização e drag-and-drop geram geometria e transição", async () => {
  const values = await page.evaluate(() => {
    const root = document.getElementById("fixture")!;
    root.innerHTML = `
      <div id="virtual" class="h-(--virtual-height) overflow-auto" style="--virtual-height:240px"></div>
      <div id="row" class="absolute top-0 left-0 w-full transform-(--virtual-transform)" style="--virtual-transform:translateY(96px)"></div>
      <div id="sortable" class="transform-(--sortable-transform) sortable-motion data-dragging:opacity-60" data-dragging style="--sortable-transform:translate3d(10px, 20px, 0);--sortable-transition:transform 150ms ease"></div>
    `;
    const virtual = getComputedStyle(document.getElementById("virtual")!);
    const row = getComputedStyle(document.getElementById("row")!);
    const sortable = getComputedStyle(document.getElementById("sortable")!);
    return {
      height: virtual.height,
      overflow: virtual.overflowY,
      rowTransform: row.transform,
      sortableTransform: sortable.transform,
      opacity: sortable.opacity,
      transition: sortable.transitionProperty,
      duration: sortable.transitionDuration,
    };
  });
  expect(values.height).toBe("240px");
  expect(values.overflow).toBe("auto");
  expect(values.rowTransform).toBe("matrix(1, 0, 0, 1, 0, 96)");
  expect(values.sortableTransform).toBe("matrix(1, 0, 0, 1, 10, 20)");
  expect(values.opacity).toBe("0.6");
  expect(values.transition).toBe("transform");
  expect(values.duration).toBe("0.15s");
});
