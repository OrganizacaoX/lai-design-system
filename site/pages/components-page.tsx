import { ComponentPreview } from "../components/component-preview";
import { demos } from "../demos";

export function ComponentsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Componentes</h1>
        <p className="mt-2 text-muted-foreground">
          Preview ao vivo de {demos.length} componentes. Todos disponíveis no
          registry via <code className="rounded bg-muted px-1.5 py-0.5 text-sm">@lai/&lt;nome&gt;</code>.
        </p>
      </header>

      <div className="grid gap-12">
        {demos.map((d) => (
          <ComponentPreview
            key={d.id}
            id={d.id}
            title={d.title}
            description={d.description}
            code={d.code}
          >
            {d.node}
          </ComponentPreview>
        ))}
      </div>
    </div>
  );
}
