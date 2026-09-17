import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function lintExample(directory: string, source: string) {
  const fixture = mkdtempSync(join(directory, "lint-probe-"));
  try {
    const file = join(fixture, "example.tsx");
    writeFileSync(file, source);
    const result = spawnSync(
      "node",
      ["node_modules/oxlint/bin/oxlint", "--format", "json", file],
      { encoding: "utf8" },
    );
    if (result.error) throw result.error;
    const report = JSON.parse(result.stdout);
    return {
      status: result.status,
      rules: report.diagnostics.map((item: { code: string }) => item.code),
    };
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

test("consumidores não podem contornar nenhuma das seis regras do shadcn", () => {
  const result = lintExample(
    "site",
    `
    import { Button } from "@/components/ui/button";
    export function Probe({ color }: { color: string }) {
      return <>
        <Button className="p-4 bg-pink-500">Restyle</Button>
        <div className="p-[13px] rounded-huge" style={{ padding: 13 }}>Raw</div>
        <Button className={"bg-" + color}>Dynamic</Button>
      </>;
    }
  `,
  );
  expect(result.status).toBe(1);
  for (const rule of [
    "no-restyle",
    "no-raw-colors",
    "no-arbitrary-values",
    "no-inline-styles",
    "no-unknown-classes",
    "require-static-classes",
  ]) {
    expect(result.rules).toContain(`shadcn(${rule})`);
  }
});

test("componentes base também rejeitam cores, valores fixos e estilos inline", () => {
  const result = lintExample(
    "src/components/ui",
    `
    export function Probe() {
      return <div className="bg-pink-500 p-[13px] rounded-huge" style={{ padding: 13 }} />;
    }
  `,
  );
  expect(result.status).toBe(1);
  for (const rule of [
    "no-raw-colors",
    "no-arbitrary-values",
    "no-inline-styles",
    "no-unknown-classes",
  ]) {
    expect(result.rules).toContain(`shadcn(${rule})`);
  }
});

test("tokens, variantes e variáveis dinâmicas continuam permitidos", () => {
  const result = lintExample(
    "site",
    `
    import { Button } from "@/components/ui/button";
    export function Probe() {
      return <div className="bg-card p-4 h-(--measured-height)" style={{ "--measured-height": "120px" }}>
        <Button variant="outline" size="sm" className="w-full">Save</Button>
      </div>;
    }
  `,
  );
  expect(result.status).toBe(0);
  expect(result.rules).toEqual([]);
});
