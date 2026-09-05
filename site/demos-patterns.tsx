import { Shimmer } from "@/components/ui/shimmer";
import { TypographyExample } from "./typography-example";
import { StatusPanel } from "@/components/status-panel";
import { DataTable } from "@/components/data-table";
import { DataPagination } from "@/components/data-pagination";
import { BottomSheet } from "@/components/bottom-sheet";
import { useState } from "react";
import type { Demo } from "./demos";
import { PageHeader } from "@/components/page-header";
import { FilterBar } from "@/components/filter-bar";
import { DataList } from "@/components/data-list";
import { ValidatedForm } from "@/components/validated-form";
import { Button } from "@/components/ui/button";

function StatusExample() {
  const [state, setState] = useState<
    "loading" | "error" | "empty" | "success" | "unavailable"
  >("empty");
  const titles = {
    loading: "Carregando registros…",
    error: "Não foi possível carregar",
    empty: "Nenhum registro",
    success: "Registros carregados",
    unavailable: "Acesso indisponível",
  };
  const descriptions = {
    loading: "Aguarde a resposta da consulta.",
    error: "A conexão falhou. Tente carregar os registros novamente.",
    empty: "Ajuste os filtros para encontrar registros.",
    success: "A consulta foi concluída.",
    unavailable: "Seu perfil não tem acesso a estes registros.",
  };
  return (
    <div className="w-full space-y-4">
      <label className="grid gap-2 text-sm">
        Estado do feedback
        <select
          className="h-10 rounded-md border bg-background px-2"
          value={state}
          onChange={(event) => setState(event.target.value as typeof state)}
        >
          {Object.keys(titles).map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <StatusPanel
        state={state}
        title={titles[state]}
        description={descriptions[state]}
        action={
          state === "error" ? (
            <Button
              variant="outline"
              onClick={() => {
                setState("loading");
                setTimeout(() => setState("success"), 500);
              }}
            >
              Tentar novamente
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}

function ListExample() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("ready");
  const items = ["Ana Souza", "Bruno Lima", "Carla Santos"].filter((name) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="w-full space-y-4">
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        onReset={() => {
          setQuery("");
          setState("ready");
        }}
      />
      <div className="flex flex-wrap gap-2">
        {[
          ["ready", "Dados"],
          ["loading", "Carregando"],
          ["error", "Erro"],
          ["empty", "Vazio"],
        ].map(([value, label]) => (
          <Button
            key={value}
            size="sm"
            variant={state === value ? "default" : "outline"}
            onClick={() => setState(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      <DataList
        items={state === "empty" ? [] : items}
        getKey={(name) => name}
        renderItem={(name) => <span>{name}</span>}
        loading={state === "loading"}
        error={state === "error" ? "Falha ao buscar os contatos." : undefined}
        onRetry={() => setState("ready")}
      />
    </div>
  );
}
function FormExample() {
  return (
    <div className="w-full max-w-md">
      <ValidatedForm
        fields={[
          {
            name: "name",
            label: "Nome",
            autoComplete: "name",
            validate: (value) =>
              value.trim() ? undefined : "Informe seu nome.",
          },
          {
            name: "email",
            label: "E-mail",
            type: "email",
            autoComplete: "email",
            description: "Usado para entrar em contato.",
            validate: (value) =>
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? undefined
                : "Informe um e-mail válido.",
          },
        ]}
        onSubmit={async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }}
      />
    </div>
  );
}
function TableExample() {
  return (
    <div className="w-full">
      <DataTable
        data={[
          { id: "ana", name: "Ana Souza" },
          { id: "bruno", name: "Bruno Lima" },
        ]}
        columns={[{ key: "name", label: "Nome", render: (item) => item.name }]}
      />
    </div>
  );
}
function PaginationExample() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  return (
    <div className="w-full">
      <DataPagination
        page={page}
        limit={limit}
        totalPages={5}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
      />
    </div>
  );
}
function BottomSheetExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir painel</Button>
      <BottomSheet
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Detalhes do contato"
      >
        <p className="text-sm text-muted-foreground">
          Informações e ações relacionadas ao contato selecionado.
        </p>
      </BottomSheet>
    </>
  );
}

function ShimmerExample() {
  const [active, setActive] = useState(true);
  return <div className="w-full space-y-5">
    <Shimmer active={active} role="status" className="text-lg">{active ? "Gerando resposta…" : "Resposta concluída"}</Shimmer>
    <div><Shimmer duration={3500} color="var(--primary)" className="text-sm text-muted-foreground">Analisando os documentos…</Shimmer></div>
    <Button variant="outline" onClick={() => setActive(value => !value)}>{active ? "Concluir geração" : "Gerar novamente"}</Button>
  </div>;
}

export const patternDemos: Demo[] = [
  {
    id: "shimmer",
    title: "Shimmer",
    description: "Brilho animado no texto para geração de respostas e tarefas em andamento.",
    node: <ShimmerExample />,
    code: `import { Shimmer } from "@/components/ui/shimmer"

<Shimmer role="status" active={loading}>Gerando resposta…</Shimmer>
<Shimmer duration={3500} color="var(--primary)">Analisando documentos…</Shimmer>`,
  },
  {
    id: "typography",
    title: "Typography",
    description: "Títulos, parágrafos, citações, listas, links e textos de apoio com a tipografia LAI.",
    node: <TypographyExample />,
    code: `import { Title, Lead, Text, InlineCode } from "@/components/ui/typography"

<Title>Uma linguagem compartilhada</Title>
<Lead>Tipografia para orientar e explicar.</Lead>
<Text>Use <InlineCode>Text</InlineCode> para o texto principal.</Text>`,
  },
  {
    id: "sidebar-profile",
    title: "Sidebar Profile",
    description: "Avatar e menu de conta com perfil, organização, instalação, tema, idioma e saída.",
    node: <iframe title="Exemplo de Sidebar Profile" src="/examples/app-shell" className="h-[560px] w-full rounded-xl border" />,
    code: `<AppShell brand="Meu produto" navigation={navigation} footer={
  <SidebarProfile
    user={{ name: "Ana Silva", email: "ana@exemplo.com" }}
    profile={{ onSelect: openProfile }}
    organization={{ onSelect: openOrganizations }}
    theme={{ value: theme, onChange: setTheme }}
    signOut={{ onSelect: signOut, pending: signingOut }}
  />
}>{children}</AppShell>`,
  },
  {
    id: "app-shell",
    title: "App Shell",
    description: "Estrutura do aplicativo com sidebar, marca, usuário, conteúdo e navegação mobile.",
    node: <iframe title="Exemplo de App Shell" src="/examples/app-shell" className="h-[560px] w-full rounded-xl border" />,
    code: `<AppShell
  brand={<strong>Minha aplicação</strong>}
  navigation={[{ id: "main", items: [{ id: "home", label: "Início", href: "/", active: true, mobile: true }] }]}
  footer={<UserMenu />}
>
  <PageHeader title="Visão geral" />
</AppShell>`,
  },
  {
    id: "status-panel",
    title: "Status Panel",
    description:
      "Feedback de carregamento, erro, vazio, sucesso e indisponibilidade.",
    node: <StatusExample />,
    code: `import { StatusPanel } from "@/components/status-panel"
<StatusPanel state="empty" title="Nenhum projeto" description="Crie o primeiro projeto para começar." />`,
  },
  {
    id: "data-table",
    title: "Data Table",
    description: "Tabela com seleção de registros e ações em lote.",
    node: <TableExample />,
    code: '<DataTable data={rows} columns={[{key: "name", label: "Nome", render: item => item.name}]} />',
  },
  {
    id: "data-pagination",
    title: "Data Pagination",
    description: "Navegação controlada por páginas e quantidade de registros.",
    node: <PaginationExample />,
    code: "<DataPagination page={page} limit={limit} totalPages={totalPages} onPageChange={setPage} onLimitChange={setLimit} />",
  },
  {
    id: "bottom-sheet",
    title: "Bottom Sheet",
    description:
      "Painel inferior controlado com alturas de abertura configuráveis.",
    node: <BottomSheetExample />,
    code: '<BottomSheet isOpen={open} onClose={() => setOpen(false)} title="Detalhes do contato">{children}</BottomSheet>',
  },
  {
    id: "page-header",
    title: "Page Header",
    description: "Título, descrição e ações de uma página.",
    node: (
      <PageHeader
        title="Contatos"
        description="Gerencie as pessoas da sua organização."
        actions={<Button>Novo contato</Button>}
      />
    ),
    code: '<PageHeader title="Contatos" description="Gerencie sua organização." actions={<Button>Novo contato</Button>} />',
  },
  {
    id: "filter-bar",
    title: "Filter Bar",
    description: "Busca controlada, filtros adicionais e ação de limpeza.",
    node: <ListExample />,
    code: 'const [query, setQuery] = useState("");\n<FilterBar query={query} onQueryChange={setQuery} onReset={() => setQuery("")} />',
  },
  {
    id: "data-list",
    title: "Data List",
    description: "Listagem com estados de carregamento, erro e vazio.",
    node: <ListExample />,
    code: "<DataList items={contacts} getKey={item => item.id} renderItem={item => item.name} loading={loading} error={error} onRetry={refetch} />",
  },
  {
    id: "validated-form",
    title: "Validated Form",
    description: "Formulário com validação, foco no erro e envio assíncrono.",
    node: <FormExample />,
    code: '<ValidatedForm fields={[{ name: "name", label: "Nome", validate: value => value.trim() ? undefined : "Informe seu nome." }]} onSubmit={async values => { await save(values); }} />',
  },
];
