import { useLaiTranslation } from "@/hooks/use-lai-translation";
"use client";

import { useEffect, useId, useState, type ReactElement, type ReactNode } from "react";
import { ChevronRight, Menu, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
  SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar,
} from "@/components/ui/sidebar";

export interface AppShellNavItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  /** Opt in to one of the first three mobile shortcuts. All items remain in the menu. */
  mobile?: boolean;
}

export interface AppShellNavGroup {
  id: string;
  label?: string;
  items: AppShellNavItem[];
  /** Render this group as an expandable navigation section. */
  collapsible?: boolean;
  defaultOpen?: boolean;
  icon?: ReactNode;
}

export interface AppShellProps {
  brand: ReactNode;
  /** Compact mark shown when the desktop sidebar is collapsed. */
  brandIcon?: ReactNode;
  navigation: AppShellNavGroup[];
  /** User menu or other product actions. Also available inside the mobile drawer. */
  footer?: ReactNode;
  banner?: ReactNode;
  children: ReactNode;
  mobileNavigation?: "bottom" | "drawer";
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Return an anchor or router Link that forwards DOM props and events. */
  renderLink?: (item: AppShellNavItem) => ReactElement;
  labels?: Partial<{
    navigation: string;
    mobileNavigation: string;
    toggleNavigation: string;
    menu: string;
    skipToContent: string;
  }>;
  className?: string;
  contentClassName?: string;
}

/** Router-independent application layout. Filter navigation for permissions before passing it. */
export function AppShell({ open, defaultOpen = true, onOpenChange, className, ...props }: AppShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}
        className={cn("isolate", className)}>
        <AppShellContent {...props} />
      </SidebarProvider>
    </TooltipProvider>
  );
}

function AppShellNavigationGroup({ group, renderItem }: {
  group: AppShellNavGroup;
  renderItem: (item: AppShellNavItem, mobile?: boolean, sub?: boolean) => ReactNode;
}) {
  const { isMobile, state, setOpen } = useSidebar();
  const activeId = group.items.find(item => item.active)?.id;
  const [expanded, setExpanded] = useState(group.defaultOpen ?? !!activeId);
  useEffect(() => { if (activeId) setExpanded(true); }, [activeId]);
  if (!group.collapsible) return <SidebarGroup>
    {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
    <SidebarMenu>{group.items.map(item => <SidebarMenuItem key={item.id}>{renderItem(item)}</SidebarMenuItem>)}</SidebarMenu>
  </SidebarGroup>;
  return <SidebarGroup className="py-0.5">
    <SidebarMenu>
      <Collapsible open={expanded} onOpenChange={next => {
        if (!isMobile && state === "collapsed") { setOpen(true); setExpanded(true); }
        else setExpanded(next);
      }} render={<SidebarMenuItem />}>
        <CollapsibleTrigger render={<SidebarMenuButton tooltip={group.label} />} className="group/nav-section min-h-11">
          {group.icon}
          <span>{group.label}</span>
          <ChevronRight className="ml-auto transition-transform duration-200 ease-linear group-aria-expanded/nav-section:rotate-90 motion-reduce:transition-none group-data-[collapsible=icon]:hidden" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {group.items.map(item => <SidebarMenuSubItem key={item.id}>{renderItem(item, false, true)}</SidebarMenuSubItem>)}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>;
}

function AppShellContent({ brand, brandIcon, navigation, footer, banner, children,
  mobileNavigation = "bottom", renderLink, labels: overrides, contentClassName }: AppShellProps) {
  const { t } = useLaiTranslation();
  const { isMobile, openMobile, setOpenMobile, toggleSidebar, state } = useSidebar();
  const contentId = useId();
  const activeIds = navigation.flatMap(group => group.items).filter(item => item.active).map(item => item.id).join("\0");
  useEffect(() => { setOpenMobile(false); }, [activeIds, setOpenMobile]);
  const labels = {
    navigation: t("nav.main"), mobileNavigation: t("nav.mobile"),
    toggleNavigation: t("nav.toggle"), menu: t("nav.menu"), skipToContent: t("nav.skip"),
    ...overrides,
  };
  const shortcuts = navigation.flatMap(group => group.items).filter(item => item.mobile).slice(0, 3);
  const bottom = mobileNavigation === "bottom";
  const link = (item: AppShellNavItem, mobile = false, sub = false) => {
    const content = <>
      {item.icon && <span aria-hidden="true" className="flex shrink-0 [&>svg]:size-4">{item.icon}</span>}
      <span className={mobile ? "sr-only" : "truncate"}>{item.label}</span>
      {!mobile && item.badge != null && <span className="ml-auto group-data-[collapsible=icon]:hidden">{item.badge}</span>}
    </>;
    const closeDrawer = (event: { metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean }) => {
      if (isMobile && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) setOpenMobile(false);
    };
    const render = renderLink?.(item) ?? <a href={item.href} />;
    return sub ? <SidebarMenuSubButton render={render} isActive={item.active}
      aria-current={item.active ? "page" : undefined} aria-label={item.label}
      className="min-h-11" onClick={closeDrawer}>{content}</SidebarMenuSubButton>
      : <SidebarMenuButton render={render} isActive={item.active}
        aria-current={item.active ? "page" : undefined} aria-label={item.label}
        tooltip={mobile ? undefined : item.label}
        className={cn("min-h-11", mobile && "h-14 min-h-14 justify-center rounded-full [&_svg]:size-5")}
        onClick={closeDrawer}>{content}</SidebarMenuButton>;
  };
  return (
    <>
      <a href={`#${contentId}`} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:p-3 focus:ring-2"
        onClick={() => document.getElementById(contentId)?.focus()}>{labels.skipToContent}</a>
      <Sidebar collapsible="icon">
        <SidebarHeader className="min-h-16 flex-row items-center gap-1 group-data-[collapsible=icon]:flex-col">
          <div className="min-w-0 flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">{brand}</div>
          {brandIcon && <div className="hidden justify-center group-data-[collapsible=icon]:flex">{brandIcon}</div>}
          <Button variant="ghost" size="icon" aria-label={labels.toggleNavigation}
            className="shrink-0 group-data-[collapsible=icon]:w-8"
            aria-expanded={isMobile ? openMobile : state === "expanded"} onClick={toggleSidebar}>
            <PanelLeft aria-hidden="true" />
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <nav aria-label={labels.navigation}>
            {navigation.map(group => group.items.length > 0 && (
              <AppShellNavigationGroup key={group.id} group={group} renderItem={link} />
            ))}
          </nav>
        </SidebarContent>
        {footer && <SidebarFooter>{footer}</SidebarFooter>}
      </Sidebar>
      <SidebarInset className={cn("min-w-0", "pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0")}>
        {banner}
        <div id={contentId} tabIndex={-1} className={cn("min-w-0 flex-1 p-4 outline-none md:p-6", contentClassName)}>{children}</div>
      </SidebarInset>
      {!bottom && <Button variant="outline" size="icon" aria-label={labels.toggleNavigation}
        className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 shadow-sm md:hidden"
        aria-expanded={openMobile} onClick={() => setOpenMobile(true)}>
        <Menu aria-hidden="true" />
      </Button>}
      {bottom && <nav aria-label={labels.mobileNavigation}
        className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 mx-auto flex max-w-md items-stretch gap-1 rounded-full border border-foreground/10 bg-background/80 p-1.5 shadow-[0_8px_32px_-8px_rgb(0_0_0/0.25),inset_0_1px_0_0_rgb(255_255_255/0.25)] backdrop-blur-xl backdrop-saturate-150 supports-[not_(backdrop-filter:blur(1px))]:bg-background dark:bg-background/75 md:hidden">
        {shortcuts.map(item => <div key={item.id} className="min-w-0 flex-1">{link(item, true)}</div>)}
        <Button variant="ghost" className="h-14 min-h-14 flex-1 rounded-full [&_svg]:size-5" aria-label={labels.menu} aria-expanded={openMobile} onClick={() => setOpenMobile(true)}>
          <Menu aria-hidden="true" />
        </Button>
      </nav>}
    </>
  );
}
