import { createRoot } from "react-dom/client";
import { AppProviders, createAppRouter } from "@organizacaox/lai-design-system/app";
import { RouterProvider } from "@organizacaox/lai-design-system/router";
import "@organizacaox/lai-design-system/styles.css";
import { primaryI18n } from "./localization";
import { queryClient } from "./api";
import { routeTree } from "./routeTree.gen";
export const router = createAppRouter({ routeTree, context: { queryClient } });
declare module "@organizacaox/lai-design-system/router" {
  interface Register { router: typeof router }
}
void primaryI18n.then((i18n) => createRoot(document.getElementById("app")!).render(
  <AppProviders queryClient={queryClient} i18n={i18n}><RouterProvider router={router} /></AppProviders>,
));
