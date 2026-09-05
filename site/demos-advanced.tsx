import { useState } from "react";
import { ChevronRight, Contact, LayoutDashboard, Settings, Shield, SlidersHorizontal, UserPlus, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { Demo } from "./demos";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

// ---- Chart -----------------------------------------------------------------
const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Fev", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Abr", desktop: 173, mobile: 190 },
  { month: "Mai", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-3)" },
} satisfies ChartConfig;

function ChartDemo() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[240px] w-full max-w-md">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

// ---- Combobox --------------------------------------------------------------
const frameworks = ["Next.js", "SvelteKit", "Nuxt", "Remix", "Astro", "Vite"];

function ComboboxDemo() {
  return (
    <Combobox items={frameworks}>
      <ComboboxInput placeholder="Buscar framework..." className="w-full max-w-xs" />
      <ComboboxContent>
        <ComboboxEmpty>Nenhum encontrado.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

// ---- Sidebar ---------------------------------------------------------------
function SidebarDemo() {
  const [active, setActive] = useState("Dashboard");
  const groups = [
    { label: "Leads", icon: Users, defaultOpen: true, items: [
      { label: "Todos os leads", icon: Contact },
      { label: "Novos leads", icon: UserPlus },
    ] },
    { label: "Configurações", icon: Settings, defaultOpen: false, items: [
      { label: "Preferências", icon: SlidersHorizontal },
      { label: "Permissões", icon: Shield },
    ] },
  ];
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-sidebar text-sidebar-foreground">
      <SidebarProvider className="min-h-[360px] items-stretch">
        <Sidebar collapsible="none" className="w-48 shrink-0 border-r sm:w-56">
          <SidebarHeader className="px-3 py-2 text-sm font-semibold">LAI Disk</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={active === "Dashboard"} onClick={() => setActive("Dashboard")}>
                      <LayoutDashboard /><span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {groups.map(group => (
                    <Collapsible key={group.label} defaultOpen={group.defaultOpen} render={<SidebarMenuItem />}>
                      <CollapsibleTrigger render={<SidebarMenuButton />} className="group/collapsible-trigger">
                        <group.icon /><span>{group.label}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 ease-linear group-aria-expanded/collapsible-trigger:rotate-90 motion-reduce:transition-none" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {group.items.map(item => (
                            <SidebarMenuSubItem key={item.label}>
                              <SidebarMenuSubButton href={`#${item.label.toLowerCase().replaceAll(" ", "-")}`}
                                isActive={active === item.label} aria-current={active === item.label ? "page" : undefined}
                                onClick={event => { event.preventDefault(); setActive(item.label); }}>
                                <item.icon /><span>{item.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="min-w-0 flex-1 bg-background p-4 text-sm">
          <p className="font-semibold" aria-live="polite">{active}</p>
          <p className="mt-2 text-muted-foreground">Abra os grupos e selecione um subitem para navegar.</p>
        </div>
      </SidebarProvider>
    </div>
  );
}

export const advancedDemos: Demo[] = [
  {
    id: "chart",
    title: "Chart",
    description: "Gráficos com Recharts + tokens do tema.",
    node: <ChartDemo />,
    code: `import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-3)" },
} satisfies ChartConfig

<ChartContainer config={chartConfig} className="min-h-[240px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>`,
  },
  {
    id: "combobox",
    title: "Combobox",
    description: "Autocomplete com busca.",
    node: <ComboboxDemo />,
    code: `import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxEmpty } from "@/components/ui/combobox"

const frameworks = ["Next.js", "SvelteKit", "Nuxt", "Remix", "Astro"]

<Combobox items={frameworks}>
  <ComboboxInput placeholder="Buscar framework..." />
  <ComboboxContent>
    <ComboboxEmpty>Nenhum encontrado.</ComboboxEmpty>
    <ComboboxList>
      {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`,
  },
  {
    id: "sidebar",
    title: "Sidebar",
    description: "Navegação lateral com grupos expansíveis e seleção animada de subitens.",
    node: <SidebarDemo />,
    code: `import { useState } from "react"
import { Contact, LayoutDashboard, UserPlus, Users } from "lucide-react"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar"

const [active, setActive] = useState("dashboard")

<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={active === "dashboard"} onClick={() => setActive("dashboard")}>
                <LayoutDashboard /> Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Collapsible defaultOpen render={<SidebarMenuItem />}>
              <CollapsibleTrigger render={<SidebarMenuButton />}>
                <Users /><span>Leads</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="/leads" isActive={active === "leads"}
                      onClick={event => { event.preventDefault(); setActive("leads") }}>
                      <Contact /><span>Todos os leads</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="/leads/novos" isActive={active === "novos"}
                      onClick={event => { event.preventDefault(); setActive("novos") }}>
                      <UserPlus /><span>Novos leads</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <main>Conteúdo principal</main>
</SidebarProvider>`,
  },
];
