import { useEffect, type ReactNode } from "react";
import type { i18n } from "i18next";
import { I18nextProvider } from "react-i18next";
import { useLaiTranslation } from "../hooks/use-lai-translation";

function DocumentLanguage() {
  const { language, i18n } = useLaiTranslation();
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = i18n?.dir(language) ?? "ltr";
  }, [language, i18n]);
  return null;
}
export interface LaiI18nProviderProps {
  i18n: i18n;
  children: ReactNode;
  /** Disable for embedded/nested applications that do not own the document. */
  updateDocument?: boolean;
}
export function LaiI18nProvider({ i18n, children, updateDocument = true }: LaiI18nProviderProps) {
  return <I18nextProvider i18n={i18n}>
    {updateDocument && <DocumentLanguage />}
    {children}
  </I18nextProvider>;
}
