import { useContext, useMemo, useSyncExternalStore } from "react";
import type { i18n as I18nInstance } from "i18next";
import { I18nContext } from "react-i18next";

/** Shared namespace; kept in this registry hook so copied components are self-contained. */
export const laiTranslations = {
  "pt-BR": {
    "close": "Fechar",
    "retry": "Tentar novamente",
    "app.loading": "Carregando…",
    "app.notFound": "Página não encontrada",
    "app.error": "Não foi possível carregar esta página",
    "nav.main": "Navegação principal",
    "nav.mobile": "Atalhos de navegação",
    "nav.toggle": "Alternar navegação",
    "nav.menu": "Menu",
    "nav.skip": "Pular para o conteúdo",
    "pagination.limit": "Itens por página",
    "pagination.label": "Paginação",
    "pagination.previous": "Página anterior",
    "pagination.next": "Próxima página",
    "pagination.page": "Página {{page}} de {{total}}",
    "pagination.goTo": "Ir para página {{page}}",
    "table.actions": "Ações",
    "table.openRow": "Abrir linha {{row}}",
    "table.loading": "Carregando resultados…",
    "table.selected": "{{count}} selecionado(s)",
    "table.selected_one": "{{count}} selecionado",
    "table.selected_other": "{{count}} selecionados",
    "table.selectRow": "Selecionar linha {{row}}",
    "table.selectAll": "Selecionar todos",
    "table.clear": "Limpar seleção",
    "table.empty": "Nenhum resultado encontrado.",
    "date.placeholder": "Selecionar período",
    "date.clear": "Limpar período",
    "date.today": "Hoje",
    "date.days": "{{count}} dias",
    "date.month": "Este mês",
    "filter.label": "Filtros",
    "filter.search": "Buscar registros",
    "filter.clear": "Limpar filtros",
    "panel.title": "Painel",
    "panel.close": "Fechar painel",
    "list.label": "Resultados",
    "list.empty": "Nenhum resultado",
    "list.description": "Ajuste os filtros ou adicione um registro.",
    "form.save": "Salvar",
    "form.pending": "Salvando…",
    "form.success": "Alterações salvas.",
    "form.error": "Não foi possível salvar. Tente novamente.",
    "combobox.open": "Abrir opções",
    "combobox.remove": "Remover opção",
    "pagination.previousText": "Anterior",
    "pagination.nextText": "Próxima",
    "pagination.more": "Mais páginas",
    "sidebar.title": "Barra lateral",
    "sidebar.description": "Exibe a barra lateral mobile.",
    "sidebar.toggle": "Alternar barra lateral",
    "carousel.previous": "Slide anterior",
    "carousel.next": "Próximo slide",
    "command.title": "Paleta de comandos",
    "command.description": "Busque um comando para executar…",
    "more": "Mais",
    "toast.close": "Fechar notificação",
    "loading": "Carregando"
  },
  "en": {
    "close": "Close",
    "retry": "Try again",
    "app.loading": "Loading…",
    "app.notFound": "Page not found",
    "app.error": "Unable to load this page",
    "nav.main": "Main navigation",
    "nav.mobile": "Navigation shortcuts",
    "nav.toggle": "Toggle navigation",
    "nav.menu": "Menu",
    "nav.skip": "Skip to content",
    "pagination.limit": "Items per page",
    "pagination.label": "Pagination",
    "pagination.previous": "Previous page",
    "pagination.next": "Next page",
    "pagination.page": "Page {{page}} of {{total}}",
    "pagination.goTo": "Go to page {{page}}",
    "table.actions": "Actions",
    "table.openRow": "Open row {{row}}",
    "table.loading": "Loading results…",
    "table.selected": "{{count}} selected",
    "table.selected_one": "{{count}} selected",
    "table.selected_other": "{{count}} selected",
    "table.selectRow": "Select row {{row}}",
    "table.selectAll": "Select all",
    "table.clear": "Clear selection",
    "table.empty": "No results found.",
    "date.placeholder": "Select date range",
    "date.clear": "Clear date range",
    "date.today": "Today",
    "date.days": "{{count}} days",
    "date.month": "This month",
    "filter.label": "Filters",
    "filter.search": "Search records",
    "filter.clear": "Clear filters",
    "panel.title": "Panel",
    "panel.close": "Close panel",
    "list.label": "Results",
    "list.empty": "No results",
    "list.description": "Adjust the filters or add a record.",
    "form.save": "Save",
    "form.pending": "Saving…",
    "form.success": "Changes saved.",
    "form.error": "Unable to save. Try again.",
    "combobox.open": "Open options",
    "combobox.remove": "Remove option",
    "pagination.previousText": "Previous",
    "pagination.nextText": "Next",
    "pagination.more": "More pages",
    "sidebar.title": "Sidebar",
    "sidebar.description": "Displays the mobile sidebar.",
    "sidebar.toggle": "Toggle Sidebar",
    "carousel.previous": "Previous slide",
    "carousel.next": "Next slide",
    "command.title": "Command Palette",
    "command.description": "Search for a command to run...",
    "more": "More",
    "toast.close": "Close toast",
    "loading": "Loading"
  },
  "es": {
    "close": "Cerrar",
    "retry": "Reintentar",
    "app.loading": "Cargando…",
    "app.notFound": "Página no encontrada",
    "app.error": "No se pudo cargar esta página",
    "nav.main": "Navegación principal",
    "nav.mobile": "Accesos de navegación",
    "nav.toggle": "Alternar navegación",
    "nav.menu": "Menú",
    "nav.skip": "Saltar al contenido",
    "pagination.limit": "Elementos por página",
    "pagination.label": "Paginación",
    "pagination.previous": "Página anterior",
    "pagination.next": "Página siguiente",
    "pagination.page": "Página {{page}} de {{total}}",
    "pagination.goTo": "Ir a la página {{page}}",
    "table.actions": "Acciones",
    "table.openRow": "Abrir fila {{row}}",
    "table.loading": "Cargando resultados…",
    "table.selected": "{{count}} seleccionado(s)",
    "table.selected_one": "{{count}} seleccionado",
    "table.selected_other": "{{count}} seleccionados",
    "table.selectRow": "Seleccionar fila {{row}}",
    "table.selectAll": "Seleccionar todos",
    "table.clear": "Limpiar selección",
    "table.empty": "No se encontraron resultados.",
    "date.placeholder": "Seleccionar período",
    "date.clear": "Limpiar período",
    "date.today": "Hoy",
    "date.days": "{{count}} días",
    "date.month": "Este mes",
    "filter.label": "Filtros",
    "filter.search": "Buscar registros",
    "filter.clear": "Limpiar filtros",
    "panel.title": "Panel",
    "panel.close": "Cerrar panel",
    "list.label": "Resultados",
    "list.empty": "Sin resultados",
    "list.description": "Ajusta los filtros o añade un registro.",
    "form.save": "Guardar",
    "form.pending": "Guardando…",
    "form.success": "Cambios guardados.",
    "form.error": "No se pudo guardar. Inténtalo de nuevo.",
    "combobox.open": "Abrir opciones",
    "combobox.remove": "Quitar opción",
    "pagination.previousText": "Anterior",
    "pagination.nextText": "Siguiente",
    "pagination.more": "Más páginas",
    "sidebar.title": "Barra lateral",
    "sidebar.description": "Muestra la barra lateral móvil.",
    "sidebar.toggle": "Alternar barra lateral",
    "carousel.previous": "Diapositiva anterior",
    "carousel.next": "Diapositiva siguiente",
    "command.title": "Paleta de comandos",
    "command.description": "Busca un comando para ejecutar…",
    "more": "Más",
    "toast.close": "Cerrar notificación",
    "loading": "Cargando"
  }
} as const;
export type LaiMessageKey = keyof typeof laiTranslations["pt-BR"];
export type LaiTranslationValues = Record<string, string | number | undefined>;

/** No provider means the existing Portuguese labels, with no global i18next instance. */
export function useLaiTranslation() {
  const instance: I18nInstance | undefined = useContext(I18nContext)?.i18n;
  const subscription = useMemo(() => {
    let revision = 0;
    return {
      subscribe: (notify: () => void) => {
        const changed = () => { revision++; notify(); };
        instance?.on("languageChanged loaded initialized", changed);
        instance?.store?.on("added", changed);
        instance?.store?.on("removed", changed);
        return () => {
          instance?.off("languageChanged loaded initialized", changed);
          instance?.store?.off("added", changed);
          instance?.store?.off("removed", changed);
        };
      },
      snapshot: () => `${instance?.resolvedLanguage ?? instance?.language ?? "pt-BR"}:${revision}`,
    };
  }, [instance]);
  useSyncExternalStore(subscription.subscribe, subscription.snapshot, subscription.snapshot);
  const language = instance?.resolvedLanguage ?? instance?.language ?? "pt-BR";
  const t = (key: LaiMessageKey, values: LaiTranslationValues = {}, withoutProvider?: string): string => {
    const fallback = laiTranslations["pt-BR"][key];
    if (instance) return String(instance.t(key, { ...values, ns: "lai", keySeparator: false, defaultValue: fallback }));
    return (withoutProvider ?? fallback).replace(/{{(\w+)}}/g, (match, name: string) => String(values[name] ?? match));
  };
  return { t, language, i18n: instance };
}
