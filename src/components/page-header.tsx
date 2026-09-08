import { ArrowLeft } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLaiTranslation } from "@/hooks/use-lai-translation";

/** Destino do botão voltar. `render` recebe o Link do roteador do consumidor;
    sem ele o header cai num <a href> e o componente segue livre de roteador. */
export interface PageHeaderBack {
  href: string;
  label?: string;
  render?: ReactElement;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  /** Estado ao lado do título (versão, rascunho, status). Fica fora do <h1>
      para o leitor de tela anunciar só o título da página. */
  badges?: ReactNode;
  /** Linha discreta abaixo do título: data, identificador, origem. */
  meta?: ReactNode;
  back?: PageHeaderBack;
  /** `bar` é a versão compacta com borda inferior, para telas de altura fixa
      (canvas, editores) onde o header divide a viewport com o conteúdo. */
  variant?: "page" | "bar";
  className?: string;
}

function BackButton({ back }: { back: PageHeaderBack }) {
  const { t } = useLaiTranslation();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="-ml-2 shrink-0"
      aria-label={back.label ?? t("pageHeader.back", {}, "Voltar")}
      render={back.render ?? <a href={back.href} />}
      nativeButton={false}
      role="link"
    >
      <ArrowLeft />
    </Button>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  badges,
  meta,
  back,
  variant = "page",
  className,
}: PageHeaderProps) {
  // Um único tamanho de título nas duas variantes: é o token que mantém todas
  // as telas do app alinhadas, inclusive as compactas.
  const heading = (
    <h1 className="text-[length:var(--text-page-title)] font-semibold tracking-tight">
      {title}
    </h1>
  );

  if (variant === "bar") {
    return (
      <header
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 md:px-6",
          className,
        )}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {back && <BackButton back={back} />}
          {heading}
          {badges}
          {description && (
            <span className="text-sm text-muted-foreground">{description}</span>
          )}
          {meta && <span className="text-xs text-muted-foreground">{meta}</span>}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </header>
    );
  }

  return (
    <header className={cn("space-y-3", className)}>
      {breadcrumbs}
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* O botão voltar fica fora da coluna do título para descrição e meta
            continuarem alinhadas com o <h1>, e não recuadas sob a seta. */}
        <div className="flex min-w-0 items-start gap-2">
          {back && <BackButton back={back} />}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {heading}
              {badges}
            </div>
            {description && (
              <p className="mt-2 text-muted-foreground">{description}</p>
            )}
            {meta && (
              <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  );
}
