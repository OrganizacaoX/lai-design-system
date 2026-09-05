import { useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeBlock } from "./code-block";

function foreground(hex: string) {
  const channels = hex
    .slice(1)
    .match(/../g)!
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const luminance =
    channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return luminance > 0.179 ? "#000000" : "#ffffff";
}
export function ThemeCustomizer() {
  const [brand, setBrand] = useState("#514bb8");
  const [radius, setRadius] = useState("0.75");
  const [density, setDensity] = useState("comfortable");
  const [font, setFont] = useState("Google Sans Flex");
  const tokens = {
    "--primary": brand,
    "--primary-foreground": foreground(brand),
    "--ring": brand,
    "--radius": `${radius}rem`,
    "--control-height": density === "compact" ? "2.25rem" : "2.75rem",
    "--control-padding": density === "compact" ? ".5rem" : ".625rem",
    "--font-sans":
      font === "system-ui"
        ? "system-ui, sans-serif"
        : '"Google Sans Flex", ui-sans-serif, system-ui, sans-serif',
  };
  const css = `/* Importe depois do CSS do LAI. Aplicável aos dois temas. */\n:root, .dark {\n${Object.entries(
    tokens,
  )
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n")}\n}\nhtml { font-family: var(--font-sans); }`;
  return (
    <section aria-label="Personalização visual" className="space-y-4">
      <h2 className="text-xl font-semibold">Personalização visual</h2>
      <p className="text-sm text-muted-foreground">
        Configure a marca, confira os controles e exporte os tokens. O texto da
        ação principal alterna entre preto e branco conforme a cor escolhida;
        confira também os estados de foco no contexto do produto.
      </p>
      <div className="grid gap-3 sm:grid-cols-4">
        <label className="grid gap-1 text-sm">
          Cor da marca
          <input
            type="color"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="h-10 w-full"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Raio
          <select
            className="h-10 rounded-md border bg-background"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          >
            {["0", "0.5", "0.75", "1"].map((v) => (
              <option key={v} value={v}>
                {v} rem
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Densidade da marca
          <select
            className="h-10 rounded-md border bg-background"
            value={density}
            onChange={(e) => setDensity(e.target.value)}
          >
            <option value="comfortable">Confortável</option>
            <option value="compact">Compacta</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Fonte
          <select
            className="h-10 rounded-md border bg-background"
            value={font}
            onChange={(e) => setFont(e.target.value)}
          >
            <option>Google Sans Flex</option>
            <option>system-ui</option>
          </select>
        </label>
      </div>
      <div
        data-testid="theme-preview"
        style={{ ...tokens, fontFamily: "var(--font-sans)" } as CSSProperties}
        className="space-y-4 rounded-xl border bg-card p-6"
      >
        <p className="text-xl font-semibold">Sua marca com LAI</p>
        <label className="grid gap-2">
          Nome do projeto
          <Input placeholder="Novo projeto" />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button>Salvar projeto</Button>
          <Button variant="outline">Cancelar</Button>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={() => {
          const url = URL.createObjectURL(
            new Blob([css], { type: "text/css" }),
          );
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = "lai-theme.css";
          anchor.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }}
      >
        Baixar tema CSS
      </Button>
      <CodeBlock code={css} lang="css" />
    </section>
  );
}
