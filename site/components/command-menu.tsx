import { useEffect } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import allDemos from "../catalog.json";

export function CommandMenu({
  open,
  onOpenChange,
  onGo,
  onGoComponent,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGo: (v: "instalacao" | "componentes") => void;
  onGoComponent: (id: string) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const run = (fn: () => void) => {
    fn();
    onOpenChange(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Buscar"
      description="Busque componentes e páginas"
    >
      <Command>
        <CommandInput placeholder="Buscar componente ou página..." />
        <CommandList>
          <CommandEmpty>Nada encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação">
            <CommandItem value="Instalação" onSelect={() => run(() => onGo("instalacao"))}>
              Instalação
            </CommandItem>
            <CommandItem
              value="Componentes"
              onSelect={() => run(() => onGo("componentes"))}
            >
              Todos os componentes
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Componentes">
            {allDemos.map((d) => (
              <CommandItem
                key={d.id}
                value={d.title}
                onSelect={() => run(() => onGoComponent(d.id))}
              >
                {d.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
