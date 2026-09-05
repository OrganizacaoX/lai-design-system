import { driver, type Config } from "driver.js";
export { driver } from "driver.js";
export type { Config, Driver, DriveStep } from "driver.js";
const labels = {
  pt: { nextBtnText: "Próximo", prevBtnText: "Anterior", doneBtnText: "Concluir", progressText: "{{current}} de {{total}}" },
  en: { nextBtnText: "Next", prevBtnText: "Previous", doneBtnText: "Done", progressText: "{{current}} of {{total}}" },
  es: { nextBtnText: "Siguiente", prevBtnText: "Anterior", doneBtnText: "Finalizar", progressText: "{{current}} de {{total}}" },
};
/** Import LAI /tour/styles.css explicitly. Destroy on unmount; create again when language changes. */
export function createAppTour({ locale = "pt-BR", ...config }: Config & { locale?: string } = {}) {
  const language = locale.split("-")[0];
  return driver({ showProgress: true, ...labels[language === "en" || language === "es" ? language : "pt"], ...config });
}
