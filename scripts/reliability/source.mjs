import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

// Compare conteúdo, não só o commit: também detecta alterações locais não commitadas.
export function sourceFingerprint(root = process.cwd()) {
  const files = [];
  function walk(dir) {
    if (!existsSync(join(root, dir))) return;
    for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`;
      if (path === "site/test-source.json") continue;
      if (entry.isDirectory()) walk(path);
      else files.push(path);
    }
  }
  for (const dir of ["src", "site", "tests", "scripts", ".github/workflows"])
    walk(dir);
  for (const file of readdirSync(root)) {
    if (/^(package(-lock)?\.json|.*config\.(ts|json)|index\.html)$/.test(file))
      files.push(file);
  }
  const hash = createHash("sha256");
  for (const file of files.sort())
    hash
      .update(file)
      .update("\0")
      .update(readFileSync(join(root, file)))
      .update("\0");
  return hash.digest("hex");
}
