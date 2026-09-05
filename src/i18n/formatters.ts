/** Currency and timezone are explicit product choices, not inferred from language. */
export function createLocaleFormatters(locale: string) {
  return {
    number: (value: number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, options).format(value),
    currency: (value: number, currency: string, options?: Omit<Intl.NumberFormatOptions, "style" | "currency">) =>
      new Intl.NumberFormat(locale, { ...options, style: "currency", currency }).format(value),
    date: (value: Date | number, options?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, options).format(value),
  };
}
