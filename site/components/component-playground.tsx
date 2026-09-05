import { useId, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";
import { CodeBlock } from "./code-block";

export function ComponentPlayground({ id }: { id: string }) {
  const uid = useId();
  const [variant, setVariant] =
    useState<NonNullable<ButtonProps["variant"]>>("default");
  const [size, setSize] = useState<NonNullable<ButtonProps["size"]>>("default");
  const [density, setDensity] = useState("comfortable");
  const [state, setState] = useState("default");
  const { resolvedTheme, setTheme } = useTheme();
  if (!["button", "input", "select"].includes(id)) return null;
  const disabled = state === "disabled";
  const invalid = state === "error";
  const props = `${disabled ? " disabled" : ""}${invalid ? ' aria-invalid="true" aria-describedby="playground-error"' : ""}`;
  const example =
    id === "button"
      ? `<Button variant="${variant}" size="${size}"${disabled ? " disabled" : ""}${state === "loading" ? ' loading loadingLabel="Salvando…"' : ""}>Salvar</Button>`
      : id === "input"
        ? `<label htmlFor="name">Nome</label>\n<Input id="name"${props} />`
        : `<Select>\n  <SelectTrigger aria-label="Equipe"${props}><SelectValue placeholder="Selecionar equipe" /></SelectTrigger>\n  <SelectContent><SelectItem value="design">Design</SelectItem><SelectItem value="produto">Produto</SelectItem></SelectContent>\n</Select>`;
  const imports = id === "button" ? "Button" : id === "input" ? "Input" : "Select, SelectTrigger, SelectValue, SelectContent, SelectItem";
  const code = `import { ThemeProvider, ${imports} } from "@organizacaox/lai-design-system";\nimport "@organizacaox/lai-design-system/styles.css";\n\nexport function Example() {\n  return (\n    <ThemeProvider forcedTheme="${resolvedTheme}">\n      <div data-density="${density}">\n${example}\n${invalid ? '<p id="playground-error">Revise o valor informado.</p>\n' : ""}      </div>\n    </ThemeProvider>\n  );\n}`;
  const control = (
    label: string,
    value: string,
    change: (v: string) => void,
    options: string[],
  ) => (
    <label className="grid gap-1 text-sm">
      {label}
      <select
        className="h-10 rounded-md border bg-background px-2"
        value={value}
        onChange={(e) => change(e.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
  return (
    <section aria-label="Playground" className="space-y-4">
      <h2 className="text-xl font-semibold">Playground</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {id === "button" &&
          control("Variante", variant, (v) => setVariant(v as typeof variant), [
            "default",
            "secondary",
            "outline",
            "ghost",
            "destructive",
            "link",
          ])}
        {id === "button" &&
          control("Tamanho", size, (v) => setSize(v as typeof size), [
            "xs",
            "sm",
            "default",
            "lg",
          ])}
        {control("Densidade", density, setDensity, ["comfortable", "compact"])}
        {control("Tema do playground", resolvedTheme ?? "light", setTheme, [
          "light",
          "dark",
        ])}
        {control(
          "Estado",
          state,
          setState,
          id === "button"
            ? ["default", "loading", "disabled"]
            : ["default", "error", "disabled"],
        )}
      </div>
      <div
        data-testid="playground-preview"
        data-density={density}
        className="rounded-xl border bg-card p-6"
      >
        {id === "button" ? (
          <Button
            variant={variant}
            size={size}
            disabled={disabled}
            loading={state === "loading"}
            loadingLabel="Salvando…"
          >
            Salvar
          </Button>
        ) : id === "input" ? (
          <div className="space-y-2">
            <label htmlFor={uid}>Nome</label>
            <Input
              id={uid}
              disabled={disabled}
              aria-invalid={invalid || undefined}
              aria-describedby={invalid ? `${uid}-error` : undefined}
            />
          </div>
        ) : (
          <Select>
            <SelectTrigger
              aria-label="Equipe"
              disabled={disabled}
              aria-invalid={invalid || undefined}
              aria-describedby={invalid ? `${uid}-error` : undefined}
            >
              <SelectValue placeholder="Selecionar equipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="produto">Produto</SelectItem>
            </SelectContent>
          </Select>
        )}
        {invalid && (
          <p id={`${uid}-error`} className="mt-2 text-sm text-destructive">
            Revise o valor informado.
          </p>
        )}
      </div>
      <CodeBlock code={code} />
    </section>
  );
}
