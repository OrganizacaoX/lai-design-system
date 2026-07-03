import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import { InstallPage } from "./pages/install-page";
import { ComponentsPage } from "./pages/components-page";
import { demos } from "./demos";

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

export function App() {
  const [view, setView] = useState<View>(viewFromHash);

  useEffect(() => {
    const onHash = () => setView(viewFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (v: View) => {
    window.location.hash = v;
    setView(v);
    window.scrollTo({ top: 0 });
  };

  const goComponent = (id: string) => {
    if (view !== "componentes") {
      window.location.hash = "componentes";
      setView("componentes");
    }
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <button onClick={() => go("instalacao")} className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <span className="text-xs font-bold">L</span>
            </span>
            <span className="font-semibold tracking-tight">LAI Design System</span>
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

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
        <aside className="sticky top-20 hidden h-[calc(100svh-6rem)] w-56 shrink-0 overflow-y-auto md:block">
          <nav className="grid gap-0.5">
            <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Começar
            </p>
            <NavLink active={view === "instalacao"} onClick={() => go("instalacao")}>
              Instalação
            </NavLink>
            <NavLink active={view === "componentes"} onClick={() => go("componentes")}>
              Componentes
            </NavLink>

            <p className="mt-4 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Componentes
            </p>
            {demos.map((d) => (
              <NavLink key={d.id} indent onClick={() => goComponent(d.id)}>
                {d.title}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {view === "componentes" ? <ComponentsPage /> : <InstallPage />}
        </main>
      </div>

      <Toaster richColors />
    </div>
  );
}
