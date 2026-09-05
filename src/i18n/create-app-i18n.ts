import { createInstance, type i18n, type InitOptions, type Resource } from "i18next";
import { laiTranslations } from "../hooks/use-lai-translation";

export interface AppI18nOptions extends InitOptions {
  /** Opt-in persistence; choose a key unique to your product. */
  storageKey?: string;
  storage?: Pick<Storage, "getItem" | "setItem">;
  detectLanguage?: boolean;
}
export type AppI18n = i18n & { dispose: () => void };

/** Await before rendering. Each call owns its resources and listeners, including in SSR. */
export async function createAppI18n({ storageKey, storage, detectLanguage = true, ...options }: AppI18nOptions = {}): Promise<AppI18n> {
  let preferenceStorage = storage;
  let saved: string | undefined;
  try {
    preferenceStorage ??= storageKey && typeof window !== "undefined" ? window.localStorage : undefined;
    saved = storageKey ? preferenceStorage?.getItem(storageKey) ?? undefined : undefined;
  } catch { /* Storage may be disabled; translation still works. */ }
  const supported = options.supportedLngs === false ? undefined : options.supportedLngs ?? ["pt-BR", "en", "es"];
  const candidates = [saved, ...(detectLanguage && typeof window !== "undefined" && typeof navigator !== "undefined" ? navigator.languages : [])];
  const detected = candidates.filter((value): value is string => Boolean(value)).map((value) =>
    supported?.find((language) => language.toLowerCase() === value.toLowerCase()) ??
    supported?.find((language) => language.split("-")[0] === value.split("-")[0]) ?? (!supported ? value : undefined)
  ).find(Boolean);
  const instance = createInstance();
  // Add defaults per namespace without changing the caller's resources.
  const callerResources = structuredClone(options.resources ?? {});
  const resources: Resource = {};
  for (const language of new Set([...Object.keys(laiTranslations), ...Object.keys(callerResources)])) {
    const overrides = callerResources[language]?.lai;
    resources[language] = {
      ...callerResources[language],
      lai: { ...laiTranslations[language as keyof typeof laiTranslations], ...(typeof overrides === "object" && overrides !== null ? overrides : {}) },
    };
  }
  await instance.init({
    fallbackLng: "pt-BR",
    supportedLngs: ["pt-BR", "en", "es"],
    defaultNS: "translation",
    ...options,
    lng: options.lng ?? detected ?? "pt-BR",
    resources,
    interpolation: { escapeValue: false, ...options.interpolation },
  });
  const persistLanguage = (language: string) => {
    try { if (storageKey) preferenceStorage?.setItem(storageKey, language); } catch { /* Optional persistence. */ }
  };
  instance.on("languageChanged", persistLanguage);
  return Object.assign(instance, { dispose: () => instance.off("languageChanged", persistLanguage) });
}
