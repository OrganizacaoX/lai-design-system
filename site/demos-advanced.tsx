import { LayoutDashboard, Settings, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { Demo } from "./demos";

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
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-sidebar text-sidebar-foreground">
      <SidebarProvider className="min-h-[300px] items-stretch">
        <Sidebar collapsible="none" className="w-56 border-r">
          <SidebarHeader className="px-3 py-2 text-sm font-semibold">
            LAI Disk
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <LayoutDashboard /> Dashboard
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users /> Leads
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings /> Configurações
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 bg-background p-4 text-sm text-muted-foreground">
          Conteúdo principal
        </main>
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
    description: "Navegação lateral completa.",
    node: <SidebarDemo />,
    code: `import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"

<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <LayoutDashboard /> Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <main>Conteúdo principal</main>
</SidebarProvider>`,
  },
];
