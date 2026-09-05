import { sourceFingerprint } from "./reliability/source.mjs";
import ts from "typescript";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
const entries = [];
for (const [file, group] of [
  ["demos", "core"],
  ["demos-extra", "extra"],
  ["demos-advanced", "advanced"],
  ["demos-patterns", "patterns"],
  ["demos-messaging", "messaging"],
]) {
  const source = ts.createSourceFile(
    file + ".tsx",
    readFileSync(`site/${file}.tsx`, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const values = Object.fromEntries(
        node.properties
          .filter(ts.isPropertyAssignment)
          .filter((p) => ts.isStringLiteral(p.initializer))
          .map((p) => [p.name.getText(source), p.initializer.text]),
      );
      if (values.id && values.title && values.description) {
        const path = [
          `src/components/ui/${values.id}.tsx`,
          `src/components/${values.id}.tsx`,
        ].find(existsSync);
        const code = path ? readFileSync(path, "utf8") : "";
        const ast = ts.createSourceFile(
          "component.tsx",
          code,
          ts.ScriptTarget.Latest,
          true,
          ts.ScriptKind.TSX,
        );
        const api =
          ast.statements
            .filter(
              (n) =>
                ts.isFunctionDeclaration(n) ||
                ts.isInterfaceDeclaration(n) ||
                ts.isTypeAliasDeclaration(n),
            )
            .map((n) =>
              ts.isFunctionDeclaration(n)
                ? `${n.name?.text}(${n.parameters.map((p) => p.getText(ast)).join(", ")})`
                : n.getText(ast),
            )
            .join("\n\n") || code;
        entries.push({
          id: values.id,
          title: values.title,
          description: values.description,
          group,
          api,
        });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
const ids = new Set(entries.map((entry) => entry.id));
if (ids.size !== entries.length) throw new Error("IDs duplicados no catálogo.");
for (const dir of ["src/components/ui", "src/components"]) {
  for (const file of readdirSync(dir).filter((file) => file.endsWith(".tsx"))) {
    if (!ids.has(file.slice(0, -4)))
      throw new Error(`Componente sem documentação: ${file}`);
  }
}
entries.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
writeFileSync("site/catalog.json", JSON.stringify(entries, null, 2) + "\n");

writeFileSync("site/test-source.json", JSON.stringify({ fingerprint: sourceFingerprint() }, null, 2) + "\n");
