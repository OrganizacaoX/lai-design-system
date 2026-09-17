import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { accessibilityGuidance } from "../accessibility-guidance";

export function ComponentAccessibility({ id }: { id: string }) {
  const guidance = accessibilityGuidance[id];
  if (!guidance) return null;

  return (
    <section aria-labelledby="accessibility-title">
      <Card>
        <CardHeader>
          <h2 id="accessibility-title" className="text-xl font-semibold">
            Acessibilidade
          </h2>
          <p className="text-sm text-muted-foreground">
            Use estas orientações ao compor e validar o componente no seu
            produto. A acessibilidade também depende dos rótulos, do conteúdo e
            das interações da página.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Semântica e rótulos", guidance.semantics],
              ["Teclado e foco", guidance.keyboard],
              ["Cuidados de uso", guidance.usage],
            ].map(([title, description]) => (
              <div key={title} className="space-y-2">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Na composição final, confira a navegação por teclado, a leitura com
            leitor de tela, o zoom e os temas claro e escuro. Os resultados dos
            testes executados estão na seção Testes do componente.
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
