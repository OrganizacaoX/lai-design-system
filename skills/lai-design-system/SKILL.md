---
name: lai-design-system
description: Como escrever interfaces com o LAI Design System (@organizacaox/lai-design-system) — componentes disponíveis, variantes válidas, padrões de composição do Base UI e os subpaths corretos de import. Use sempre que for criar, editar ou revisar qualquer .tsx/.jsx num projeto que dependa de @organizacaox/lai-design-system, mesmo que o pedido não cite o design system: montar telas, formulários, tabelas, listas, diálogos, layout de app, estados de loading/erro/vazio, ou estilizar qualquer coisa com Tailwind nesses projetos. Consulte antes de escrever JSX, não depois — o custo de descobrir que `asChild` não existe aqui é reescrever o componente inteiro.
---

# LAI Design System

Biblioteca de componentes React sobre **Base UI**, distribuída como `@organizacaox/lai-design-system`. São 64 módulos e cerca de 400 componentes exportados, além de 11 composições de alto nível.

A armadilha central: o LAI **se parece** com shadcn/ui — muitos nomes batem (`Card`, `CardHeader`, `Badge`, `Table`) e o `registry.json` usa o schema do shadcn. Mas por baixo é Base UI, não Radix. Escrever de memória shadcn produz código que passa no lint, quebra em runtime e às vezes nem quebra: só ignora a prop em silêncio. Por isso: confirme na referência antes de escrever.

## Antes de escrever JSX

1. **O componente existe?** Procure em `references/components.md` (gerado do código-fonte, é a lista autoritativa).
2. **Já existe uma composição pronta?** Veja "Prefira as composições" abaixo. Montar uma tabela com estados de loading e vazio à mão quando existe `DataList` é o erro mais caro e mais comum.
3. **A variante que você quer usar existe?** As variantes estão em `references/components.md`, por componente. Valor inválido não dá erro: o `cva` cai no default e a UI sai visualmente errada sem nenhum sinal.

## Imports

Importe componentes da raiz do pacote. Nunca crie reexports locais nem copie primitivas para dentro do projeto — a atualização do pacote precisa alcançar todo mundo.

```tsx
import { Button, Card, CardHeader, CardTitle, cn } from "@organizacaox/lai-design-system";
```

Para bibliotecas de apoio, use **sempre o subpath do LAI**, nunca a biblioteca direto. O subpath é um reexport, e passar por ele garante que o app e o design system compartilhem a mesma instância e a mesma versão. Importar `zod` ou `@tanstack/react-router` direto é o caminho mais rápido para dois contextos de router diferentes e devtools que não enxergam nada.

| Precisa de | Importe de | Em vez de |
| --- | --- | --- |
| Ícones (Lucide) | `.../icons` | `lucide-react` |
| Zod | `.../schema` | `zod` |
| Zustand | `.../store` | `zustand` |
| TanStack Query | `.../query` | `@tanstack/react-query` |
| TanStack Router | `.../router` | `@tanstack/react-router` |
| TanStack Table | `.../table` | `@tanstack/react-table` |
| TanStack Form | `.../form` | `@tanstack/react-form` |
| Better Fetch | `.../fetch` | `@better-fetch/fetch` |
| date-fns | `.../date` | `date-fns` |
| Motion | `.../motion` | `motion/react` |
| i18next | `.../i18n` | `i18next` / `react-i18next` |

Gráficos são exceção conveniente: o módulo `chart` já reexporta o Recharts inteiro (`AreaChart`, `XAxis`, `Bar`, …) pela raiz do pacote, então `import { LineChart, XAxis } from "@organizacaox/lai-design-system"` funciona e é o caminho certo.

## Composição: `render`, nunca `asChild`

Base UI substitui o `asChild` do Radix pela prop `render`, que recebe **um elemento**, não uma função nem um filho. Não existe uma única ocorrência de `asChild` neste design system; se você escreveu `asChild`, está escrevendo Radix de memória.

```tsx
// certo — o Trigger vira um Button
<DialogTrigger render={<Button variant="outline" />}>Abrir</DialogTrigger>

// certo — integrando com o router
<SidebarMenuButton render={<Link to="/dashboard" />}>Dashboard</SidebarMenuButton>

// errado — asChild não existe aqui
<DialogTrigger asChild><Button>Abrir</Button></DialogTrigger>
```

O elemento passado em `render` recebe os props e o comportamento do componente que o hospeda; o conteúdo continua indo em `children` do componente externo, como no exemplo. Isso vale para todos os componentes que aceitam `render` — entre eles `DialogTrigger`, `SidebarMenuButton`, `AlertDialogAction`, `Badge`, `Item`, `PaginationLink`, `BreadcrumbLink`, `SelectTrigger` e `ComboboxTrigger`.

## Prefira as composições

Antes de montar uma tela a partir das primitivas, verifique se uma destas já resolve. Elas carregam decisões de acessibilidade, i18n e estados de erro que uma montagem manual perde. Props completas em `references/compositions.md`.

| Composição | Resolve |
| --- | --- |
| `AppShell` | Layout completo: sidebar, navegação, drawer mobile, skip-link |
| `AppUpdateCard` | Aviso de nova versão disponível |
| `PageHeader` | Título, descrição, breadcrumbs, badges, meta, botão voltar |
| `DataList` | Lista com loading, erro, vazio e retry já embutidos |
| `DataTable` | Tabela sobre TanStack Table |
| `DataPagination` | Paginação com controle de page size |
| `FilterBar` | Busca com reset e filtros adicionais |
| `StatusPanel` | Um dos estados `loading`/`error`/`empty`/`success`/`unavailable` |
| `ValidatedForm` | Formulário declarativo por definição de campos |
| `BottomSheet` | Folha inferior com snap points |
| `SidebarProfile` | Menu de usuário com tema, idioma e logout |
| `DateRangePicker` | Intervalo de datas com presets |

O caso mais frequente: uma lista que carrega de uma API. `DataList` já recebe `loading`, `error`, `onRetry`, `emptyTitle` e `emptyDescription`, então não escreva o encadeamento de `if (loading) … if (error) …` na mão.

```tsx
<DataList
  items={data ?? []}
  getKey={(item) => item.id}
  renderItem={(item) => <Item>{item.name}</Item>}
  loading={isPending}
  error={error?.message}
  onRetry={refetch}
  emptyTitle="Nenhum registro"
/>
```

## Texto: use os componentes de tipografia

Não escreva `<h1 className="text-4xl font-bold">`. O módulo `typography` existe para que escala, `text-balance` e quebra de palavra sejam consistentes — e os nomes não são óbvios, então esta é a tabela que evita o erro:

| Use | Renderiza | Para |
| --- | --- | --- |
| `Title` | `<h1>` | Título da página |
| `SubTitle` | `<h2>` | Seção principal (tem borda inferior) |
| `SectionTitle` | `<h3>` | Subseção |
| `SectionSubTitle` | `<h4>` | Nível mais fundo |
| `Text` | `<p>` | Parágrafo de corpo |
| `Lead` | `<p>` | Parágrafo de abertura, maior e suave |
| `Description` | `<p>` | Texto de apoio em `muted-foreground` |
| `Caption` | `<small>` | Legenda |
| `Highlight` | `<div>` | Destaque em negrito |
| `TextLink` | `<a>` | Link em meio a texto |
| `InlineCode` | `<code>` | Código dentro de frase |
| `Quote` | `<blockquote>` | Citação |
| `BulletList` / `NumberedList` | `<ul>` / `<ol>` | Listas |

Escolha o nível do heading pela **estrutura do documento**, não pelo tamanho visual desejado — ajuste tamanho com `className` se precisar, mantendo a semântica correta.

## Armadilhas que custam caro

**`Toaster` e `BaseToaster` são coisas diferentes.** A raiz exporta `Toaster` (wrapper do Sonner, acompanhado de `useToast`) e `BaseToaster` (o toast do Base UI, com `toast`, `useToastManager`, `ToastProvider`). Escolha um e mantenha; misturar os dois monta dois sistemas de notificação na mesma aplicação.

**`variant` significa coisas diferentes em componentes do mesmo módulo.** Em `Sidebar`, `variant` é `sidebar | floating | inset` e descreve o layout. Em `SidebarMenuButton`, é `default | outline`. O mesmo vale para `Item` (`default | outline | muted`) e `ItemMedia` (`default | icon | image`), e para `Attachment` e `AttachmentMedia`. Confirme a qual componente a variante pertence em `references/components.md` — ela está listada sob o nome do componente dono.

**Variante inválida falha em silêncio.** `<Button variant="primary">` não existe (o certo é `default`) e não vai acusar erro: o `cva` aplica o default e o botão sai com a aparência errada. Os valores de `Button` são `default | outline | secondary | ghost | destructive | link` e os tamanhos `default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg`.

**`Button` tem estado de carregamento nativo.** Use `loading` (e opcionalmente `loadingLabel`) em vez de montar spinner e `disabled` na mão — ele já desabilita o botão e marca `aria-busy`.

```tsx
<Button loading={isPending} loadingLabel="Salvando…">Salvar</Button>
```

**A prop de carregamento muda de nome entre as composições.** `DataList` recebe `loading`; `DataTable` recebe `isLoading`. As duas ignoram o nome errado em silêncio, e o resultado é uma tela que nunca sai do estado vazio enquanto a requisição corre. Confirme em `references/compositions.md` — não deduza pela outra.

**Para variar estilo, use `className` com `cn`.** O `cn` é exportado pela raiz e faz merge de classes Tailwind resolvendo conflitos. Não recrie o componente para mudar um espaçamento.

## Formulários

Use a família `Field` para estrutura e rotulagem: `FieldSet`, `FieldLegend`, `FieldGroup`, `Field`, `FieldLabel`, `FieldContent`, `FieldDescription`, `FieldError`, `FieldSeparator`, `FieldTitle`. `Field` aceita `orientation` em `vertical | horizontal | responsive`.

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">E-mail</FieldLabel>
    <Input id="email" type="email" />
    <FieldDescription>Usamos para enviar o recibo.</FieldDescription>
    <FieldError errors={field.state.meta.errors} />
  </Field>
</FieldGroup>
```

`FieldError` aceita `errors` — um array de `{ message }`, no formato que o TanStack Form já devolve em `field.state.meta.errors`. Ele deduplica as mensagens e não renderiza nada quando o array está vazio, então não precisa envolver em condicional. Passar `children` sobrescreve `errors`, útil para erro vindo do servidor: `<FieldError>{erroDaApi}</FieldError>`.

Para formulários com validação, prefira TanStack Form pelo subpath `.../form` com Zod por `.../schema`. Quando o formulário for uma sequência simples de campos, `ValidatedForm` resolve declarativamente por uma lista de definições.

## Referências

Leia sob demanda, não tudo de uma vez:

- **`references/components.md`** — os 64 módulos, todos os componentes exportados, variantes válidas com seus defaults e props próprias do LAI. Consulte sempre que precisar confirmar um nome ou uma variante. Gerado do código-fonte.
- **`references/compositions.md`** — props completas das 11 composições de alto nível.

Quando adicionar ou alterar componentes no design system, regenere a referência para que ela não envelheça:

```bash
python3 skills/lai-design-system/scripts/extract_api.py
```

Use `--check` no CI: ele falha quando existe componente novo ainda não refletido na referência.
