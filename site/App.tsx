import { useEffect, useState } from "react";
import { Menu, Moon, Search, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { allDemos } from "./all-demos";

type View = "instalacao" | "componentes";

function viewFromHash(): View {
  return window.location.hash.replace("#", "").startsWith("componentes")
    ? "componentes"
    : "instalacao";
}

function ThemeToggle() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark"),
  );
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("lai-theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Alternar tema">
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

function NavLink({
  active,
  onClick,
  children,
  indent,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  indent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
        indent && "pl-4 text-[0.8rem]",
        active
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      {children}
    </button>
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
    <nav className="grid gap-0.5">
      <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Começar</p>
      <NavLink active={view === "instalacao"} onClick={() => onGo("instalacao")}>
        Instalação
      </NavLink>
      <NavLink active={view === "componentes"} onClick={() => onGo("componentes")}>
        Componentes
      </NavLink>

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
          <NavLink key={d.id} indent onClick={() => onGoComponent(d.id)}>
            {d.title}
          </NavLink>
        ))
      )}
    </nav>
  );
}

export function App() {
  const [view, setView] = useState<View>(viewFromHash);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setView(viewFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (v: View) => {
    window.location.hash = v;
    setView(v);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const goComponent = (id: string) => {
    if (view !== "componentes") {
      window.location.hash = "componentes";
      setView("componentes");
    }
    setMenuOpen(false);
    // aguarda a página de componentes montar antes de rolar
    setTimeout(
      () =>
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      60,
    );
  };

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
          {/* Menu mobile */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="size-5" />
              </Button>
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
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://github.com/OrganizacaoX/lai-design-system"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-6 sm:py-8">
        <aside className="sticky top-20 hidden h-[calc(100svh-6rem)] w-56 shrink-0 overflow-y-auto md:block">
          <Nav view={view} onGo={go} onGoComponent={goComponent} />
        </aside>

        <main className="min-w-0 flex-1">
          {view === "componentes" ? <ComponentsPage /> : <InstallPage />}
        </main>
      </div>

      <Toaster richColors />
    </div>
  );
}
