import { useEffect, useState } from "react";
import { Check, CircleAlert, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import type { AccessibilityReport } from "../accessibility-report";
import source from "../test-source.json";

const labels = {
  passed: "Aprovado",
  failed: "Falha",
  review: "Revisão manual",
  inapplicable: "Não se aplica ao exemplo",
};
const names: Record<string, string> = {
  "color-contrast": "Contraste de texto",
  "target-size": "Tamanho e espaçamento dos alvos (24 px)",
  "button-name": "Nome acessível dos botões",
  "link-name": "Nome acessível dos links",
  "image-alt": "Alternativa textual das imagens",
  label: "Rótulos dos campos",
};
export function AccessibilityResults({ id }: { id: string }) {
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/component-accessibility.json", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  const runs = report?.components?.[id];
  if (!runs?.length)
    return (
      <p role="status">
        {loading
          ? "Carregando auditoria…"
          : "Sem auditoria registrada para este componente."}
      </p>
    );
  const stale = report?.fingerprint !== source.fingerprint;
  const failed = runs.reduce(
    (sum, run) =>
      sum + run.rules.filter((rule) => rule.status === "failed").length,
    0,
  );
  const review = runs.reduce(
    (sum, run) =>
      sum + run.rules.filter((rule) => rule.status === "review").length,
    0,
  );
  const errors = runs.filter((run) => run.error).length;
  return (
    <div className="space-y-4">
      <p className="font-medium" role="status">
        {stale
          ? "Auditoria de uma versão anterior"
          : errors
            ? "Auditoria incompleta"
            : failed
              ? `${failed} falhas encontradas nos cenários`
              : review
                ? "Há verificações que exigem revisão manual"
                : "Nenhuma falha automática encontrada no exemplo"}
      </p>
      <p className="text-sm text-muted-foreground">
        {report?.engine} ·{" "}
        {report?.generatedAt
          ? new Date(report.generatedAt).toLocaleString("pt-BR")
          : ""}
        . Exemplo no estado inicial, em tema claro/escuro e mobile/desktop.
        Menus e diálogos fechados não estão cobertos.
      </p>
      {runs.map((run) => (
        <Collapsible key={`${id}-${run.width}-${run.theme}`}>
          <CollapsibleTrigger render={<Button variant="outline" />}>
            {run.width}px · {run.theme === "dark" ? "Escuro" : "Claro"} · Ver
            resultados
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-3 py-4">
              {run.error ? (
                <p className="text-destructive">
                  A execução deste cenário não terminou.
                </p>
              ) : null}
              <p className="text-sm text-muted-foreground">
                Tamanhos de texto observados:{" "}
                {run.textSizes.length
                  ? `${run.textSizes.join(", ")} px`
                  : "sem texto visível"}
                . Medição informativa; tamanho de fonte sozinho não determina
                conformidade.
              </p>
              <ul className="space-y-3">
                {[...run.rules]
                  .sort(
                    (a, b) =>
                      ({ failed: 0, review: 1, passed: 2, inapplicable: 3 })[
                        a.status
                      ] -
                      { failed: 0, review: 1, passed: 2, inapplicable: 3 }[
                        b.status
                      ],
                  )
                  .map((rule) => (
                    <li
                      key={`${rule.id}-${rule.status}`}
                      className="space-y-1 text-sm"
                    >
                      <div className="flex items-start gap-2">
                        {rule.status === "passed" && !stale ? (
                          <Check
                            aria-hidden="true"
                            className="size-4 shrink-0 text-success"
                          />
                        ) : rule.status === "failed" ? (
                          <CircleAlert
                            aria-hidden="true"
                            className="size-4 shrink-0 text-destructive"
                          />
                        ) : (
                          <CircleHelp
                            aria-hidden="true"
                            className="size-4 shrink-0 text-muted-foreground"
                          />
                        )}
                        <span>
                          <a
                            href={rule.url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                          >
                            {names[rule.id] ?? rule.title}
                          </a>{" "}
                          — {labels[rule.status]}
                          {stale ? " (versão anterior)" : ""}
                        </span>
                      </div>
                      {rule.nodes.map((node, index) => (
                        <div
                          key={`${node.target}-${index}`}
                          className="ml-6 space-y-1 wrap-anywhere text-muted-foreground"
                        >
                          <code>{node.target}</code>
                          <p className="whitespace-pre-wrap">{node.detail}</p>
                        </div>
                      ))}
                    </li>
                  ))}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
      <p className="text-sm text-muted-foreground">
        Revisão manual pendente: navegação por teclado, foco visível,
        zoom/refluxo, leitor de tela e contraste de ícones e estados. A
        auditoria automática não certifica a acessibilidade completa.
      </p>
    </div>
  );
}
