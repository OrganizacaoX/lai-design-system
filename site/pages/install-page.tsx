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
      <div className="grid min-w-0 grid-cols-1 gap-3 text-sm text-muted-foreground">
        {children}
      </div>
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
          Instale o pacote para atualizar por versão ou copie componentes pelo
          registry para personalizar o código no seu projeto.
        </p>
      </header>

      <section className="mb-10 space-y-4">
        <h2 className="text-xl font-semibold">Pacote — GitHub Packages</h2>
        <p className="text-sm text-muted-foreground">
          O pacote completo requer React 19. Configure o registry no .npmrc do
          projeto e a autenticação no .npmrc pessoal. Use um token classic com
          read:packages; não inclua seu valor no repositório.
        </p>
        <CodeBlock
          lang="bash"
          code={
            "# .npmrc do projeto\n@organizacaox:registry=https://npm.pkg.github.com\n\n# ~/.npmrc pessoal\n//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}"
          }
        />
        <p className="text-sm text-muted-foreground">
          Disponibilize GITHUB_PACKAGES_TOKEN no ambiente da máquina ou no
          gerenciador de segredos do CI. Depois instale:
        </p>
        <CodeBlock
          lang="bash"
          code="bun add @organizacaox/lai-design-system"
        />
        <CodeBlock
          code={
            'import "@organizacaox/lai-design-system/styles.css";\nimport { Button, ThemeProvider, Toaster } from "@organizacaox/lai-design-system";\n\nfunction App() {\n  return <ThemeProvider><Button>Salvar contato</Button><Toaster /></ThemeProvider>;\n}'
          }
        />
        <p className="text-sm text-muted-foreground">
          Importe os estilos uma vez e monte ThemeProvider e Toaster na raiz.
          Atualize a versão do pacote e confira o changelog antes de adotar
          alterações de API ou tokens.
        </p>
      </section>
      <h2 className="mb-4 text-xl font-semibold">
        Registry — código no seu projeto
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Os requisitos dependem dos itens instalados. Questionnaire e Message
        Scroller exigem React 19; os componentes independentes usados na
        validação do registry também funcionam em React 18.
      </p>
      <Step n={1} title="Pré-requisito: inicialize o shadcn no seu projeto">
        <p>
          Cria o <code>components.json</code> e o <code>lib/utils</code> (função{" "}
          <code>cn</code>). Pule se já tiver.
        </p>
        <CodeBlock lang="bash" code="bunx shadcn@latest init" />
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
        <CodeBlock lang="bash" code="bunx shadcn@latest add @lai/theme" />
      </Step>

      <Step n={4} title="Adicione componentes">
        <p>As dependências entre componentes vêm juntas automaticamente.</p>
        <CodeBlock
          lang="bash"
          code={`bunx shadcn@latest add @lai/button @lai/sidebar @lai/dialog`}
        />
      </Step>

      <Step n={5} title="Atualizar depois">
        <p>
          Rode o <code>add</code> de novo — o shadcn baixa a versão mais recente
          e sobrescreve o arquivo. Você é dono do código (modelo copy-paste).
        </p>
        <CodeBlock lang="bash" code="bunx shadcn@latest add @lai/button" />
      </Step>
    </div>
  );
}
