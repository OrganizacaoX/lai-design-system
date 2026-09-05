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
import { Spinner } from "@/components/ui/spinner";

export function ControlStates({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  if (!["button", "input", "select"].includes(id)) return null;
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Estados na prática</h2>
      <div className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
        {id === "button" ? (
          <>
            <Button
              onClick={() => {
                setPending(true);
                setTimeout(() => setPending(false), 1000);
              }}
              disabled={pending}
              aria-busy={pending}
            >
              {pending && <Spinner />}
              {pending ? "Salvando…" : "Testar carregamento"}
            </Button>
            <Button disabled>Indisponível</Button>
            <Button variant="destructive">Excluir registro</Button>
            <p role="status" className="text-sm text-muted-foreground">
              {pending
                ? "Enviando alterações…"
                : "Use Tab para conferir o foco."}
            </p>
          </>
        ) : id === "input" ? (
          <>
            <div className="space-y-2">
              <label htmlFor="state-invalid" className="text-sm font-medium">
                E-mail com erro
              </label>
              <Input
                id="state-invalid"
                defaultValue="ana@"
                aria-invalid="true"
                aria-describedby="state-error"
              />
              <p id="state-error" className="text-sm text-destructive">
                Informe um e-mail válido.
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="state-disabled" className="text-sm font-medium">
                Campo indisponível
              </label>
              <Input
                id="state-disabled"
                disabled
                value="Gerenciado pela organização"
              />
              <p className="text-sm text-muted-foreground">
                Peça a alteração ao administrador.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <p id="state-select-label" className="text-sm font-medium">
                Status obrigatório
              </p>
              <Select>
                <SelectTrigger
                  aria-labelledby="state-select-label"
                  aria-invalid="true"
                  aria-describedby="state-select-error"
                >
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="paused">Pausado</SelectItem>
                </SelectContent>
              </Select>
              <p id="state-select-error" className="text-sm text-destructive">
                Escolha um status.
              </p>
            </div>
            <Select disabled>
              <SelectTrigger aria-label="Seleção indisponível">
                <SelectValue placeholder="Indisponível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      </div>
    </section>
  );
}
