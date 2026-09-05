import { spawnSync, execFileSync } from "node:child_process";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  copyFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { sourceFingerprint } from "./reliability/source.mjs";
import { summarize } from "./reliability/summarize.mjs";

// Este comando sempre executa as duas suítes completas. Execuções filtradas não sobrescrevem o painel.
if (process.argv.length > 2)
  throw new Error(
    "test:reliability não aceita filtros; use test:e2e para testes focados.",
  );
// Sempre constrói o site que será testado; evita atribuir resultados de dist antigo ao código atual.
for (const args of [
  ["scripts/build-docs.mjs"],
  ["node_modules/vite/bin/vite.js", "build"],
]) {
  const build = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (build.status !== 0) process.exit(build.status ?? 1);
}
const fingerprint = sourceFingerprint();
const reports = {};
const runs = [];
mkdirSync("test-results/reliability", { recursive: true });
for (const [name, config] of [
  ["browser", "playwright.config.ts"],
  ["compositions", "playwright.compositions.config.ts"],
]) {
  const reportPath = resolve(
    `test-results/reliability/${name}-${Date.now()}.json`,
  );
  const run = spawnSync(
    process.execPath,
    [
      "node_modules/playwright/cli.js",
      "test",
      "--config",
      config,
      "--reporter=list,json",
    ],
    {
      stdio: "inherit",
      env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: reportPath },
    },
  );
  let report;
  try {
    report = JSON.parse(readFileSync(reportPath, "utf8"));
  } catch {
    /* Falha de infraestrutura, sem resultados. */
  }
  if (report) reports[name] = report;
  runs.push({
    name,
    complete:
      !!report &&
      !run.signal &&
      !run.error &&
      (report.errors?.length ?? 0) === 0,
    exitCode: run.status,
  });
}
const catalog = JSON.parse(readFileSync("site/catalog.json", "utf8"));
let commit = null;
let dirty = true;
try {
  commit = execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  dirty = !!execFileSync("git", ["status", "--porcelain"], {
    encoding: "utf8",
  }).trim();
} catch {
  /* O hash de conteúdo funciona também fora de um checkout Git. */
}
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sourceFingerprint: fingerprint,
  sourceChangedDuringRun: fingerprint !== sourceFingerprint(),
  commit,
  dirty,
  runs,
  components: summarize(
    reports,
    catalog.map((entry) => entry.id),
  ),
};
writeFileSync(
  "public/component-tests.json",
  JSON.stringify(report, null, 2) + "\n",
);
if (existsSync("dist"))
  copyFileSync("public/component-tests.json", "dist/component-tests.json");
console.log(`Resumo real de testes salvo para ${catalog.length} componentes.`);
if (
  runs.some((run) => !run.complete || run.exitCode !== 0) ||
  report.sourceChangedDuringRun
)
  process.exitCode = 1;
