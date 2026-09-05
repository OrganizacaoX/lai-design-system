import postcss from "postcss";
// Gera o registry.json a partir dos componentes reais do projeto.
//
// Escaneia src/components/ui, src/components e src/hooks, deduz as
// dependencias npm (com versao fixada pelo package.json) e as dependencias
// entre itens do proprio registry (@lai/<nome>), e escreve registry.json.
//
// Depois disso rode `shadcn build` para gerar os JSONs em public/r.
//
// Uso: node scripts/build-registry.mjs

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, basename, extname } from "node:path";

const ROOT = process.cwd();
const NAMESPACE = "@lai";

// ---- versoes reais do package.json (para "congelar" o design) ----------------
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
const pinned = (name) => {
  const v = allDeps[name];
  if (!v) return name; // deixa o shadcn resolver "latest"
  return `${name}@${v.replace(/^[\^~]/, "")}`;
};

// pacotes que nunca viram dependencia declarada (sao peers do projeto host)
const PEER = new Set(["react", "react-dom"]);

// resolve o nome do pacote npm a partir de um import bare
// ex: "@shadcn/react/message-scroller" -> "@shadcn/react"; "date-fns/locale" -> "date-fns"
function npmPackageName(spec) {
  if (spec.startsWith("@")) return spec.split("/").slice(0, 2).join("/");
  return spec.split("/")[0];
}

const IMPORT_RE = /from\s+["']([^"']+)["']/g;

function extractImports(code) {
  const specs = new Set();
  let m;
  while ((m = IMPORT_RE.exec(code)) !== null) specs.add(m[1]);
  return [...specs];
}

// mapeia um arquivo fonte -> item do registry
function buildItem({ file, srcPath, targetDir, type }) {
  const code = readFileSync(join(ROOT, srcPath), "utf8");
  const name = basename(file, extname(file));
  const dependencies = new Set();
  const registryDependencies = new Set();

  for (const spec of extractImports(code)) {
    if (spec.startsWith("@/components/ui/")) {
      registryDependencies.add(`${NAMESPACE}/${basename(spec)}`);
    } else if (spec.startsWith("@/components/")) {
      registryDependencies.add(`${NAMESPACE}/${basename(spec)}`);
    } else if (spec.startsWith("@/hooks/")) {
      registryDependencies.add(`${NAMESPACE}/${basename(spec)}`);
    } else if (spec.startsWith("@/lib/utils")) {
      // cn() vem do `shadcn init` no projeto host — nao declaramos como dep.
    } else if (spec.startsWith("@/")) {
      // outros aliases internos: ignora (nao fazem parte do registry publico)
    } else if (spec.startsWith(".")) {
      // import relativo dentro do proprio arquivo — ignora
    } else {
      const p = npmPackageName(spec);
      if (!PEER.has(p)) dependencies.add(pinned(p));
    }
  }

  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type,
    title: titleCase(name),
    files: [
      {
        path: srcPath,
        type,
        target: `${targetDir}/${file}`,
      },
    ],
  };
  if (dependencies.size) item.dependencies = [...dependencies].sort();
  if (registryDependencies.size)
    item.registryDependencies = [...registryDependencies].sort();
  return item;
}

function titleCase(name) {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function listFiles(dir, ext) {
  try {
    return readdirSync(join(ROOT, dir))
      .filter((f) => f.endsWith(ext))
      .sort();
  } catch {
    return [];
  }
}

// ---- coleta os itens -------------------------------------------------------
const items = [];

// tema / design tokens — carrega TODO o visual do projeto
items.push(buildThemeItem());

// hooks
for (const f of listFiles("src/hooks", ".ts")) {
  items.push(
    buildItem({
      file: f,
      srcPath: `src/hooks/${f}`,
      targetDir: "hooks",
      type: "registry:hook",
    }),
  );
}

// componentes ui
for (const f of listFiles("src/components/ui", ".tsx")) {
  items.push(
    buildItem({
      file: f,
      srcPath: `src/components/ui/${f}`,
      targetDir: "components/ui",
      type: "registry:ui",
    }),
  );
}

// componentes compostos (nao-ui)
for (const f of listFiles("src/components", ".tsx")) {
  items.push(
    buildItem({
      file: f,
      srcPath: `src/components/${f}`,
      targetDir: "components",
      type: "registry:component",
    }),
  );
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "lai-disk",
  homepage: "https://github.com/OrganizacaoX/lai-disk-front",
  items,
};

writeFileSync(
  join(ROOT, "registry.json"),
  JSON.stringify(registry, null, 2) + "\n",
);
console.log(`registry.json gerado com ${items.length} itens.`);

// ---- item de tema ----------------------------------------------------------
// Extrai os tokens de src/index.css (blocos :root e .dark + @theme inline)
// para um item registry:theme, de modo que `shadcn add @lai/theme` aplique
// todo o sistema de cores/tipografia/raios em qualquer projeto.
function buildThemeItem() {
  const css = readFileSync(join(ROOT, "src/index.css"), "utf8");

  const parseBlock = (selector) => {
    const re = new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`, "m");
    const match = css.match(re);
    if (!match) return {};
    const vars = {};
    for (const line of match[1].split("\n")) {
      const m = line.match(/^\s*--([\w-]+)\s*:\s*(.+?);\s*$/);
      if (m) vars[m[1]] = m[2].trim();
    }
    return vars;
  };

  function cssObject(node) {
    return Object.fromEntries((node.nodes ?? []).filter(child => child.type !== "comment").map(child =>
      child.type === "decl"
        ? [child.prop, child.value + (child.important ? " !important" : "")]
        : [child.type === "rule" ? child.selector : `@${child.name} ${child.params}`, cssObject(child)]
    ));
  }

  const root = parseBlock(":root");
  const dark = parseBlock("\\.dark");
  const themeInline = parseBlock("@theme inline");

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "theme",
    type: "registry:theme",
    title: "LAI Theme",
    description:
      "Tokens de design do LAI Disk: cores (oklch) light/dark, tipografia e escala de raios.",
    css: Object.fromEntries(postcss.parse(css).nodes.filter(node =>
      (node.type === "rule" && (node.selector.startsWith("[data-density=") || node.selector.startsWith('[data-slot='))) ||
      (node.type === "atrule" && node.name === "media" && node.params === "(prefers-reduced-motion: reduce)")
    ).map(node => [node.type === "rule" ? node.selector : `@${node.name} ${node.params}`, cssObject(node)])),
    cssVars: {
      theme: themeInline,
      light: root,
      dark: dark,
    },
  };
}
