import { useState } from "react";
import { enUS } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/date-range-picker";
import { ComponentPreview } from "./component-preview";
export function DateRangeOptions() {
  const [value, setValue] = useState<DateRange | undefined>({
    from: new Date(2030, 0, 10),
    to: new Date(2030, 0, 15),
  });
  return (
    <ComponentPreview
      id="date-range-options"
      title="Idioma, atalhos e limites"
      description="Exemplo em inglês, com datas limitadas a janeiro de 2030. O atalho fora do limite fica indisponível."
      code={
        '<DateRangePicker value={range} onChange={setRange} locale={enUS} placeholder="Choose dates" ariaLabel="Choose reporting dates" minDate={new Date(2030, 0, 1)} maxDate={new Date(2030, 0, 31)} presets={[{ label: "January", range: { from: new Date(2030, 0, 1), to: new Date(2030, 0, 31) } }]} />'
      }
    >
      <DateRangePicker
        value={value}
        onChange={setValue}
        locale={enUS}
        placeholder="Choose dates"
        ariaLabel="Choose reporting dates"
        minDate={new Date(2030, 0, 1)}
        maxDate={new Date(2030, 0, 31)}
        presets={[
          {
            label: "January",
            range: { from: new Date(2030, 0, 1), to: new Date(2030, 0, 31) },
          },
          {
            label: "Outside limits",
            range: { from: new Date(2029, 11, 1), to: new Date(2029, 11, 31) },
          },
        ]}
      />
    </ComponentPreview>
  );
}
