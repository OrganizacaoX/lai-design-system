import { test } from "node:test";
import assert from "node:assert/strict";
import { summarize } from "./summarize.mjs";
const spec = (overrides = {}) => ({
  id: "scenario",
  title: "Scenario",
  tags: ["component:button", "kind:interaction"],
  file: "button.spec.ts",
  line: 1,
  tests: [
    {
      projectName: "desktop",
      expectedStatus: "passed",
      status: "expected",
      results: [{ status: "passed" }],
    },
  ],
  ...overrides,
});
const report = (specs) => ({ browser: { suites: [{ specs }] } });
test("counts each project once and exposes retries as flaky", () => {
  const item = spec();
  item.tests.push({
    ...item.tests[0],
    projectName: "mobile",
    status: "flaky",
    results: [{ status: "failed" }, { status: "passed" }],
  });
  const result = summarize(report([item]), ["button"]).button;
  assert.equal(result.total, 2);
  assert.equal(result.passed, 1);
  assert.equal(result.flaky, 1);
  assert.equal(result.checks[1].attempts, 2);
});
test("expected failures, skips and interruption never become passes", () => {
  const item = spec();
  item.tests = [
    {
      projectName: "expected-failure",
      expectedStatus: "failed",
      status: "expected",
      results: [{ status: "failed" }],
    },
    {
      projectName: "skip",
      expectedStatus: "skipped",
      status: "skipped",
      results: [{ status: "skipped" }],
    },
    {
      projectName: "interrupted",
      expectedStatus: "passed",
      status: "unexpected",
      results: [{ status: "interrupted" }],
    },
    {
      projectName: "missing",
      expectedStatus: "passed",
      status: "skipped",
      results: [],
    },
  ];
  const result = summarize(report([item]), ["button"]).button;
  assert.equal(result.passed, 0);
  assert.equal(result.failed, 1);
  assert.equal(result.skipped, 1);
  assert.equal(result.notRun, 2);
});
test("unmapped documentation tests do not inflate component counts", () => {
  const result = summarize(report([spec({ tags: [] })]), ["button"]);
  assert.equal(result.button.total, 0);
});
test("rejects misspelled component ids and handles missing reports", () => {
  assert.throws(() => summarize(report([spec()]), ["input"]), /desconhecido/);
  assert.equal(summarize({}, ["button"]).button.total, 0);
});

test("supports both JSON tags without @ and source tags with @", () => {
  const json = summarize(report([spec()]), ["button"]).button;
  const source = summarize(
    report([spec({ tags: ["@component:button", "@kind:interaction"] })]),
    ["button"],
  ).button;
  assert.equal(json.total, 1);
  assert.deepEqual(source, json);
});
test("a deliberately skipped test without attempts stays ignored", () => {
  const item = spec();
  item.tests = [
    {
      projectName: "desktop",
      expectedStatus: "skipped",
      status: "skipped",
      results: [],
    },
  ];
  assert.equal(summarize(report([item]), ["button"]).button.skipped, 1);
});
