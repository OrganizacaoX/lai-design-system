import { useState } from "react";
import {
  Bold,
  Inbox,
  Italic,
  Search,
  Star,
  Underline,
} from "lucide-react";
import type { DateRange } from "react-day-picker";

import type { Demo } from "./demos";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Calendar } from "@/components/ui/calendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DateRangePicker } from "@/components/date-range-picker";

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
  );
}

function DateRangeDemo() {
  const [range, setRange] = useState<DateRange | undefined>();
  return <DateRangePicker value={range} onChange={setRange} />;
}

export const extraDemos: Demo[] = [
  {
    id: "alert-dialog",
    title: "Alert Dialog",
    description: "Confirmação destrutiva.",
    node: (
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          Excluir conta
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    code: `import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"

<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive" />}>Excluir</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
      <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction>Continuar</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
  },
  {
    id: "sheet",
    title: "Sheet",
    description: "Painel lateral.",
    node: (
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          Abrir sheet
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Editar perfil</SheetTitle>
            <SheetDescription>
              Faça alterações e salve quando terminar.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    ),
    code: `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Abrir</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Editar perfil</SheetTitle>
      <SheetDescription>...</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`,
  },
  {
    id: "drawer",
    title: "Drawer",
    description: "Gaveta inferior.",
    node: (
      <Drawer>
        <DrawerTrigger render={<Button variant="outline" />}>
          Abrir drawer
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Mover para a lixeira</DrawerTitle>
              <DrawerDescription>
                O item ficará disponível por 30 dias.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Confirmar</Button>
              <DrawerClose render={<Button variant="outline" />}>
                Cancelar
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    ),
    code: `import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"

<Drawer>
  <DrawerTrigger render={<Button variant="outline" />}>Abrir</DrawerTrigger>
  <DrawerContent>{/* ... */}</DrawerContent>
</Drawer>`,
  },
  {
    id: "hover-card",
    title: "Hover Card",
    description: "Cartão ao passar o mouse.",
    node: (
      <HoverCard>
        <HoverCardTrigger render={<Button variant="link" />}>
          @lai
        </HoverCardTrigger>
        <HoverCardContent className="w-64 text-sm">
          Design system do LAI — componentes shadcn reutilizáveis via registry.
        </HoverCardContent>
      </HoverCard>
    ),
    code: `import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

<HoverCard>
  <HoverCardTrigger render={<Button variant="link" />}>@lai</HoverCardTrigger>
  <HoverCardContent>Design system do LAI.</HoverCardContent>
</HoverCard>`,
  },
  {
    id: "context-menu",
    title: "Context Menu",
    description: "Menu com botão direito.",
    node: (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-24 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
          Clique com o botão direito
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Voltar</ContextMenuItem>
          <ContextMenuItem>Recarregar</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Salvar como…</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ),
    code: `import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu"

<ContextMenu>
  <ContextMenuTrigger>Clique com o botão direito</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Voltar</ContextMenuItem>
    <ContextMenuItem>Recarregar</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
  },
  {
    id: "menubar",
    title: "Menubar",
    description: "Barra de menus.",
    node: (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Arquivo</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Novo <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Abrir</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Sair</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Editar</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Desfazer</MenubarItem>
            <MenubarItem>Refazer</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
    code: `import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarShortcut } from "@/components/ui/menubar"

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>Arquivo</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>Novo <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`,
  },
  {
    id: "navigation-menu",
    title: "Navigation Menu",
    description: "Navegação com submenus.",
    node: (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Produtos</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-56 gap-1 p-2">
                <NavigationMenuLink href="#">Registry</NavigationMenuLink>
                <NavigationMenuLink href="#">Componentes</NavigationMenuLink>
                <NavigationMenuLink href="#">Tema</NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
    code: `import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Produtos</NavigationMenuTrigger>
      <NavigationMenuContent>...</NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
  },
  {
    id: "collapsible",
    title: "Collapsible",
    description: "Conteúdo recolhível.",
    node: (
      <Collapsible className="w-full max-w-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">Componentes favoritos</span>
          <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
            Alternar
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-2 grid gap-2 text-sm">
          <div className="rounded-md border px-3 py-2">@lai/button</div>
          <div className="rounded-md border px-3 py-2">@lai/card</div>
        </CollapsibleContent>
      </Collapsible>
    ),
    code: `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

<Collapsible>
  <CollapsibleTrigger render={<Button variant="ghost" />}>Alternar</CollapsibleTrigger>
  <CollapsibleContent>...</CollapsibleContent>
</Collapsible>`,
  },
  {
    id: "command",
    title: "Command",
    description: "Paleta de comandos.",
    node: (
      <Command className="w-full max-w-sm rounded-lg border shadow-sm">
        <CommandInput placeholder="Buscar componente..." />
        <CommandList>
          <CommandEmpty>Nada encontrado.</CommandEmpty>
          <CommandGroup heading="Componentes">
            <CommandItem>
              <Star /> Button
            </CommandItem>
            <CommandItem>Card</CommandItem>
            <CommandItem>Dialog</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    code: `import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"

<Command>
  <CommandInput placeholder="Buscar..." />
  <CommandList>
    <CommandEmpty>Nada encontrado.</CommandEmpty>
    <CommandGroup heading="Componentes">
      <CommandItem>Button</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`,
  },
  {
    id: "native-select",
    title: "Native Select",
    description: "Select nativo do HTML.",
    node: (
      <NativeSelect aria-label="Plano" className="max-w-xs" defaultValue="pro">
        <NativeSelectOption value="free">Free</NativeSelectOption>
        <NativeSelectOption value="pro">Pro</NativeSelectOption>
        <NativeSelectOption value="enterprise">Enterprise</NativeSelectOption>
      </NativeSelect>
    ),
    code: `import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

<NativeSelect aria-label="Plano" defaultValue="pro">
  <NativeSelectOption value="free">Free</NativeSelectOption>
  <NativeSelectOption value="pro">Pro</NativeSelectOption>
</NativeSelect>`,
  },
  {
    id: "input-otp",
    title: "Input OTP",
    description: "Código de verificação.",
    node: (
      <InputOTP aria-label="Código de verificação" maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    ),
    code: `import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"

<InputOTP aria-label="Código de verificação" maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
  },
  {
    id: "toggle",
    title: "Toggle",
    description: "Botão de dois estados.",
    node: (
      <Toggle aria-label="Negrito">
        <Bold />
      </Toggle>
    ),
    code: `import { Toggle } from "@/components/ui/toggle"
import { Bold } from "lucide-react"

<Toggle aria-label="Negrito"><Bold /></Toggle>`,
  },
  {
    id: "toggle-group",
    title: "Toggle Group",
    description: "Grupo de toggles.",
    node: (
      <ToggleGroup multiple>
        <ToggleGroupItem value="bold" aria-label="Negrito">
          <Bold />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Itálico">
          <Italic />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Sublinhado">
          <Underline />
        </ToggleGroupItem>
      </ToggleGroup>
    ),
    code: `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

<ToggleGroup multiple>
  <ToggleGroupItem value="bold"><Bold /></ToggleGroupItem>
  <ToggleGroupItem value="italic"><Italic /></ToggleGroupItem>
</ToggleGroup>`,
  },
  {
    id: "button-group",
    title: "Button Group",
    description: "Botões agrupados.",
    node: (
      <ButtonGroup>
        <Button variant="outline">Anterior</Button>
        <Button variant="outline">Próximo</Button>
      </ButtonGroup>
    ),
    code: `import { ButtonGroup } from "@/components/ui/button-group"

<ButtonGroup>
  <Button variant="outline">Anterior</Button>
  <Button variant="outline">Próximo</Button>
</ButtonGroup>`,
  },
  {
    id: "input-group",
    title: "Input Group",
    description: "Input com adornos.",
    node: (
      <InputGroup className="max-w-sm">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Buscar componentes..." />
      </InputGroup>
    ),
    code: `import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

<InputGroup>
  <InputGroupAddon><Search /></InputGroupAddon>
  <InputGroupInput placeholder="Buscar..." />
</InputGroup>`,
  },
  {
    id: "field",
    title: "Field",
    description: "Campo com rótulo e descrição.",
    node: (
      <div className="w-full max-w-sm">
        <Field>
          <FieldLabel htmlFor="fld-name">Nome de exibição</FieldLabel>
          <Input id="fld-name" placeholder="LAI" />
          <FieldDescription>É assim que aparece no seu perfil.</FieldDescription>
        </Field>
      </div>
    ),
    code: `import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

<Field>
  <FieldLabel htmlFor="name">Nome</FieldLabel>
  <Input id="name" />
  <FieldDescription>Como aparece no perfil.</FieldDescription>
</Field>`,
  },
  {
    id: "table",
    title: "Table",
    description: "Tabela de dados.",
    node: (
      <div className="w-full max-w-md">
        <Table>
          <TableCaption>Faturas recentes.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Fatura</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>INV001</TableCell>
              <TableCell>Pago</TableCell>
              <TableCell className="text-right">R$ 250</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>INV002</TableCell>
              <TableCell>Pendente</TableCell>
              <TableCell className="text-right">R$ 150</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    ),
    code: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow><TableHead>Fatura</TableHead><TableHead>Status</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>INV001</TableCell><TableCell>Pago</TableCell></TableRow>
  </TableBody>
</Table>`,
  },
  {
    id: "pagination",
    title: "Pagination",
    description: "Navegação entre páginas.",
    node: (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
    code: `import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination"

<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
    <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext href="#" /></PaginationItem>
  </PaginationContent>
</Pagination>`,
  },
  {
    id: "kbd",
    title: "Kbd",
    description: "Teclas de atalho.",
    node: (
      <div className="flex items-center gap-2 text-sm">
        Pressione
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        para buscar
      </div>
    ),
    code: `import { Kbd, KbdGroup } from "@/components/ui/kbd"

<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>`,
  },
  {
    id: "aspect-ratio",
    title: "Aspect Ratio",
    description: "Proporção fixa.",
    node: (
      <div className="w-full max-w-sm">
        <AspectRatio
          ratio={16 / 9}
          className="grid place-items-center rounded-lg bg-muted text-sm text-muted-foreground"
        >
          16 / 9
        </AspectRatio>
      </div>
    ),
    code: `import { AspectRatio } from "@/components/ui/aspect-ratio"

<AspectRatio ratio={16 / 9}>
  <img src="/foto.jpg" className="size-full rounded-lg object-cover" />
</AspectRatio>`,
  },
  {
    id: "scroll-area",
    title: "Scroll Area",
    description: "Área com rolagem estilizada.",
    node: (
      <ScrollArea className="h-40 w-full max-w-xs rounded-md border p-4">
        <div className="grid gap-2 text-sm">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}>Item {i + 1}</div>
          ))}
        </div>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea className="h-40 w-48 rounded-md border p-4">
  {/* conteúdo longo */}
</ScrollArea>`,
  },
  {
    id: "resizable",
    title: "Resizable",
    description: "Painéis redimensionáveis.",
    node: (
      <ResizablePanelGroup
        orientation="horizontal"
        className="h-40 w-full max-w-sm rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <div className="grid h-full place-items-center p-4 text-sm">Um</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="grid h-full place-items-center p-4 text-sm">Dois</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
    code: `import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

<ResizablePanelGroup orientation="horizontal">
  <ResizablePanel defaultSize={50}>Um</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={50}>Dois</ResizablePanel>
</ResizablePanelGroup>`,
  },
  {
    id: "item",
    title: "Item",
    description: "Linha de lista com mídia e ações.",
    node: (
      <ItemGroup className="w-full max-w-sm gap-2">
        <Item>
          <ItemMedia>
            <Avatar>
              <AvatarFallback>L</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>LAI Design System</ItemTitle>
            <ItemDescription>63 itens no registry</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" variant="outline">
              Ver
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    ),
    code: `import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item"

<Item>
  <ItemMedia><Avatar>...</Avatar></ItemMedia>
  <ItemContent>
    <ItemTitle>LAI</ItemTitle>
    <ItemDescription>Design system</ItemDescription>
  </ItemContent>
  <ItemActions><Button size="sm">Ver</Button></ItemActions>
</Item>`,
  },
  {
    id: "empty",
    title: "Empty",
    description: "Estado vazio.",
    node: (
      <Empty className="w-full max-w-sm border rounded-lg">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>Sem resultados</EmptyTitle>
          <EmptyDescription>Nenhum item encontrado por aqui.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">Adicionar item</Button>
        </EmptyContent>
      </Empty>
    ),
    code: `import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"

<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
    <EmptyTitle>Sem resultados</EmptyTitle>
    <EmptyDescription>Nenhum item encontrado.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><Button size="sm">Adicionar</Button></EmptyContent>
</Empty>`,
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "Seleção de data.",
    node: <CalendarDemo />,
    code: `import { Calendar } from "@/components/ui/calendar"

const [date, setDate] = useState<Date>()

<Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />`,
  },
  {
    id: "date-range-picker",
    title: "Date Range Picker",
    description: "Seleção de intervalo de datas.",
    node: <DateRangeDemo />,
    code: `import { DateRangePicker } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"

const [range, setRange] = useState<DateRange>()

<DateRangePicker value={range} onChange={setRange} />`,
  },
  {
    id: "carousel",
    title: "Carousel",
    description: "Slides navegáveis.",
    node: (
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <CarouselItem key={i}>
              <div className="grid aspect-square place-items-center rounded-lg border text-4xl font-semibold">
                {i + 1}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    ),
    code: `import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

<Carousel>
  <CarouselContent>
    <CarouselItem>1</CarouselItem>
    <CarouselItem>2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
  },
];
