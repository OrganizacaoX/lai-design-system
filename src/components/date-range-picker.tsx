import { useState } from "react";
import type { DateRange, Matcher } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { format, startOfMonth, startOfDay, subDays, type Locale } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// DateRangePickerProps and DateRangePreset are public API and are typed with
// DateRange and Locale, which come from react-day-picker and date-fns. Without
// these re-exports a consumer has to install both packages just to name a prop.
export type { DateRange } from "react-day-picker";
export type { Locale } from "date-fns";

export type DateRangePreset = { label: string; range: DateRange };
export interface DateRangePickerProps {
  value?: DateRange;
  id?: string;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
  locale?: Locale;
  placeholder?: string;
  ariaLabel?: string;
  presets?: DateRangePreset[];
  minDate?: Date;
  maxDate?: Date;
  allowFuture?: boolean;
  numberOfMonths?: number;
  disabled?: boolean;
  clearable?: boolean;
  clearLabel?: string;
  closeOnSelect?: boolean;
  formatLabel?: (range: DateRange, locale: Locale) => string;
}

export function DateRangePicker({
  value,
  id,
  onChange,
  className,
  locale = ptBR,
  placeholder = "Selecionar período",
  ariaLabel = placeholder,
  presets: customPresets,
  minDate,
  maxDate,
  allowFuture = false,
  numberOfMonths,
  disabled = false,
  clearable = false,
  clearLabel = "Limpar período",
  closeOnSelect = false,
  formatLabel,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const mobile = useIsMobile();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lower = minDate ? startOfDay(minDate) : undefined;
  const upper = maxDate ? startOfDay(maxDate) : allowFuture ? undefined : today;
  const blocked: Matcher[] = [];
  if (lower) blocked.push({ before: lower });
  if (upper) blocked.push({ after: upper });
  const presets = customPresets ?? [
    { label: "Hoje", range: { from: today, to: today } },
    { label: "7 dias", range: { from: subDays(today, 6), to: today } },
    { label: "30 dias", range: { from: subDays(today, 29), to: today } },
    { label: "Este mês", range: { from: startOfMonth(today), to: today } },
  ];
  const invalidPreset = (range: DateRange) =>
    [range.from, range.to].some(
      (date) =>
        date && ((lower && startOfDay(date) < lower) || (upper && startOfDay(date) > upper)),
    );
  const fmt = (date: Date) => format(date, "PP", { locale });
  const label = !value?.from
    ? placeholder
    : formatLabel
      ? formatLabel(value, locale)
      : !value.to || value.from.getTime() === value.to.getTime()
        ? fmt(value.from)
        : `${fmt(value.from)} – ${fmt(value.to)}`;

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) setSelectingEnd(Boolean(value?.from && !value.to));
      }}
    >
      <PopoverTrigger
        render={
          <Button
            id={id}
            disabled={disabled}
            variant="outline"
            className={cn("max-w-full justify-start gap-2 font-normal", className)}
            aria-label={`${ariaLabel}${value?.from ? `: ${label}` : ""}`}
          />
        }
      >
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate tabular-nums">{label}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0" align="start">
        {presets.length > 0 && (
          <div className="flex flex-wrap gap-1 border-b border-border p-2">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                disabled={invalidPreset(preset.range)}
                onClick={() => {
                  onChange(preset.range);
                  setOpen(false);
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        )}
        <Calendar
          mode="range"
          locale={locale}
          defaultMonth={value?.from}
          selected={value}
          onSelect={(range, day) => {
            if (!selectingEnd) {
              setSelectingEnd(true);
              onChange({ from: day, to: undefined });
              return;
            }
            onChange(range);
            if (range?.from && range.to) {
              setSelectingEnd(false);
              if (closeOnSelect) setOpen(false);
            }
          }}
          numberOfMonths={mobile ? 1 : (numberOfMonths ?? 2)}
          disabled={blocked}
          autoFocus
        />
        {clearable && value?.from && (
          <div className="flex justify-end border-t border-border p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectingEnd(false);
                onChange(undefined);
              }}
            >
              {clearLabel}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
