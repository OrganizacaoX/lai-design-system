import { AppShell } from "@organizacaox/lai-design-system";
import { createRootRouteWithContext, Link, Outlet, useRouterState } from "@organizacaox/lai-design-system/router";
import type { QueryClient } from "@organizacaox/lai-design-system/query";
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({ component: Layout });
function Layout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return <AppShell brand="LAI App" navigation={[{ id: "main", label: "Principal", items: [
    { id: "contacts", label: "Contatos", href: "/", active: pathname === "/", mobile: true },
  ] }]} renderLink={() => <Link to="/" search={{ q: "" }} />}><Outlet /></AppShell>;
}
