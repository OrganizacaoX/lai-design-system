// Seletor de período reutilizável: calendar range do shadcn dentro de um
// Popover, com atalhos rápidos (Hoje / 7 dias / 30 dias / Este mês). Não decide
// o período padrão — quem consome define o valor inicial.
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { format, startOfMonth, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Atalhos: cada um devolve um range a partir de "hoje" (recebido pronto para não
// depender de Date.now() aqui e manter a função testável de fora).
function presets(today: Date): { label: string; range: DateRange }[] {
  return [
    { label: "Hoje", range: { from: today, to: today } },
    { label: "7 dias", range: { from: subDays(today, 6), to: today } },
    { label: "30 dias", range: { from: subDays(today, 29), to: today } },
    { label: "Este mês", range: { from: startOfMonth(today), to: today } },
  ];
}

function label(range: DateRange | undefined): string {
  if (!range?.from) return "Selecionar período";
  const fmt = (d: Date) => format(d, "dd MMM yyyy", { locale: ptBR });
  if (!range.to || range.from.getTime() === range.to.getTime()) return fmt(range.from);
  return `${format(range.from, "dd MMM", { locale: ptBR })} – ${fmt(range.to)}`;
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const today = new Date();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-start gap-2 font-normal", className)}
          aria-label="Selecionar período"
        >
          <CalendarIcon className="size-4 text-muted-foreground" />
          <span className="tabular-nums">{label(value)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-wrap gap-1 border-b border-border p-2">
          {presets(today).map((p) => (
            <Button
              key={p.label}
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange(p.range);
                setOpen(false);
              }}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <Calendar
          mode="range"
          locale={ptBR}
          defaultMonth={value?.from}
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          disabled={{ after: today }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
