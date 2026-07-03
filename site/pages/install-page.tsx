import { CodeBlock } from "../components/code-block";

function useRegistryOrigin() {
  if (typeof window === "undefined") return "https://ui.SEU-DOMINIO.com";
  return window.location.origin;
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative border-l pl-8 pb-8 last:pb-0">
      <span className="absolute -left-3.5 flex size-7 items-center justify-center rounded-full border bg-background text-sm font-medium">
        {n}
      </span>
      <h3 className="mb-2 font-semibold tracking-tight">{title}</h3>
      <div className="grid gap-3 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export function InstallPage() {
  const origin = useRegistryOrigin();
  const registryUrl = `${origin}/r/{name}.json`;

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Instalação</h1>
        <p className="mt-2 text-muted-foreground">
          Use os componentes do LAI em qualquer projeto via CLI do shadcn —
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-sm">
            npx shadcn add @lai/&lt;item&gt;
          </code>
          copia o código com as dependências certas.
        </p>
      </header>

      <Step n={1} title="Pré-requisito: inicialize o shadcn no seu projeto">
        <p>
          Cria o <code>components.json</code> e o <code>lib/utils</code> (função{" "}
          <code>cn</code>). Pule se já tiver.
        </p>
        <CodeBlock lang="bash" code="npx shadcn@latest init" />
      </Step>

      <Step n={2} title="Registre o namespace @lai no components.json">
        <p>
          Adicione o registry do LAI ao seu <code>components.json</code>:
        </p>
        <CodeBlock
          lang="json"
          code={`{
  "registries": {
    "@lai": "${registryUrl}"
  }
}`}
        />
      </Step>

      <Step n={3} title="Aplique o tema de design">
        <p>
          Instala as cores (oklch light/dark), tipografia e a escala de raios do
          LAI no seu CSS.
        </p>
        <CodeBlock lang="bash" code="npx shadcn@latest add @lai/theme" />
      </Step>

      <Step n={4} title="Adicione componentes">
        <p>As dependências entre componentes vêm juntas automaticamente.</p>
        <CodeBlock lang="bash" code={`npx shadcn@latest add @lai/button @lai/sidebar @lai/dialog`} />
      </Step>

      <Step n={5} title="Atualizar depois">
        <p>
          Rode o <code>add</code> de novo — o shadcn baixa a versão mais recente e
          sobrescreve o arquivo. Você é dono do código (modelo copy-paste).
        </p>
        <CodeBlock lang="bash" code="npx shadcn@latest add @lai/button" />
      </Step>
    </div>
  );
}
