import { useState } from "react";
import { Building2, LayoutDashboard, Users, Settings, CircleHelp, Contact, UserPlus, Shield, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { useTheme } from "@/components/theme-provider";
import { SidebarProfile } from "@/components/sidebar-profile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function UserMenu() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("pt-BR");
  const [message, setMessage] = useState("");
  return <>
    <SidebarProfile
      user={{ name: "Ana Silva", email: "ana@exemplo.com" }}
      profile={{ onSelect: () => setMessage("Meu perfil") }}
      organization={{ onSelect: () => setMessage("Trocar organização") }}
      install={{ onSelect: () => setMessage("Instalar aplicativo") }}
      theme={{ value: theme === "dark" || theme === "light" ? theme : "system", onChange: setTheme }}
      language={{ value: language, onChange: setLanguage, options: [{ value: "pt-BR", label: "Português" }, { value: "en", label: "English" }] }}
      signOut={{ onSelect: () => setMessage("Sair") }}
    />
    <Dialog open={!!message} onOpenChange={open => { if (!open) setMessage(""); }}>
      <DialogContent><DialogHeader><DialogTitle>{message}</DialogTitle><DialogDescription>Exemplo de ação do menu de perfil. No produto, esta ação abre o fluxo correspondente.</DialogDescription></DialogHeader></DialogContent>
    </Dialog>
  </>;
}

export function AppShellExample() {
  const [active, setActive] = useState("dashboard");
  const items = [
    { id: "dashboard", label: "Visão geral", icon: <LayoutDashboard />, mobile: true },
    { id: "contacts", label: "Contatos", icon: <Users />, mobile: true, badge: "12" },
    { id: "settings", label: "Configurações", icon: <Settings />, mobile: true },
    { id: "help", label: "Ajuda", icon: <CircleHelp /> },
  ];
  const sections = [
    { id: "leads", label: "Leads", icon: <Users />, collapsible: true, defaultOpen: true, items: [
      { id: "all-leads", label: "Todos os leads", icon: <Contact /> },
      { id: "new-leads", label: "Novos leads", icon: <UserPlus /> },
    ] },
    { id: "administration", label: "Administração", icon: <Settings />, collapsible: true, defaultOpen: false, items: [
      { id: "preferences", label: "Preferências", icon: <SlidersHorizontal /> },
      { id: "permissions", label: "Permissões", icon: <Shield /> },
    ] },
  ];
  const title = [...items, ...sections.flatMap(section => section.items)].find(item => item.id === active)!.label;
  const navigation = [{ id: "workspace", label: "Workspace", items }, ...sections].map(group => ({
    ...group, items: group.items.map(item => ({ ...item, href: `#${item.id}`, active: item.id === active })),
  }));
  return <AppShell
    brand={<span className="flex items-center gap-2 px-2 font-semibold"><Building2 className="size-5" />LAI Workspace</span>}
    brandIcon={<Building2 className="size-5" />}
    navigation={navigation}
    renderLink={item => <a href={item.href} onClick={event => { event.preventDefault(); setActive(item.id); }} />}
    footer={<UserMenu />}
  >
    <PageHeader title={title} description="Acompanhe o trabalho da sua equipe." />
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {["Atividade da equipe", "Próximas tarefas"].map(label => <section key={label} className="rounded-xl border bg-card p-5"><h2 className="font-medium">{label}</h2><p className="mt-2 text-sm text-muted-foreground">Tudo pronto para começar.</p></section>)}
    </div>
  </AppShell>;
}
