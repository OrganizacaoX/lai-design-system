import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function FoundationsPage() {
  const [density, setDensity] = useState<"comfortable" | "compact">(
    "comfortable",
  );
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-[length:var(--text-page-title)] font-semibold">
          Fundamentos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tokens e componentes reais do LAI. Alterne o tema para comparar as
          aplicações.
        </p>
      </header>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Cores semânticas</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            "primary",
            "secondary",
            "muted",
            "accent",
            "destructive",
            "success",
            "warning",
            "info",
          ].map((token) => (
            <div key={token} className="overflow-hidden rounded-lg border">
              <div className="h-20" style={{ background: `var(--${token})` }} />
              <p className="p-3 font-mono text-sm">{token}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Use sucesso para conclusão, aviso para atenção e informação para
          contexto. Combine cor com texto ou ícone; destructive identifica ações
          ou erros destrutivos.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Gráficos</h2>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1">
              <div
                className="h-16 rounded-md"
                style={{ background: `var(--chart-${i})` }}
              />
              <p className="mt-2 text-xs">Série {i}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Use rótulos e padrões de linha para distinguir séries além da cor.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tipografia</h2>
        {[
          ["page-title", "Título da página"],
          ["section-title", "Título da seção"],
          ["body", "Texto de conteúdo"],
          ["caption", "Legenda e informação auxiliar"],
        ].map(([token, label]) => (
          <p key={token} style={{ fontSize: `var(--text-${token})` }}>
            {label}{" "}
            <code className="text-xs text-muted-foreground">
              --text-{token}
            </code>
          </p>
        ))}
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Densidade</h2>
        <div className="flex gap-2">
          <Button
            variant={density === "comfortable" ? "default" : "outline"}
            onClick={() => setDensity("comfortable")}
          >
            Confortável
          </Button>
          <Button
            variant={density === "compact" ? "default" : "outline"}
            onClick={() => setDensity("compact")}
          >
            Compacta
          </Button>
        </div>
        <div
          data-density={density}
          className="flex flex-wrap items-center gap-3 rounded-xl border p-4"
        >
          <Input
            aria-label="Nome de exemplo"
            placeholder="Nome"
            className="w-44"
          />
          <Select
            items={[{ label: "Ativo", value: "active" }]}
            defaultValue="active"
          >
            <SelectTrigger aria-label="Status de exemplo">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativo</SelectItem>
            </SelectContent>
          </Select>
          <Button>Salvar</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Confortável: 44px, padrão para formulários. Compacta: 36px, para
          ferramentas com maior volume de informação. Aplique data-density no
          contêiner. Variantes explícitas de tamanho permanecem disponíveis.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Elevação e movimento</h2>
        <div className="flex flex-wrap gap-6">
          {["surface", "overlay"].map((value) => (
            <div
              key={value}
              className="rounded-xl bg-card p-6"
              style={{ boxShadow: `var(--elevation-${value})` }}
            >
              {value}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          120ms para feedback dos controles; 200ms para transições de contexto.
          A preferência de movimento reduzido desativa as transições. Use bordas
          para agrupar conteúdo e elevação para indicar sobreposição.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Composição de telas</h2>
        <p className="text-sm text-muted-foreground">
          Comece com um cabeçalho, seguido de filtros e resultados. Em
          formulários, mantenha rótulo, controle, descrição e erro juntos. Ações
          ficam ao fim. Na primeira carga, preserve a forma do conteúdo com
          Skeleton; durante uma ação, mostre progresso junto ao botão.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["page-header", "Cabeçalho com ações"],
            ["filter-bar", "Barra de filtros"],
            ["data-list", "Listagem e recuperação"],
            ["validated-form", "Formulário com validação"],
          ].map(([id, title]) => (
            <a
              key={id}
              href={`/componentes/${id}`}
              className="rounded-lg border p-4 text-primary underline"
            >
              {title}
            </a>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Voz e escrita</h2>
        <p className="text-sm text-muted-foreground">
          Use frases curtas, sujeito concreto e verbos no presente. Botões
          descrevem ação e objeto: Importar lista, Salvar contato. Erros
          explicam o que aconteceu e o próximo passo: Informe DDD e número.
          Estados vazios dizem qual conteúdo aparecerá e como começar. Formate
          números e datas conforme o idioma do usuário.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Ícones</h2>
        <p className="text-sm text-muted-foreground">
          Use Lucide: 16px nos controles padrão, 14px nos pequenos e 12px nos
          extras pequenos. Preserve um ícone por conceito: Search para busca,
          Settings para ajustes, Phone para ligar, FileText para transcrição e
          BarChart3 para relatórios. Ícones decorativos ficam ocultos de
          leitores de tela; botões só com ícone recebem aria-label.
        </p>
      </section>
    </div>
  );
}
