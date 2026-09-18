# Componentes do LAI Design System

Gerado por `scripts/extract_api.py` a partir de `src/components/ui/`. 64 módulos, 400 componentes exportados. Não edite à mão: rode o script de novo.

Tudo aqui é importado da raiz de `@organizacaox/lai-design-system`, sem subpath. As variantes listadas são as únicas aceitas: qualquer outro valor cai no default silenciosamente, sem erro de tipo e sem aviso em runtime. Cada bloco de variantes está sob o nome do componente que realmente a recebe — `variant` costuma existir em mais de um componente do mesmo módulo com valores diferentes.

## accordion

`Accordion`, `AccordionContent`, `AccordionItem`, `AccordionTrigger`

## alert

`Alert`, `AlertAction`, `AlertDescription`, `AlertTitle`

Variantes de `Alert`:

- `variant`: `default` | `destructive` (padrão `default`)

## alert-dialog

`AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogMedia`, `AlertDialogOverlay`, `AlertDialogPortal`, `AlertDialogTitle`, `AlertDialogTrigger`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `size?: "default" | "sm"`  <!-- AlertDialogContent -->

## aspect-ratio

`AspectRatio`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `ratio: number`  <!-- AspectRatio -->

## attachment

`Attachment`, `AttachmentAction`, `AttachmentActions`, `AttachmentContent`, `AttachmentDescription`, `AttachmentGroup`, `AttachmentMedia`, `AttachmentTitle`, `AttachmentTrigger`

Variantes de `AttachmentMedia`:

- `variant`: `icon` | `image` (padrão `icon`)

Variantes de `Attachment`:

- `size`: `default` | `sm` | `xs`
- `orientation`: `horizontal` | `vertical`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `state?: "idle" | "uploading" | "processing" | "error" | "done"`  <!-- Attachment -->
- `type: render ? type : (type ?? "button")`  <!-- AttachmentTrigger -->

## avatar

`Avatar`, `AvatarBadge`, `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarImage`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `size?: "default" | "sm" | "lg"`  <!-- Avatar -->

## badge

`Badge`

Variantes de `Badge`:

- `variant`: `default` | `secondary` | `destructive` | `outline` | `ghost` | `link` (padrão `default`)

## breadcrumb

`Breadcrumb`, `BreadcrumbEllipsis`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbList`, `BreadcrumbPage`, `BreadcrumbSeparator`

## bubble

`Bubble`, `BubbleContent`, `BubbleGroup`, `BubbleReactions`

Variantes de `BubbleReactions`:

- `side`: `top` | `bottom` (padrão `bottom`)
- `align`: `start` | `end` (padrão `end`)

Variantes de `Bubble`:

- `variant`: `default` | `secondary` | `muted` | `tinted` | `outline` | `ghost` | `destructive` (padrão `default`)

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `align?: "start" | "end"`  <!-- Bubble -->
- `align?: "start" | "end"`  <!-- BubbleReactions -->
- `side?: "top" | "bottom"`  <!-- BubbleReactions -->

## button

`Button`

Variantes de `Button`:

- `variant`: `default` | `outline` | `secondary` | `ghost` | `destructive` | `link` (padrão `default`)
- `size`: `default` | `xs` | `sm` | `lg` | `icon` | `icon-xs` | `icon-sm` | `icon-lg` (padrão `default`)

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `loading?: boolean`  <!-- ButtonProps -->
- `loadingLabel?: ReactNode`  <!-- ButtonProps -->

Tipos: `ButtonProps`

## button-group

`ButtonGroup`, `ButtonGroupSeparator`, `ButtonGroupText`

Variantes de `ButtonGroup`:

- `orientation`: `horizontal` | `vertical` (padrão `horizontal`)

## calendar

`Calendar`, `CalendarDayButton`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `buttonVariant?: React.ComponentProps<typeof Button>["variant"]`  <!-- Calendar -->
- `locale?: Partial<Locale>`  <!-- CalendarDayButton -->

## card

`Card`, `CardAction`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `size?: "default" | "sm"`  <!-- Card -->

## carousel

`Carousel`, `CarouselContent`, `CarouselItem`, `CarouselNext`, `CarouselPrevious`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `opts?: CarouselOptions`  <!-- CarouselProps -->
- `plugins?: CarouselPlugin`  <!-- CarouselProps -->
- `orientation?: "horizontal" | "vertical"`  <!-- CarouselProps -->
- `setApi?: (api: CarouselApi) => void`  <!-- CarouselProps -->

## chart

`Area`, `AreaChart`, `Bar`, `BarChart`, `CartesianGrid`, `Cell`, `ChartContainer`, `ChartLegend`, `ChartLegendContent`, `ChartStyle`, `ChartTooltip`, `ChartTooltipContent`, `ComposedChart`, `Line`, `LineChart`, `Pie`, `PieChart`, `PolarAngleAxis`, `PolarGrid`, `PolarRadiusAxis`, `Radar`, `RadarChart`, `RadialBar`, `RadialBarChart`, `RechartsLabel`, `RechartsLegend`, `RechartsTooltip`, `ReferenceArea`, `ReferenceLine`, `ResponsiveContainer`, `Scatter`, `ScatterChart`, `XAxis`, `YAxis`, `ZAxis`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `width: number`  <!-- ChartContainer -->
- `height: number`  <!-- ChartContainer -->
- `hideIcon?: boolean`  <!-- ChartLegendContent -->
- `nameKey?: string`  <!-- ChartLegendContent -->
- `hideLabel?: boolean`  <!-- ChartTooltipContent -->
- `hideIndicator?: boolean`  <!-- ChartTooltipContent -->
- `indicator?: "line" | "dot" | "dashed"`  <!-- ChartTooltipContent -->
- `nameKey?: string`  <!-- ChartTooltipContent -->
- `labelKey?: string`  <!-- ChartTooltipContent -->

Tipos: `ChartConfig`

## checkbox

`Checkbox`

## collapsible

`Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`

## combobox

`Combobox`, `ComboboxChip`, `ComboboxChips`, `ComboboxChipsInput`, `ComboboxCollection`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxGroup`, `ComboboxInput`, `ComboboxItem`, `ComboboxLabel`, `ComboboxList`, `ComboboxSeparator`, `ComboboxTrigger`, `ComboboxValue`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `removeLabel?: string`  <!-- ComboboxChip -->
- `showRemove?: boolean`  <!-- ComboboxChip -->
- `showTrigger?: boolean`  <!-- ComboboxInput -->
- `triggerLabel?: string`  <!-- ComboboxInput -->
- `clearLabel?: string`  <!-- ComboboxInput -->
- `showClear?: boolean`  <!-- ComboboxInput -->

## command

`Command`, `CommandDialog`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `CommandSeparator`, `CommandShortcut`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `title?: string`  <!-- CommandDialog -->
- `description?: string`  <!-- CommandDialog -->
- `showCloseButton?: boolean`  <!-- CommandDialog -->

## context-menu

`ContextMenu`, `ContextMenuCheckboxItem`, `ContextMenuContent`, `ContextMenuGroup`, `ContextMenuItem`, `ContextMenuLabel`, `ContextMenuPortal`, `ContextMenuRadioGroup`, `ContextMenuRadioItem`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuTrigger`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `inset?: boolean`  <!-- ContextMenuCheckboxItem -->
- `inset?: boolean`  <!-- ContextMenuGroup -->
- `inset?: boolean`  <!-- ContextMenuItem -->
- `variant?: "default" | "destructive"`  <!-- ContextMenuItem -->
- `inset?: boolean`  <!-- ContextMenuLabel -->
- `inset?: boolean`  <!-- ContextMenuRadioGroup -->
- `inset?: boolean`  <!-- ContextMenuRadioItem -->
- `inset?: boolean`  <!-- ContextMenuSub -->
- `inset?: boolean`  <!-- ContextMenuSubContent -->
- `inset?: boolean`  <!-- ContextMenuSubTrigger -->

## dialog

`Dialog`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `closeLabel?: string`  <!-- DialogContent -->
- `showCloseButton?: boolean`  <!-- DialogContent -->
- `closeLabel?: string`  <!-- DialogFooter -->
- `showCloseButton?: boolean`  <!-- DialogFooter -->

## direction

`DirectionProvider`

## drawer

`Drawer`, `DrawerClose`, `DrawerContent`, `DrawerDescription`, `DrawerFooter`, `DrawerHeader`, `DrawerOverlay`, `DrawerPortal`, `DrawerSwipeHandle`, `DrawerTitle`, `DrawerTrigger`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `showSwipeHandle?: boolean`  <!-- Drawer -->

## dropdown-menu

`DropdownMenu`, `DropdownMenuCheckboxItem`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuPortal`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `inset?: boolean`  <!-- DropdownMenuCheckboxItem -->
- `inset?: boolean`  <!-- DropdownMenuGroup -->
- `inset?: boolean`  <!-- DropdownMenuItem -->
- `variant?: "default" | "destructive"`  <!-- DropdownMenuItem -->
- `inset?: boolean`  <!-- DropdownMenuLabel -->
- `inset?: boolean`  <!-- DropdownMenuRadioGroup -->
- `inset?: boolean`  <!-- DropdownMenuRadioItem -->
- `inset?: boolean`  <!-- DropdownMenuSub -->
- `inset?: boolean`  <!-- DropdownMenuSubTrigger -->

## empty

`Empty`, `EmptyContent`, `EmptyDescription`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`

Variantes de `EmptyMedia`:

- `variant`: `default` | `icon` (padrão `default`)

## field

`Field`, `FieldContent`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldLabel`, `FieldLegend`, `FieldSeparator`, `FieldSet`, `FieldTitle`

Variantes de `Field`:

- `orientation`: `vertical` | `horizontal` | `responsive` (padrão `vertical`)

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `message?: string`  <!-- FieldError -->
- `variant?: "legend" | "label"`  <!-- FieldLegend -->

## hover-card

`HoverCard`, `HoverCardContent`, `HoverCardTrigger`

## input

`Input`

## input-group

`InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `InputGroupText`, `InputGroupTextarea`

Variantes de `InputGroupAddon`:

- `align`: `inline-start` | `inline-end` | `block-start` | `block-end` (padrão `inline-start`)

Variantes de `InputGroupButton`:

- `size`: `xs` | `sm` | `icon-xs` | `icon-sm` (padrão `xs`)

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `type?: "button" | "submit" | "reset"`  <!-- InputGroupButton -->

## input-otp

`InputOTP`, `InputOTPGroup`, `InputOTPSeparator`, `InputOTPSlot`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `containerClassName?: string`  <!-- InputOTP -->
- `index: number`  <!-- InputOTPSlot -->

## item

`Item`, `ItemActions`, `ItemContent`, `ItemDescription`, `ItemFooter`, `ItemGroup`, `ItemHeader`, `ItemMedia`, `ItemSeparator`, `ItemTitle`

Variantes de `ItemMedia`:

- `variant`: `default` | `icon` | `image` (padrão `default`)

Variantes de `Item`:

- `variant`: `default` | `outline` | `muted` (padrão `default`)
- `size`: `default` | `sm` | `xs` (padrão `default`)

## kbd

`Kbd`, `KbdGroup`

## label

`Label`

## marker

`Marker`, `MarkerContent`, `MarkerIcon`

Variantes de `Marker`:

- `variant`: `default` | `separator` | `border`

## menubar

`Menubar`, `MenubarCheckboxItem`, `MenubarContent`, `MenubarGroup`, `MenubarItem`, `MenubarLabel`, `MenubarMenu`, `MenubarPortal`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarSeparator`, `MenubarShortcut`, `MenubarSub`, `MenubarSubContent`, `MenubarSubTrigger`, `MenubarTrigger`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `inset?: boolean`  <!-- MenubarCheckboxItem -->
- `inset?: boolean`  <!-- MenubarLabel -->
- `inset?: boolean`  <!-- MenubarRadioGroup -->
- `inset?: boolean`  <!-- MenubarRadioItem -->
- `inset?: boolean`  <!-- MenubarSub -->
- `inset?: boolean`  <!-- MenubarSubTrigger -->

## message

`Message`, `MessageAvatar`, `MessageContent`, `MessageFooter`, `MessageGroup`, `MessageHeader`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `align?: "start" | "end"`  <!-- Message -->

## message-scroller

`MessageScroller`, `MessageScrollerButton`, `MessageScrollerContent`, `MessageScrollerItem`, `MessageScrollerProvider`, `MessageScrollerViewport`

## native-select

`NativeSelect`, `NativeSelectOptGroup`, `NativeSelectOption`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `size?: "sm" | "default"`  <!-- NativeSelectProps -->

## navigation-menu

`NavigationMenu`, `NavigationMenuContent`, `NavigationMenuIndicator`, `NavigationMenuItem`, `NavigationMenuLink`, `NavigationMenuList`, `NavigationMenuPositioner`, `NavigationMenuTrigger`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `variant?: "default" | "trigger"`  <!-- NavigationMenuLink -->

## pagination

`Pagination`, `PaginationContent`, `PaginationEllipsis`, `PaginationItem`, `PaginationLink`, `PaginationNext`, `PaginationPrevious`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `isActive?: boolean`  <!-- PaginationItem -->
- `isActive?: boolean`  <!-- PaginationLinkProps -->
- `text?: string`  <!-- PaginationNext -->
- `text?: string`  <!-- PaginationPrevious -->

## popover

`Popover`, `PopoverContent`, `PopoverDescription`, `PopoverHeader`, `PopoverTitle`, `PopoverTrigger`

## progress

`Progress`, `ProgressIndicator`, `ProgressLabel`, `ProgressTrack`, `ProgressValue`

## questionnaire

`Questionnaire`, `QuestionnaireActions`, `QuestionnaireChoice`, `QuestionnaireChoiceDescription`, `QuestionnaireChoices`, `QuestionnaireDescription`, `QuestionnaireError`, `QuestionnaireInput`, `QuestionnaireItem`, `QuestionnaireNext`, `QuestionnairePrevious`, `QuestionnaireProgress`, `QuestionnaireSkip`, `QuestionnaireSubmit`, `QuestionnaireTitle`

## radio-group

`RadioGroup`, `RadioGroupItem`

## resizable

`ResizableHandle`, `ResizablePanel`, `ResizablePanelGroup`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `withHandle?: boolean`  <!-- ResizableHandle -->
- `withHandle?: boolean`  <!-- ResizablePanel -->

## scroll-area

`ScrollArea`, `ScrollBar`

## select

`Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`, `SelectTrigger`, `SelectValue`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `size?: "sm" | "default"`  <!-- SelectTrigger -->

## separator

`Separator`

## sheet

`Sheet`, `SheetClose`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetTitle`, `SheetTrigger`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `side?: "top" | "right" | "bottom" | "left"`  <!-- SheetContent -->
- `closeLabel?: string`  <!-- SheetContent -->
- `showCloseButton?: boolean`  <!-- SheetContent -->

## shimmer

`Shimmer`

## sidebar

`Sidebar`, `SidebarActiveIndicator`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarInput`, `SidebarInset`, `SidebarMenu`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubButton`, `SidebarMenuSubItem`, `SidebarProvider`, `SidebarRail`, `SidebarSelectionGroup`, `SidebarSeparator`, `SidebarTrigger`

Variantes de `SidebarMenuButton`:

- `variant`: `default` | `outline` (padrão `default`)
- `size`: `default` | `sm` | `lg` (padrão `default`)

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `side?: "left" | "right"`  <!-- Sidebar -->
- `variant?: "sidebar" | "floating" | "inset"`  <!-- Sidebar -->
- `collapsible?: "offcanvas" | "icon" | "none"`  <!-- Sidebar -->
- `showOnHover?: boolean`  <!-- SidebarMenuAction -->
- `isActive?: boolean`  <!-- SidebarMenuButton -->
- `tooltip?: string | React.ComponentProps<typeof TooltipContent>`  <!-- SidebarMenuButton -->
- `showIcon?: boolean`  <!-- SidebarMenuSkeleton -->
- `size?: "sm" | "md"`  <!-- SidebarMenuSubButton -->
- `isActive?: boolean`  <!-- SidebarMenuSubButton -->
- `duration: 0`  <!-- SidebarSelectionGroup -->
- `type: "tween", duration: 0.2, ease: "linear"`  <!-- SidebarSelectionGroup -->
- `open: openProp`  <!-- SidebarSelectionGroup -->
- `onOpenChange: setOpenProp`  <!-- SidebarSelectionGroup -->

## skeleton

`Skeleton`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `variant?: "default" | "circle"`  <!-- Skeleton -->

## slider

`Slider`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `thumbLabels?: string[]`  <!-- Slider -->

## sonner

`Toaster`

## spinner

`Spinner`

## switch

`Switch`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `size?: "sm" | "default"`  <!-- Switch -->

## table

`Table`, `TableBody`, `TableCaption`, `TableCell`, `TableFooter`, `TableHead`, `TableHeader`, `TableRow`

## tabs

`Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`

Variantes de `TabsList`:

- `variant`: `default` | `line` (padrão `default`)

## textarea

`Textarea`

## toast

`Toast`, `ToastAction`, `ToastClose`, `ToastContent`, `ToastDescription`, `ToastPortal`, `ToastProvider`, `ToastTitle`, `ToastViewport`, `Toaster`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `type: string | undefined`  <!-- ToastIcon -->

## toggle

`Toggle`

Variantes de `Toggle`:

- `variant`: `default` | `outline` (padrão `default`)
- `size`: `default` | `sm` | `lg` (padrão `default`)

## toggle-group

`ToggleGroup`, `ToggleGroupItem`

Props próprias do LAI, que o shadcn/ui equivalente não tem:

- `spacing?: number`  <!-- ToggleGroup -->
- `orientation?: "horizontal" | "vertical"`  <!-- ToggleGroup -->

## tooltip

`Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`

## typography

`BulletList`, `Caption`, `Description`, `Highlight`, `InlineCode`, `Lead`, `NumberedList`, `Quote`, `SectionSubTitle`, `SectionTitle`, `SubTitle`, `Text`, `TextLink`, `Title`
