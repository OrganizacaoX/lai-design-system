import { ptBR as fallbackLocale } from "date-fns/locale";
import { ptBR, enUS, es } from "react-day-picker/locale";
import { useLaiTranslation } from "@/hooks/use-lai-translation";

/** Includes translated calendar accessibility labels; explicit locales still win. */
export function useLaiLocale() {
  const { language, i18n } = useLaiTranslation();
  if (!i18n) return fallbackLocale;
  if (language.startsWith("en")) return enUS;
  if (language.startsWith("es")) return es;
  return ptBR;
}
