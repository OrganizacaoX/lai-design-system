import { useEffect, useState } from "react";
import {
  Check,
  CircleCheck,
  CircleDashed,
  CircleMinus,
  CircleX,
  Clock3,
  FlaskConical,
  History,
  TriangleAlert,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
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
const statusIcons = {
  passed: CircleCheck,
  failed: CircleX,
  flaky: TriangleAlert,
  skipped: CircleMinus,
  notRun: CircleDashed,
};
const checkLabels: Record<Status, string> = {
  passed: "Aprovado",
  failed: "Falhou",
  flaky: "Instável",
  skipped: "Ignorado",
  notRun: "Não executado",
};
const statusColors: Record<Status, string> = {
  passed: "text-success",
  failed: "text-destructive",
  flaky: "text-warning-foreground",
  skipped: "text-muted-foreground",
  notRun: "text-muted-foreground",
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
  const SummaryIcon = allPassed
    ? CircleCheck
    : stale
      ? History
      : result?.failed
        ? CircleX
        : incomplete || result?.flaky
          ? TriangleAlert
          : FlaskConical;
  return (
    <Card role="region" aria-label="Confiabilidade do componente">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl",
              allPassed
                ? "bg-success/10 text-success"
                : "bg-muted text-muted-foreground",
            )}
          >
            <SummaryIcon className="size-6" aria-hidden="true" />
          </div>
          <div className="min-w-0 space-y-1">
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {result && report ? (
            <>
              <p className="text-sm text-muted-foreground">
                <strong>
                  {result.total}{" "}
                  {result.total === 1 ? "teste associado" : "testes associados"}
                </strong>{" "}
                à última execução registrada.
              </p>
              <dl className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {(Object.entries(labels) as [Status, string][]).map(
                  ([status, label]) => {
                    const Icon = statusIcons[status];
                    const highlighted =
                      result[status] > 0 && !stale && !incomplete;
                    return (
                      <div
                        key={status}
                        className={cn(
                          "rounded-lg p-3",
                          highlighted && status === "passed"
                            ? "bg-success/10"
                            : "bg-muted/50",
                        )}
                      >
                        <dt className="text-xs text-muted-foreground">
                          {label}
                        </dt>
                        <dd
                          className={cn(
                            "mt-2 flex items-center gap-2 text-2xl font-semibold tabular-nums",
                            highlighted
                              ? statusColors[status]
                              : "text-muted-foreground",
                          )}
                        >
                          <Icon
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                          {result[status]}
                        </dd>
                      </div>
                    );
                  },
                )}
              </dl>
              <p className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-muted-foreground">
                <Clock3 className="mr-1 size-3.5" aria-hidden="true" />
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
                <p className="rounded-lg bg-muted p-3 text-sm">
                  O código ou os testes mudaram desde essa execução. Execute
                  novamente antes de considerar estes resultados atuais.
                </p>
              )}
              {incomplete && (
                <p className="rounded-lg bg-muted p-3 text-sm">
                  Uma das suítes não concluiu a execução normalmente. Os
                  resultados disponíveis não representam a validação completa.
                </p>
              )}
              <Collapsible>
                <CollapsibleTrigger
                  render={<Button variant="outline" size="sm" />}
                >
                  Ver o que foi testado
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-4 space-y-5">
                    {Object.entries(kinds).map(([kind, title]) => {
                      const checks = result.checks.filter(
                        (check) => check.kind === kind,
                      );
                      return checks.length ? (
                        <div key={kind}>
                          <h3 className="text-sm font-medium">
                            {title} ({checks.length})
                          </h3>
                          <ul className="mt-2 divide-y divide-border">
                            {checks.map((check) => {
                              const Icon =
                                check.status === "passed"
                                  ? Check
                                  : statusIcons[check.status];
                              return (
                                <li
                                  key={check.id}
                                  className="flex items-start gap-3 py-3"
                                >
                                  <span
                                    className={cn(
                                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                                      check.status === "passed" &&
                                        !stale &&
                                        !incomplete
                                        ? "bg-success/10 text-success"
                                        : "bg-muted text-muted-foreground",
                                      check.status === "failed" &&
                                        "bg-destructive/10 text-destructive",
                                    )}
                                  >
                                    <Icon
                                      className="size-3.5"
                                      aria-hidden="true"
                                    />
                                    <span className="sr-only">
                                      {checkLabels[check.status]}
                                    </span>
                                  </span>
                                  <div className="min-w-0 flex-1 space-y-1">
                                    <p className="text-sm font-medium wrap-anywhere">
                                      {check.title}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                      <Badge variant="secondary">
                                        {check.project}
                                      </Badge>
                                      <span>{checkLabels[check.status]}</span>
                                      {check.attempts > 1 && (
                                        <span>{check.attempts} tentativas</span>
                                      )}
                                    </div>
                                    <p className="break-all text-xs text-muted-foreground">
                                      {check.file}:{check.line}
                                    </p>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              {!result.checks.some((check) => check.kind !== "render") && (
                <p className="text-xs text-muted-foreground">
                  A cobertura registrada verifica a renderização. Ainda não há
                  testes associados de interação ou aparência.
                </p>
              )}
            </>
          ) : (
            !loading && (
              <p className="text-sm text-muted-foreground">
                Nenhum resultado disponível. Execute a validação completa para
                gerar a contagem e os estados.
              </p>
            )
          )}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Cada cenário em desktop ou mobile conta uma vez. Novas tentativas não
          aumentam a contagem. Esses testes mostram o que foi validado; não são
          uma porcentagem de cobertura do código.
        </p>
      </CardFooter>
    </Card>
  );
}
