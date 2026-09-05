import { useEffect, useState } from "react";
import { Menu, Moon, Search, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/components/theme-provider";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { InstallPage } from "./pages/install-page";
import { ComponentsPage } from "./pages/components-page";
import { CommandMenu } from "./components/command-menu";
import allDemos from "./catalog.json";
import { FoundationsPage } from "./pages/foundations-page";

type View = "instalacao" | "componentes" | "fundamentos";

function viewFromHash(): View {
  if (
    window.location.pathname.startsWith("/componentes") ||
    window.location.hash.startsWith("#componentes")
  )
    return "componentes";
  if (["/fundamentos", "/design-system/"].includes(window.location.pathname))
    return "fundamentos";
  return "instalacao";
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

function NavLink({
  active,
  onClick,
  children,
  indent,
  href,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  indent?: boolean;
  href: string;
}) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={(event) => {
        if (
          !event.ctrlKey &&
          !event.metaKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          event.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
        indent && "pl-4 text-[0.8rem]",
        active
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      {children}
    </a>
  );
}

function Nav({
  view,
  onGo,
  onGoComponent,
}: {
  view: View;
  onGo: (v: View) => void;
  onGoComponent: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = q
    ? allDemos.filter((d) => d.title.toLowerCase().includes(q))
    : allDemos;

  return (
    <nav aria-label="Documentação" className="grid gap-0.5">
      <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
        Começar
      </p>
      <NavLink
        href="/instalacao"
        active={view === "instalacao"}
        onClick={() => onGo("instalacao")}
      >
        Instalação
      </NavLink>
      <NavLink
        href="/componentes"
        active={
          view === "componentes" && window.location.pathname === "/componentes"
        }
        onClick={() => onGo("componentes")}
      >
        Componentes
      </NavLink>
      <a
        href="/fundamentos"
        className="block w-full rounded-md px-3 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
      >
        Guia visual
      </a>

      <div className="mt-4 mb-1 px-1">
        <InputGroup className="h-8">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Buscar componente..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar componente"
          />
        </InputGroup>
      </div>

      {filtered.length === 0 ? (
        <p className="px-3 py-2 text-[0.8rem] text-muted-foreground">
          Nenhum componente encontrado.
        </p>
      ) : (
        filtered.map((d) => (
          <NavLink
            key={d.id}
            href={`/componentes/${d.id}`}
            active={window.location.pathname === `/componentes/${d.id}`}
            indent
            onClick={() => onGoComponent(d.id)}
          >
            {d.title}
          </NavLink>
        ))
      )}
    </nav>
  );
}

export function App() {
  const [view, setView] = useState<View>(viewFromHash);
  const [componentId, setComponentId] = useState(
    () => window.location.pathname.split("/")[2] ?? "",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  useEffect(() => {
    document.title = `${allDemos.find((d) => d.id === componentId)?.title ?? (view === "fundamentos" ? "Fundamentos" : view === "componentes" ? "Componentes" : "Instalação")} — LAI Design System`;
  }, [componentId, view]);

  useEffect(() => {
    const onHash = () => {
      setView(viewFromHash());
      setComponentId(window.location.pathname.split("/")[2] ?? "");
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
    };
  }, []);

  const go = (v: View) => {
    window.history.pushState({}, "", `/${v}`);
    setComponentId("");
    setView(v);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const goComponent = (id: string) => {
    window.history.pushState({}, "", `/componentes/${id}`);
    setView("componentes");
    setComponentId(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-svh bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-background focus:p-3"
      >
        Ir para conteúdo
      </a>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
          {/* Menu mobile */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>LAI Design System</SheetTitle>
              </SheetHeader>
              <div className="px-2 pb-8">
                <Nav view={view} onGo={go} onGoComponent={goComponent} />
              </div>
            </SheetContent>
          </Sheet>

          <button
            onClick={() => go("instalacao")}
            className="flex items-center gap-2 min-w-0"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <span className="text-xs font-bold">L</span>
            </span>
            <span className="truncate font-semibold tracking-tight">
              LAI Design System
            </span>
          </button>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            @lai
          </Badge>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCmdOpen(true)}
              className="hidden gap-2 text-muted-foreground sm:flex"
              aria-label="Buscar"
            >
              <Search className="size-4" />
              <span>Buscar...</span>
              <Kbd className="ml-1">⌘K</Kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCmdOpen(true)}
              className="sm:hidden"
              aria-label="Buscar"
            >
              <Search className="size-4" />
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              render={
                <a
                  href="https://github.com/OrganizacaoX/lai-design-system"
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              GitHub
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-6 sm:py-8">
        <aside className="sticky top-20 hidden h-[calc(100svh-6rem)] w-56 shrink-0 overflow-y-auto md:block">
          <Nav view={view} onGo={go} onGoComponent={goComponent} />
        </aside>

        <main id="main" className="min-w-0 flex-1">
          {view === "componentes" ? (
            <ComponentsPage id={componentId} />
          ) : view === "fundamentos" ? (
            <FoundationsPage />
          ) : (
            <InstallPage />
          )}
        </main>
      </div>

      <CommandMenu
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        onGo={go}
        onGoComponent={goComponent}
      />

      <Toaster richColors />
    </div>
  );
}
