import { usageGuidance } from "../usage-guidance";
import { ControlStates } from "../components/control-states";
import { lazy, Suspense, useEffect, useState } from "react";
import { ComponentPreview } from "../components/component-preview";
import { CodeBlock } from "../components/code-block";
import catalog from "../catalog.json";
import type { Demo } from "../demos";

const DateRangeOptions = lazy(() =>
  import("../components/date-range-options").then((m) => ({
    default: m.DateRangeOptions,
  })),
);

const loaders = {
  messaging: () => import("../demos-messaging").then((m) => m.messagingDemos),
  patterns: () => import("../demos-patterns").then((m) => m.patternDemos),
  core: () => import("../demos").then((m) => m.demos),
  extra: () => import("../demos-extra").then((m) => m.extraDemos),
  advanced: () => import("../demos-advanced").then((m) => m.advancedDemos),
};
const guidance: Record<string, string> = {
  button:
    "Use default para a ação principal, outline ou secondary para alternativas, ghost para ações discretas e destructive para ações destrutivas. Evite múltiplas ações primárias no mesmo grupo. Durante envio, mantenha o rótulo, mostre progresso e impeça submissões repetidas.",
  input:
    "Use para texto curto com Label associado por htmlFor/id. Para conteúdo longo, use Textarea; para escolha fechada, Select. Associe ajuda e erro com aria-describedby e marque erros com aria-invalid.",
  select:
    "Use para escolher uma opção de um conjunto conhecido. Prefira Combobox quando houver muitas opções ou necessidade de busca. Forneça um rótulo acessível ao gatilho e mostre a seleção atual.",
  "date-range-picker":
    "Use em filtros por período. O padrão bloqueia datas futuras; allowFuture libera agendamentos. Personalize locale, placeholder, ariaLabel e presets para outro idioma. minDate/maxDate também limitam os atalhos. No mobile, exibe um mês.",
};
export function ComponentsPage({ id = "" }: { id?: string }) {
  const entry = catalog.find((item) => item.id === id);
  const [loaded, setLoaded] = useState<{
    id: string;
    demo?: Demo;
    error?: string;
  }>();
  useEffect(() => {
    if (!entry) return;
    let active = true;
    loaders[entry.group as keyof typeof loaders]()
      .then((demos) => {
        if (active) setLoaded({ id, demo: demos.find((d) => d.id === id) });
      })
      .catch(() => {
        if (active)
          setLoaded({
            id,
            error:
              "Não foi possível carregar o exemplo. Recarregue a página para tentar novamente.",
          });
      });
    return () => {
      active = false;
    };
  }, [id, entry]);
  if (!id)
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-semibold">Componentes</h1>
          <p className="mt-2 text-muted-foreground">
            Escolha um componente para ver exemplos, API e orientações de uso.
          </p>
        </header>
        <div className="grid gap-3 sm:grid-cols-2">
          {catalog.map((item) => (
            <a
              key={item.id}
              href={`/componentes/${item.id}`}
              className="rounded-xl border p-4 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              <h2 className="font-medium">{item.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    );
  if (!entry)
    return (
      <div>
        <h1 className="text-2xl font-semibold">Componente não encontrado</h1>
        <a href="/componentes" className="text-primary underline">
          Voltar ao catálogo
        </a>
      </div>
    );
  const demo = loaded?.id === id ? loaded.demo : undefined;
  return (
    <article className="space-y-8">
      <header>
        <a href="/componentes" className="text-sm text-primary underline">
          Todos os componentes
        </a>
        <h1 className="mt-3 text-3xl font-semibold">{entry.title}</h1>
        <p className="mt-2 text-muted-foreground">{entry.description}</p>
      </header>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Quando usar</h2>
        <p className="leading-relaxed text-muted-foreground">
          {guidance[id] ??
            usageGuidance[id] ??
            `${entry.description} Combine com os demais componentes do LAI e preserve a semântica dos elementos. Use as partes exportadas na composição demonstrada abaixo; personalize a aparência com tokens antes de adicionar estilos locais.`}
        </p>
      </section>
      {demo ? (
        <ComponentPreview id={`example-${id}`} title="Exemplo" code={demo.code}>
          {demo.node}
        </ComponentPreview>
      ) : (
        <p role="status">
          {loaded?.id === id && loaded.error
            ? loaded.error
            : "Carregando exemplo…"}
        </p>
      )}
      <ControlStates id={id} />
      {id === "date-range-picker" && (
        <Suspense fallback={<p role="status">Carregando opções…</p>}>
          <DateRangeOptions />
        </Suspense>
      )}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Instalação</h2>
        <p className="text-sm text-muted-foreground">
          Pacote: configure a autenticação no{" "}
          <a href="/instalacao" className="text-primary underline">
            guia de instalação
          </a>{" "}
          e importe os estilos uma vez.
        </p>
        <CodeBlock
          code={
            'bun add @organizacaox/lai-design-system\n\nimport "@organizacaox/lai-design-system/styles.css";'
          }
        />
        <p className="text-sm text-muted-foreground">
          Registry: com o namespace @lai configurado, copie o componente e suas
          dependências.
        </p>
        <CodeBlock code={`bunx shadcn@latest add @lai/${id}`} />
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">API e valores padrão</h2>
        <p className="text-sm text-muted-foreground">
          Assinaturas extraídas do código-fonte. Valores após = são os padrões;
          props restantes são encaminhadas ao elemento ou primitiva indicada
          pelo tipo.
        </p>
        <details className="rounded-lg border p-3">
          <summary className="cursor-pointer font-medium">
            Ver assinaturas e propriedades
          </summary>
          <div className="mt-3">
            <CodeBlock
              code={entry.api || "Consulte os tipos exportados pelo pacote."}
            />
          </div>
        </details>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Estados e acessibilidade</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Controles interativos precisam de nome acessível e foco visível.
            Navegue por Tab e Shift+Tab; botões devem funcionar por teclado.
          </li>
          <li>
            Em campos, associe rótulo, ajuda e erro. Use disabled apenas quando
            a ação estiver indisponível; explique o motivo próximo ao controle.
          </li>
          <li>
            Durante carregamento, preserve o contexto e anuncie o progresso com
            role="status" ou aria-busy. Mostre erro com uma ação de recuperação.
          </li>
          <li>
            Em menus, seletores e diálogos, verifique setas, Escape e retorno do
            foco ao gatilho. Não esconda o foco atrás de cabeçalhos fixos.
          </li>
          <li>
            Confira claro/escuro, texto longo e largura mobile. Estados não
            devem depender apenas da cor.
          </li>
        </ul>
      </section>
    </article>
  );
}
