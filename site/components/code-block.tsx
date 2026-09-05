import { useState } from "react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Tema ligado às CSS vars de code-theme.css — adapta ao light/dark sozinho.
const laiCodeTheme: PrismTheme = {
  plain: { color: "var(--code-fg)", backgroundColor: "transparent" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "var(--code-comment)", fontStyle: "italic" },
    },
    { types: ["punctuation"], style: { color: "var(--code-punctuation)" } },
    {
      types: ["keyword", "control-flow", "at-rule", "important", "unit"],
      style: { color: "var(--code-keyword)" },
    },
    {
      types: ["string", "attr-value", "char", "inserted", "url"],
      style: { color: "var(--code-string)" },
    },
    {
      types: ["tag", "class-name", "selector", "builtin"],
      style: { color: "var(--code-tag)" },
    },
    {
      types: ["attr-name", "function", "property"],
      style: { color: "var(--code-attr)" },
    },
    {
      types: ["number", "boolean", "constant", "symbol"],
      style: { color: "var(--code-number)" },
    },
    {
      types: ["operator", "entity", "variable", "plain"],
      style: { color: "var(--code-fg)" },
    },
  ],
};

export function CodeBlock({
  code,
  lang = "tsx",
  className,
}: {
  code: string;
  lang?: "tsx" | "bash" | "json" | "jsx";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard indisponível */
    }
  };

  return (
    <div className={cn("group relative min-w-0 max-w-full", className)}>
      <Highlight theme={laiCodeTheme} code={code} language={lang}>
        {({ className: hlClass, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            tabIndex={0}
            aria-label="Exemplo de código"
            className={cn(
              hlClass,
              "overflow-x-auto rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed",
            )}
            style={style}
          >
            <code className="font-mono">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
      <Button
        size="icon"
        variant="ghost"
        onClick={copy}
        className="absolute right-2 top-2 size-7 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        aria-label="Copiar"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </Button>
    </div>
  );
}
