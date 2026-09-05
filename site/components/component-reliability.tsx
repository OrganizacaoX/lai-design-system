import { useEffect, useState } from "react";
import source from "../test-source.json";

type Status = "passed" | "failed" | "flaky" | "skipped" | "notRun";
type Check = {
  id: string;
  title: string;
  file: string;
  line: number;
  project: string;
  kind: string;
  status: Status;
  attempts: number;
};
type ComponentResult = Record<Status, number> & {
  total: number;
  checks: Check[];
};
type Report = {
  schemaVersion: number;
  generatedAt: string;
  sourceFingerprint: string;
  sourceChangedDuringRun: boolean;
  commit: string | null;
  dirty: boolean;
  runs: { name: string; complete: boolean; exitCode: number | null }[];
  components: Record<string, ComponentResult>;
};
const labels: Record<Status, string> = {
  passed: "Aprovados",
  failed: "Falharam",
  flaky: "Instáveis",
  skipped: "Ignorados",
  notRun: "Não executados",
};
const kinds: Record<string, string> = {
  render: "Renderização",
  visual: "Aparência",
  interaction: "Interação",
  accessibility: "Acessibilidade",
  integration: "Integração",
};

export function ComponentReliability({ id }: { id: string }) {
  const [report, setReport] = useState<Report>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/component-tests.json", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Resumo indisponível");
        return response.json();
      })
      .then((value) => {
        if (
          value.schemaVersion !== 1 ||
          !value.components ||
          !Array.isArray(value.runs)
        )
          throw new Error("Formato inválido");
        setReport(value);
      })
      .catch(() => {
        /* A ausência de evidência nunca é apresentada como aprovação. */
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  const result = report?.components[id];
  const stale =
    !!report &&
    (report.sourceFingerprint !== source.fingerprint ||
      report.sourceChangedDuringRun);
  const incomplete =
    !!report &&
    (report.runs.length !== 2 || report.runs.some((run) => !run.complete));
  const summary = loading
    ? "Carregando resultados…"
    : !result
      ? "Sem execução registrada"
      : stale
        ? "Resultado de uma versão anterior"
        : incomplete
          ? "Execução incompleta"
          : result.failed
            ? "Falhas encontradas"
            : result.flaky
              ? "Testes instáveis"
              : result.notRun || result.skipped
                ? "Validação parcial"
                : result.total
                  ? "Todos os testes associados passaram"
                  : "Sem testes associados";
  const allPassed =
    !loading &&
    result &&
    !stale &&
    !incomplete &&
    result.total > 0 &&
    result.passed === result.total;
  return (
    <section
      aria-label="Confiabilidade do componente"
      className="space-y-3 rounded-xl border bg-card p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">Testes do componente</h2>
        <p
          role="status"
          className={
            allPassed
              ? "text-sm font-medium text-success"
              : "text-sm font-medium"
          }
        >
          {summary}
        </p>
      </div>
      {result && report ? (
        <>
          <p className="text-sm">
            <strong>
              {result.total}{" "}
              {result.total === 1 ? "teste associado" : "testes associados"}
            </strong>{" "}
            à última execução registrada.
          </p>
          <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {(Object.entries(labels) as [Status, string][]).map(
              ([status, label]) => (
                <div key={status} className="flex gap-1">
                  <dt>{label}:</dt>
                  <dd className="font-semibold">{result[status]}</dd>
                </div>
              ),
            )}
          </dl>
          <p className="text-xs text-muted-foreground">
            Executado em{" "}
            <time dateTime={report.generatedAt}>
              {new Date(report.generatedAt).toLocaleString("pt-BR", {
                timeZone: "UTC",
              })}{" "}
              UTC
            </time>
            {report.commit && ` · ${report.commit.slice(0, 7)}`}
            {report.dirty && " + alterações locais"}.
          </p>
          {stale && (
            <p className="text-sm">
              O código ou os testes mudaram desde essa execução. Execute
              novamente antes de considerar estes resultados atuais.
            </p>
          )}
          {incomplete && (
            <p className="text-sm">
              Uma das suítes não concluiu a execução normalmente. Os resultados
              disponíveis não representam a validação completa.
            </p>
          )}
          <details className="text-sm">
            <summary className="font-medium">Ver o que foi testado</summary>
            <div className="mt-3 space-y-4">
              {Object.entries(kinds).map(([kind, title]) => {
                const checks = result.checks.filter(
                  (check) => check.kind === kind,
                );
                return checks.length ? (
                  <div key={kind}>
                    <h3 className="font-medium">
                      {title} ({checks.length})
                    </h3>
                    <ul className="mt-2 space-y-2">
                      {checks.map((check) => (
                        <li key={check.id} className="rounded-md border p-2">
                          <span className="font-medium">
                            {labels[check.status]}
                          </span>{" "}
                          · {check.project} · {check.title}
                          {check.attempts > 1 &&
                            ` · ${check.attempts} tentativas`}
                          <span className="block break-all text-xs text-muted-foreground">
                            {check.file}:{check.line}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null;
              })}
            </div>
          </details>
          {!result.checks.some((check) => check.kind !== "render") && (
            <p className="text-sm">
              A cobertura registrada verifica a renderização. Ainda não há
              testes associados de interação ou aparência.
            </p>
          )}
        </>
      ) : (
        !loading && (
          <p className="text-sm text-muted-foreground">
            Nenhum resultado disponível. Execute a validação completa para gerar
            a contagem e os estados.
          </p>
        )
      )}
      <p className="text-xs text-muted-foreground">
        Cada cenário em desktop ou mobile conta uma vez. Novas tentativas não
        aumentam a contagem. Esses testes mostram o que foi validado; não são
        uma porcentagem de cobertura do código.
      </p>
    </section>
  );
}
