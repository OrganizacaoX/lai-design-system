import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sourceFingerprint } from "./source.mjs";
test("source and tests invalidate evidence; generated report metadata does not", () => {
  const root = mkdtempSync(join(tmpdir(), "lai-fingerprint-"));
  try {
    for (const dir of ["src", "site", "tests"]) mkdirSync(join(root, dir));
    writeFileSync(join(root, "src/button.tsx"), "before");
    const before = sourceFingerprint(root);
    writeFileSync(join(root, "site/test-source.json"), "generated");
    assert.equal(sourceFingerprint(root), before);
    writeFileSync(join(root, "src/button.tsx"), "after");
    const after = sourceFingerprint(root);
    assert.notEqual(after, before);
    writeFileSync(join(root, "tests/button.spec.ts"), "new scenario");
    assert.notEqual(sourceFingerprint(root), after);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
