import { useRef, useState } from "react";
import { DataTable } from "@/components/data-table";
import { DataPagination } from "@/components/data-pagination";
import { FilterBar } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { ValidatedForm } from "@/components/validated-form";
import { StatusPanel } from "@/components/status-panel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";

const initialPeople = [
  { id: "ana", name: "Ana Souza", email: "ana@example.com" },
  { id: "bruno", name: "Bruno Lima", email: "bruno@example.com" },
  { id: "carla", name: "Carla Santos", email: "carla@example.com" },
];
export function WorkflowDemo() {
  const [people, setPeople] = useState(initialPeople);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [selected, setSelected] = useState<string>();
  const [mode, setMode] = useState("details");
  const [feedback, setFeedback] = useState("");
  const listHeading = useRef<HTMLHeadingElement>(null);
  const person = people.find((p) => p.id === selected);
  const filtered = people.filter((p) =>
    `${p.name} ${p.email}`.toLowerCase().includes(query.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / limit);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  return (
    <section
      aria-label="Fluxo completo de contatos"
      className="space-y-4 rounded-xl border p-4 sm:p-6"
    >
      <h2
        ref={listHeading}
        tabIndex={-1}
        className="text-xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Padrão de gestão de contatos
      </h2>
      <PageHeader
        title="Contatos"
        description="Exemplo interativo com dados locais: filtre, abra detalhes, edite e exclua."
        actions={
          <Button
            variant="outline"
            onClick={() => {
              setPeople(initialPeople);
              setQuery("");
              setPage(1);
              setFeedback("");
            }}
          >
            Restaurar exemplo
          </Button>
        }
      />
      <FilterBar
        query={query}
        onQueryChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        onReset={() => {
          setQuery("");
          setPage(1);
        }}
        label="Buscar contatos"
        ariaLabel="Filtros de contatos"
      />
      {feedback && <StatusPanel state="success" title={feedback} />}
      <DataTable
        data={filtered.slice((currentPage - 1) * limit, currentPage * limit)}
        columns={[{ key: "name", label: "Nome", render: (p) => p.name }]}
        onRowClick={(p) => {
          setSelected(p.id);
          setMode("details");
          setFeedback("");
        }}
        labels={{ openRow: (n) => `Ver contato ${n}` }}
        emptyState={
          <StatusPanel
            state="empty"
            title="Nenhum contato encontrado"
            description="Tente outro nome ou limpe a busca."
            action={
              <Button variant="outline" onClick={() => setQuery("")}>
                Limpar busca
              </Button>
            }
          />
        }
      />
      <DataPagination
        page={currentPage}
        limit={limit}
        totalPages={totalPages}
        pageSizeOptions={[2, 5, 10]}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
      />
      <Dialog
        open={!!person}
        onOpenChange={(open) => {
          if (!open) setSelected(undefined);
        }}
      >
        <DialogContent finalFocus={listHeading} closeLabel="Fechar detalhes">
          <DialogHeader>
            <DialogTitle>
              {mode === "edit"
                ? "Editar contato"
                : mode === "delete"
                  ? "Excluir contato?"
                  : "Detalhes do contato"}
            </DialogTitle>
            <DialogDescription>
              {mode === "delete"
                ? "O contato será removido desta demonstração. Você pode restaurar os dados pelo botão Restaurar exemplo."
                : "Confira os dados e escolha a próxima ação."}
            </DialogDescription>
          </DialogHeader>
          {person &&
            (mode === "edit" ? (
              <>
                <ValidatedForm
                  key={person.id}
                  initialValues={{ name: person.name, email: person.email }}
                  fields={[
                    {
                      name: "name",
                      label: "Nome do contato",
                      validate: (v) =>
                        v.trim() ? undefined : "Informe o nome.",
                    },
                    {
                      name: "email",
                      label: "E-mail do contato",
                      type: "email",
                      validate: (v) =>
                        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)
                          ? undefined
                          : "Informe um e-mail válido.",
                    },
                  ]}
                  onSubmit={async (values) => {
                    await new Promise((resolve) => setTimeout(resolve, 350));
                    setPeople((items) =>
                      items.map((p) =>
                        p.id === person.id
                          ? { ...p, name: values.name, email: values.email }
                          : p,
                      ),
                    );
                    setFeedback("Contato atualizado.");
                    setSelected(undefined);
                  }}
                />
                <Button variant="outline" onClick={() => setMode("details")}>
                  Cancelar edição
                </Button>
              </>
            ) : mode === "delete" ? (
              <>
                <p>
                  Excluir <strong>{person.name}</strong>?
                </p>
                <DialogFooter>
                  <Button
                    variant="outline"
                    autoFocus
                    onClick={() => setMode("details")}
                  >
                    Manter contato
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setPeople((items) =>
                        items.filter((p) => p.id !== person.id),
                      );
                      setSelected(undefined);
                      setFeedback("Contato excluído.");
                    }}
                  >
                    Confirmar exclusão
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-muted-foreground">Nome</dt>
                    <dd>{person.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">E-mail</dt>
                    <dd>{person.email}</dd>
                  </div>
                </dl>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={() => setMode("delete")}
                  >
                    Excluir contato
                  </Button>
                  <Button onClick={() => setMode("edit")}>
                    Editar contato
                  </Button>
                </DialogFooter>
              </>
            ))}
        </DialogContent>
      </Dialog>
    </section>
  );
}
