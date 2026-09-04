import type { ReactNode } from "react";
import { Bell, Rocket, Settings, Terminal, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type Demo = {
  id: string;
  title: string;
  description: string;
  node: ReactNode;
  code: string;
};

function ToastDemo() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.success("Componente adicionado", {
          description: "@lai/button foi instalado no projeto.",
        })
      }
    >
      Mostrar toast
    </Button>
  );
}

export const demos: Demo[] = [
  {
    id: "button",
    title: "Button",
    description: "Variantes e tamanhos.",
    node: (
      <>
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
        <Button>
          <Rocket /> Com ícone
        </Button>
      </>
    ),
    code: `import { Button } from "@/components/ui/button"

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`,
  },
  {
    id: "badge",
    title: "Badge",
    description: "Etiquetas de status.",
    node: (
      <>
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </>
    ),
    code: `import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>`,
  },
  {
    id: "alert",
    title: "Alert",
    description: "Mensagem com ícone.",
    node: (
      <Alert className="max-w-md">
        <Terminal />
        <AlertTitle>Atenção</AlertTitle>
        <AlertDescription>
          Você pode adicionar componentes com o CLI do shadcn.
        </AlertDescription>
      </Alert>
    ),
    code: `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

<Alert>
  <Terminal />
  <AlertTitle>Atenção</AlertTitle>
  <AlertDescription>
    Você pode adicionar componentes com o CLI do shadcn.
  </AlertDescription>
</Alert>`,
  },
  {
    id: "card",
    title: "Card",
    description: "Contêiner de conteúdo.",
    node: (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Acesse sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="c-email">E-mail</Label>
            <Input id="c-email" type="email" placeholder="voce@empresa.com" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Continuar</Button>
        </CardFooter>
      </Card>
    ),
    code: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Entrar</CardTitle>
    <CardDescription>Acesse sua conta.</CardDescription>
  </CardHeader>
  <CardContent>{/* ... */}</CardContent>
  <CardFooter><Button>Continuar</Button></CardFooter>
</Card>`,
  },
  {
    id: "input",
    title: "Input & Label",
    description: "Campo de texto com rótulo.",
    node: (
      <div className="grid w-full max-w-sm gap-1.5">
        <Label htmlFor="d-email">E-mail</Label>
        <Input id="d-email" type="email" placeholder="voce@empresa.com" />
      </div>
    ),
    code: `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<Label htmlFor="email">E-mail</Label>
<Input id="email" type="email" placeholder="voce@empresa.com" />`,
  },
  {
    id: "textarea",
    title: "Textarea",
    description: "Campo de múltiplas linhas.",
    node: <Textarea className="max-w-sm" placeholder="Escreva uma mensagem..." />,
    code: `import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Escreva uma mensagem..." />`,
  },
  {
    id: "checkbox",
    title: "Checkbox",
    description: "Seleção booleana.",
    node: (
      <div className="flex items-center gap-2">
        <Checkbox id="d-terms" defaultChecked />
        <Label htmlFor="d-terms">Aceito os termos</Label>
      </div>
    ),
    code: `import { Checkbox } from "@/components/ui/checkbox"

<Checkbox id="terms" />
<Label htmlFor="terms">Aceito os termos</Label>`,
  },
  {
    id: "switch",
    title: "Switch",
    description: "Liga/desliga.",
    node: (
      <div className="flex items-center gap-2">
        <Switch id="d-notif" defaultChecked />
        <Label htmlFor="d-notif">Notificações</Label>
      </div>
    ),
    code: `import { Switch } from "@/components/ui/switch"

<Switch id="notif" />
<Label htmlFor="notif">Notificações</Label>`,
  },
  {
    id: "radio-group",
    title: "Radio Group",
    description: "Escolha única.",
    node: (
      <RadioGroup defaultValue="mensal" className="gap-2">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="mensal" id="r-mensal" />
          <Label htmlFor="r-mensal">Mensal</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="anual" id="r-anual" />
          <Label htmlFor="r-anual">Anual</Label>
        </div>
      </RadioGroup>
    ),
    code: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

<RadioGroup defaultValue="mensal">
  <RadioGroupItem value="mensal" id="mensal" />
  <RadioGroupItem value="anual" id="anual" />
</RadioGroup>`,
  },
  {
    id: "select",
    title: "Select",
    description: "Menu suspenso.",
    node: (
      <Select>
        <SelectTrigger className="w-56" aria-label="Plano">
          <SelectValue placeholder="Selecione um plano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>
    ),
    code: `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

<Select>
  <SelectTrigger aria-label="Plano"><SelectValue placeholder="Selecione" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="free">Free</SelectItem>
    <SelectItem value="pro">Pro</SelectItem>
  </SelectContent>
</Select>`,
  },
  {
    id: "tabs",
    title: "Tabs",
    description: "Abas de conteúdo.",
    node: (
      <Tabs defaultValue="conta" className="w-full max-w-sm">
        <TabsList>
          <TabsTrigger value="conta">Conta</TabsTrigger>
          <TabsTrigger value="senha">Senha</TabsTrigger>
        </TabsList>
        <TabsContent value="conta" className="text-sm text-muted-foreground">
          Gerencie os dados da sua conta.
        </TabsContent>
        <TabsContent value="senha" className="text-sm text-muted-foreground">
          Altere sua senha aqui.
        </TabsContent>
      </Tabs>
    ),
    code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs defaultValue="conta">
  <TabsList>
    <TabsTrigger value="conta">Conta</TabsTrigger>
    <TabsTrigger value="senha">Senha</TabsTrigger>
  </TabsList>
  <TabsContent value="conta">...</TabsContent>
</Tabs>`,
  },
  {
    id: "accordion",
    title: "Accordion",
    description: "Seções expansíveis.",
    node: (
      <Accordion className="w-full max-w-sm">
        <AccordionItem value="1">
          <AccordionTrigger>É acessível?</AccordionTrigger>
          <AccordionContent>Sim, segue as práticas de ARIA.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>É estilizável?</AccordionTrigger>
          <AccordionContent>Sim, com Tailwind e os tokens do tema.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

<Accordion>
  <AccordionItem value="1">
    <AccordionTrigger>É acessível?</AccordionTrigger>
    <AccordionContent>Sim.</AccordionContent>
  </AccordionItem>
</Accordion>`,
  },
  {
    id: "avatar",
    title: "Avatar",
    description: "Imagem de perfil com fallback.",
    node: (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>LAI</AvatarFallback>
        </Avatar>
      </div>
    ),
    code: `import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="/user.png" alt="@user" />
  <AvatarFallback>LAI</AvatarFallback>
</Avatar>`,
  },
  {
    id: "separator",
    title: "Separator",
    description: "Divisor horizontal/vertical.",
    node: (
      <div className="w-full max-w-sm">
        <div className="text-sm font-medium">LAI Design System</div>
        <Separator className="my-3" />
        <div className="flex h-5 items-center gap-3 text-sm text-muted-foreground">
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Registry</span>
          <Separator orientation="vertical" />
          <span>Tema</span>
        </div>
      </div>
    ),
    code: `import { Separator } from "@/components/ui/separator"

<Separator />
<Separator orientation="vertical" />`,
  },
  {
    id: "progress",
    title: "Progress",
    description: "Barra de progresso.",
    node: <Progress value={62} aria-label="Progresso da operação" className="w-full max-w-sm" />,
    code: `import { Progress } from "@/components/ui/progress"

<Progress value={62} aria-label="Progresso da operação" />`,
  },
  {
    id: "slider",
    title: "Slider",
    description: "Controle deslizante.",
    node: <Slider aria-label="Volume" defaultValue={[40]} max={100} step={1} className="w-full max-w-sm" />,
    code: `import { Slider } from "@/components/ui/slider"

<Slider aria-label="Volume" defaultValue={[40]} max={100} step={1} />`,
  },
  {
    id: "skeleton",
    title: "Skeleton",
    description: "Placeholder de carregamento.",
    node: (
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="grid gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    ),
    code: `import { Skeleton } from "@/components/ui/skeleton"

<Skeleton className="size-12 rounded-full" />
<Skeleton className="h-4 w-40" />`,
  },
  {
    id: "spinner",
    title: "Spinner",
    description: "Indicador de carregamento.",
    node: (
      <div className="flex items-center gap-4">
        <Spinner />
        <Button disabled>
          <Spinner /> Carregando
        </Button>
      </div>
    ),
    code: `import { Spinner } from "@/components/ui/spinner"

<Spinner />
<Button disabled><Spinner /> Carregando</Button>`,
  },
  {
    id: "tooltip",
    title: "Tooltip",
    description: "Dica ao passar o mouse.",
    node: (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            <Bell /> Passe o mouse
          </TooltipTrigger>
          <TooltipContent>Você tem 3 notificações</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    code: `import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger render={<Button variant="outline" />}>Hover</TooltipTrigger>
    <TooltipContent>Você tem 3 notificações</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
  },
  {
    id: "dialog",
    title: "Dialog",
    description: "Modal com overlay.",
    node: (
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Abrir diálogo
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar ação</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    code: `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger render={<Button />}>Abrir</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirmar</DialogTitle>
      <DialogDescription>Essa ação não pode ser desfeita.</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>`,
  },
  {
    id: "dropdown-menu",
    title: "Dropdown Menu",
    description: "Menu de ações.",
    node: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Abrir menu
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User /> Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings /> Configurações
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    code: `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger render={<Button />}>Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Perfil</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
  },
  {
    id: "popover",
    title: "Popover",
    description: "Painel flutuante.",
    node: (
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Abrir popover
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="grid gap-2">
            <p className="text-sm font-medium">Dimensões</p>
            <p className="text-sm text-muted-foreground">
              Ajuste a largura e a altura do elemento.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    ),
    code: `import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

<Popover>
  <PopoverTrigger render={<Button />}>Abrir</PopoverTrigger>
  <PopoverContent>...</PopoverContent>
</Popover>`,
  },
  {
    id: "breadcrumb",
    title: "Breadcrumb",
    description: "Trilha de navegação.",
    node: (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Componentes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Button</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    code: `import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="#">Início</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Button</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
  },
  {
    id: "toast",
    title: "Toast (Sonner)",
    description: "Notificações temporárias.",
    node: <ToastDemo />,
    code: `import { ThemeProvider, Toaster, useToast } from "@organizacaox/lai-design-system"

function SaveButton() {
  const { toast } = useToast()

  return (
    <button onClick={() => toast.success("Componente adicionado")}>
      Salvar
    </button>
  )
}

function App() {
  return (
    <ThemeProvider>
      <SaveButton />
      <Toaster />
    </ThemeProvider>
  )
}`,
  },
];
