import { createAppI18n } from "@organizacaox/lai-design-system/i18n";
export const resources = {
  "pt-BR": { app: { heading: "Internacionalização", greeting: "Olá, {{name}}", items_one: "{{count}} item", items_other: "{{count}} itens" } },
  en: { app: { heading: "Internationalization", greeting: "Hello, {{name}}", items_one: "{{count}} item", items_other: "{{count}} items" } },
  es: { app: { heading: "Internacionalización", greeting: "Hola, {{name}}", items_one: "{{count}} elemento", items_other: "{{count}} elementos" } },
} as const;
export const secondaryI18n = createAppI18n({ lng: "es", resources, defaultNS: "app", detectLanguage: false });
export const primaryI18n = createAppI18n({ resources, defaultNS: "app", storageKey: "lai-example-language", detectLanguage: false });
declare module "@organizacaox/lai-design-system/i18n" {
  interface CustomTypeOptions {
    defaultNS: "app";
    resources: typeof resources.en;
  }
}
