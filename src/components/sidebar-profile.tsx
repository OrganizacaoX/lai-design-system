"use client";

import type { ReactElement, ReactNode } from "react";
import { Building2, ChevronsUpDown, Download, Globe, LogOut, Monitor, Moon, Sun, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SidebarProfileAction {
  onSelect?: () => void;
  /** Anchor or router Link forwarding DOM props, events and ref. */
  render?: ReactElement;
  disabled?: boolean;
}

export interface SidebarProfileLabels {
  trigger: string;
  profile: string;
  organization: string;
  install: string;
  theme: string;
  light: string;
  dark: string;
  system: string;
  language: string;
  signOut: string;
  signingOut: string;
}

export interface SidebarProfileProps {
  user: { name: string; email?: string; image?: string; initials?: string };
  profile?: SidebarProfileAction;
  organization?: SidebarProfileAction;
  install?: SidebarProfileAction;
  theme?: { value: "light" | "dark" | "system"; onChange: (value: "light" | "dark" | "system") => void };
  language?: { value: string; options: { value: string; label: string }[]; onChange: (value: string) => void };
  /** The product owns async errors and sets pending while signing out. */
  signOut?: { onSelect: () => void; pending?: boolean; disabled?: boolean };
  actions?: (SidebarProfileAction & { id: string; label: string; icon?: ReactNode })[];
  labels?: Partial<SidebarProfileLabels>;
  className?: string;
}

/** Standard account menu for SidebarFooter or the AppShell footer slot. */
export function SidebarProfile({ user, profile, organization, install, theme, language,
  signOut, actions = [], labels: overrides, className }: SidebarProfileProps) {
  const { state, isMobile } = useSidebar();
  const compact = state === "collapsed" && !isMobile;
  const labels: SidebarProfileLabels = {
    trigger: `Perfil de ${user.name}`, profile: "Meu perfil", organization: "Trocar organização",
    install: "Instalar aplicativo", theme: "Tema", light: "Claro", dark: "Escuro",
    system: "Sistema", language: "Idioma", signOut: "Sair", signingOut: "Saindo…", ...overrides,
  };
  const words = user.name.trim().split(/\s+/).filter(Boolean);
  const initials = user.initials ?? (words.length > 1 ? `${Array.from(words[0])[0]}${Array.from(words[words.length - 1])[0]}` : Array.from(words[0] ?? "?").slice(0, 2).join("")).toLocaleUpperCase();
  const action = (value: SidebarProfileAction | undefined, label: string, icon: ReactNode) =>
    value && <DropdownMenuItem render={value.render} disabled={value.disabled} onClick={value.onSelect}>
      {icon}{label}
    </DropdownMenuItem>;
  const hasActions = profile || organization || install || theme || (language && language.options.length > 0) || actions.length > 0;
  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" aria-label={labels.trigger}
            className="w-full! group-data-[collapsible=icon]:w-8!" />}>
            <Avatar className="size-8 rounded-lg">
              {user.image && <AvatarImage src={user.image} alt="" className="rounded-lg" />}
              <AvatarFallback className="rounded-lg text-xs">{initials}</AvatarFallback>
            </Avatar>
            {!compact && <>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {user.email && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
              </div>
              <ChevronsUpDown aria-hidden="true" className="ml-auto size-4 shrink-0" />
            </>}
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="min-w-56 max-w-[calc(100vw-2rem)]">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="grid min-w-0 gap-1">
                  <span className="truncate font-medium">{user.name}</span>
                  {user.email && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            {hasActions && <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {action(profile, labels.profile, <UserRound aria-hidden="true" />)}
                {action(organization, labels.organization, <Building2 aria-hidden="true" />)}
                {action(install, labels.install, <Download aria-hidden="true" />)}
                {theme && <DropdownMenuSub>
                  <DropdownMenuSubTrigger><Sun aria-hidden="true" />{labels.theme}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={theme.value} onValueChange={value => {
                      if (value === "light" || value === "dark" || value === "system") theme.onChange(value);
                    }}>
                      <DropdownMenuRadioItem value="light"><Sun aria-hidden="true" />{labels.light}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark"><Moon aria-hidden="true" />{labels.dark}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="system"><Monitor aria-hidden="true" />{labels.system}</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>}
                {language && language.options.length > 0 && <DropdownMenuSub>
                  <DropdownMenuSubTrigger><Globe aria-hidden="true" />{labels.language}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={language.value} onValueChange={language.onChange}>
                      {language.options.map(option => <DropdownMenuRadioItem key={option.value} value={option.value}>{option.label}</DropdownMenuRadioItem>)}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>}
                {actions.map(item => <DropdownMenuItem key={item.id} render={item.render} disabled={item.disabled} onClick={item.onSelect}>
                  {item.icon}{item.label}
                </DropdownMenuItem>)}
              </DropdownMenuGroup>
            </>}
            {signOut && <>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={signOut.pending || signOut.disabled} onClick={signOut.onSelect}
                aria-busy={signOut.pending || undefined} className="text-destructive">
                <LogOut aria-hidden="true" />{signOut.pending ? labels.signingOut : labels.signOut}
              </DropdownMenuItem>
            </>}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
