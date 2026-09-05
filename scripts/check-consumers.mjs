// Instala os artefatos em uma pasta temporária independente do node_modules do repo.
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
const root = process.cwd();
const temp = mkdtempSync(join(tmpdir(), "lai-consumer-"));
const run = (cmd, args, cwd = temp) =>
  execFileSync(cmd, args, { cwd, stdio: "inherit" });
const put = (path, value) => {
  const file = join(temp, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, value);
};
try {
  const packed = JSON.parse(
    execFileSync("npm", ["pack", "--json", "--pack-destination", temp], {
      cwd: root,
      encoding: "utf8",
    }),
  )[0];
  put(
    "package.json",
    JSON.stringify({
      name: "lai-consumer-check",
      private: true,
      type: "module",
    }),
  );
  const dependencies = new Set();
  const visited = new Set();
  function installRegistry(name) {
    if (visited.has(name)) return;
    visited.add(name);
    const item = JSON.parse(
      readFileSync(resolve(root, `public/r/${name}.json`), "utf8"),
    );
    for (const dependency of item.dependencies ?? [])
      dependencies.add(dependency);
    for (const dependency of item.registryDependencies ?? []) {
      if (!dependency.startsWith("@lai/"))
        throw new Error(`Dependência externa inesperada: ${dependency}`);
      installRegistry(dependency.slice(5));
    }
    for (const file of item.files ?? []) put(file.path, file.content);
  }
  for (const name of [
    "button",
    "select",
    "date-range-picker",
    "page-header",
    "filter-bar",
    "data-list",
    "validated-form",
    "data-table",
    "data-pagination",
    "bottom-sheet",
  ])
    installRegistry(name);
  run("npm", [
    "install",
    "--no-audit",
    "--no-fund",
    join(temp, packed.filename),
    "react@19",
    "react-dom@19",
    "typescript",
    "@types/react",
    "@types/react-dom",
    "vite",
    ...dependencies,
  ]);
  put(
    "src/lib/utils.ts",
    'import { clsx, type ClassValue } from "clsx"; import { twMerge } from "tailwind-merge"; export function cn(...values: ClassValue[]) { return twMerge(clsx(values)); }',
  );
  put(
    "tsconfig.json",
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        jsx: "react-jsx",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        paths: { "@/*": ["./src/*"] },
      },
      include: ["src"],
    }),
  );
  put("src/styles.d.ts", 'declare module "*.css";');
  put(
    "src/main.tsx",
    `import { createRoot } from 'react-dom/client';
import { Button, DateRangePicker, PageHeader, FilterBar, DataList, ValidatedForm, DataTable, DataPagination, BottomSheet, isMobile } from '@organizacaox/lai-design-system';
import '@organizacaox/lai-design-system/styles.css';
import { Button as CopiedButton } from './components/ui/button';
import { DateRangePicker as CopiedPicker } from './components/date-range-picker';
import { ValidatedForm as CopiedForm } from './components/validated-form';
createRoot(document.getElementById('app')!).render(<><PageHeader title="Consumer"/><Button>Pacote</Button><CopiedButton>Registry</CopiedButton><DateRangePicker value={undefined} onChange={() => {}}/><CopiedPicker value={undefined} onChange={() => {}}/><FilterBar query="" onQueryChange={() => {}}/><DataList items={['Ana']} getKey={x => x} renderItem={x => x}/><ValidatedForm fields={[]} onSubmit={() => {}}/><CopiedForm fields={[]} onSubmit={() => {}}/><DataTable data={[{id: "1", name: "Ana"}]} columns={[{key: "name", label: "Name", render: x => x.name}]} labels={{selected: count => String(count)}}/><DataPagination page={1} limit={10} totalPages={1} onPageChange={() => {}} onLimitChange={() => {}}/><BottomSheet isOpen={false} onClose={() => {}} title="Panel">Content</BottomSheet><span>{String(isMobile())}</span></>);`,
  );
  put(
    "index.html",
    '<!doctype html><html><body><div id="app"></div><script type="module" src="/src/main.tsx"></script></body></html>',
  );
  put(
    "vite.config.js",
    'import {defineConfig} from "vite"; import {fileURLToPath} from "node:url"; export default defineConfig({resolve:{alias:{"@":fileURLToPath(new URL("./src",import.meta.url))}}});',
  );
  execFileSync("npm", ["ls", "react", "react-dom", "--json"], {
    cwd: temp,
    encoding: "utf8",
  });
  run("npx", ["tsc", "--noEmit"]);
  run("npx", ["vite", "build"]);
  const registryPackage = JSON.parse(
    readFileSync(join(temp, "package.json"), "utf8"),
  );
  delete registryPackage.dependencies["@organizacaox/lai-design-system"];
  Object.assign(registryPackage.dependencies, {
    react: "^18.3.1",
    "react-dom": "^18.3.1",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    clsx: "^2.1.1",
    "tailwind-merge": "^3.6.0",
    tailwindcss: "^4.3.3",
    "@tailwindcss/vite": "^4.3.3",
    "tw-animate-css": "^1.4.0",
  });
  put("package.json", JSON.stringify(registryPackage));
  rmSync(join(temp, "node_modules"), { recursive: true, force: true });
  rmSync(join(temp, "package-lock.json"), { force: true });
  run("npm", ["install", "--no-audit", "--no-fund"]);
  const theme = JSON.parse(
    readFileSync(resolve(root, "public/r/theme.json"), "utf8"),
  );
  const declarations = (values) =>
    Object.entries(values)
      .map(([key, value]) => `--${key}: ${value};`)
      .join("\n");
  const rules = (values) =>
    Object.entries(values)
      .map(([key, value]) =>
        key.startsWith("@import ") ? `${key};` : typeof value === "object"
          ? `${key} {${rules(value)}}`
          : `${key}: ${value};`,
      )
      .join("\n");
  put(
    "src/styles.css",
    ` ${rules(Object.fromEntries(Object.entries(theme.css).filter(([key]) => key.startsWith("@import "))))} @import "tailwindcss"; @import "tw-animate-css"; @custom-variant dark (&:is(.dark *)); @theme inline {${declarations(theme.cssVars.theme)}} :root {${declarations(theme.cssVars.light)}} .dark {${declarations(theme.cssVars.dark)}} ${rules(Object.fromEntries(Object.entries(theme.css).filter(([key]) => !key.startsWith("@import "))))}`,
  );
  put(
    "src/main.tsx",
    `import {createRoot} from 'react-dom/client';
import './styles.css';
import {Button} from './components/ui/button';
import {DateRangePicker} from './components/date-range-picker';
import {PageHeader} from './components/page-header';
import {FilterBar} from './components/filter-bar';
import {DataList} from './components/data-list';
import {ValidatedForm} from './components/validated-form';
import {DataTable} from './components/data-table';
import {DataPagination} from './components/data-pagination';
import {BottomSheet} from './components/bottom-sheet';
import {isMobile} from './hooks/use-mobile';
createRoot(document.getElementById('app')!).render(<><PageHeader title="Registry"/><Button>Registry</Button><DateRangePicker value={undefined} onChange={() => {}}/><FilterBar query="" onQueryChange={() => {}}/><DataList items={['Ana']} getKey={x => x} renderItem={x => x}/><ValidatedForm fields={[]} onSubmit={() => {}}/><DataTable data={[{id: "1", name: "Ana"}]} columns={[{key: "name", label: "Name", render: x => x.name}]} labels={{selected: count => String(count)}}/><DataPagination page={1} limit={10} totalPages={1} onPageChange={() => {}} onLimitChange={() => {}}/><BottomSheet isOpen={false} onClose={() => {}} title="Panel">Content</BottomSheet><span>{String(isMobile())}</span></>);`,
  );
  put(
    "vite.config.js",
    'import {defineConfig} from "vite"; import tailwindcss from "@tailwindcss/vite"; import {fileURLToPath} from "node:url"; export default defineConfig({plugins:[tailwindcss()],resolve:{alias:{"@":fileURLToPath(new URL("./src",import.meta.url))}}});',
  );
  execFileSync("npm", ["ls", "react", "react-dom", "--json"], {
    cwd: temp,
    encoding: "utf8",
  });
  run("npx", ["tsc", "--noEmit"]);
  run("npx", ["vite", "build"]);
  console.log(
    `Consumo validado: pacote React 19; ${visited.size} itens transitivos e tema do registry em React 18.`,
  );
} finally {
  rmSync(temp, { recursive: true, force: true });
}
