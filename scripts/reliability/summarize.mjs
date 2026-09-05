export const statuses = ["passed", "failed", "flaky", "skipped", "notRun"];
export function summarize(reports, componentIds) {
  const components = Object.fromEntries(
    componentIds.map((id) => [id, { checks: [] }]),
  );
  for (const [suiteName, report] of Object.entries(reports)) {
    function visit(suite) {
      for (const spec of suite.specs ?? []) {
        const tags = (spec.tags ?? []).map((tag) => tag.replace(/^@/, ""));
        const ids = tags
          .filter((tag) => tag.startsWith("component:"))
          .map((tag) => tag.slice(10));
        const kind =
          tags.find((tag) => tag.startsWith("kind:"))?.slice(5) ??
          "interaction";
        for (const id of ids)
          if (!components[id])
            throw new Error(`Componente desconhecido: ${id}`);
        for (const test of spec.tests ?? []) {
          const attempts = test.results ?? [];
          const last = attempts.at(-1);
          // Uma falha esperada não é aprovação do comportamento do componente.
          const status =
            test.expectedStatus === "skipped"
              ? "skipped"
              : !last || last.status === "interrupted"
                ? "notRun"
                : test.status === "skipped" || last.status === "skipped"
                  ? "skipped"
                  : last.status !== "passed" || test.expectedStatus !== "passed"
                    ? "failed"
                    : test.status === "flaky"
                      ? "flaky"
                      : "passed";
          for (const id of new Set(ids))
            components[id].checks.push({
              id: `${suiteName}:${spec.id}:${test.projectName}`,
              title: spec.title,
              file: spec.file,
              line: spec.line,
              project: test.projectName,
              kind,
              status,
              attempts: attempts.length,
            });
        }
      }
      for (const child of suite.suites ?? []) visit(child);
    }
    for (const suite of report.suites ?? []) visit(suite);
  }
  for (const component of Object.values(components)) {
    component.checks.sort((a, b) => a.id.localeCompare(b.id));
    component.total = component.checks.length;
    for (const status of statuses)
      component[status] = component.checks.filter(
        (check) => check.status === status,
      ).length;
  }
  return components;
}
