# Base de aplicação LAI

Instale `@organizacaox/lai-design-system` junto de React 19 e React DOM 19.
Better Fetch, TanStack Query, TanStack Router, o plugin de rotas e Zustand são
dependências diretas com versões fixadas pelo LAI. O frontend importa suas APIs
pelo LAI e não precisa declarar esses pacotes separadamente.

| Import | API |
| --- | --- |
| `@organizacaox/lai-design-system` | Componentes e tema |
| `@organizacaox/lai-design-system/app` | Factories, providers, estados de rota e limpeza |
| `@organizacaox/lai-design-system/fetch` | Better Fetch, schemas, erros e `createApiClient` |
| `@organizacaox/lai-design-system/query` | API e tipos públicos do React Query |
| `@organizacaox/lai-design-system/router` | API e tipos públicos do React Router do TanStack |
| `@organizacaox/lai-design-system/store` | Zustand, middlewares, `shallow` e `useShallow` |
| `@organizacaox/lai-design-system/router/vite` | `laiRouter` e APIs nativas do plugin Vite |

React/React DOM continuam peers. Vite, TypeScript e o plugin React, quando usado,
são ferramentas de desenvolvimento do frontend. O entrypoint `/router/vite` é
exclusivo do build e não é carregado pelos entrypoints de navegador.
A integração é distribuída pelo pacote npm; o registry continua voltado aos
componentes copiáveis.

## Inicialização

```tsx
import { createRoot } from "react-dom/client";
import { AppProviders, createApiClient, createAppQueryClient, createAppRouter } from "@organizacaox/lai-design-system/app";
import { RouterProvider } from "@organizacaox/lai-design-system/router";
import "@organizacaox/lai-design-system/styles.css";
import { routeTree } from "./routeTree.gen";

export const api = createApiClient({ baseURL: import.meta.env.VITE_API_URL });
const queryClient = createAppQueryClient();
const router = createAppRouter({ routeTree, context: { queryClient } });

declare module "@organizacaox/lai-design-system/router" {
  interface Register { router: typeof router }
}

createRoot(document.getElementById("root")!).render(
  <AppProviders queryClient={queryClient}>
    <RouterProvider router={router} />
  </AppProviders>,
);
```

Defina a raiz com `createRootRouteWithContext<{ queryClient: QueryClient }>()`,
importando ambos pelo LAI. O mesmo cliente deve ser passado ao router e ao
provider. Crie uma instância por aplicação; em SSR, por requisição. A base não
cria singletons nem uma store global. O exemplo completo é uma SPA; hidratação
SSR requer configuração do produto.

`AppProviders` combina Query e ThemeProvider, com `theme` opcional para personalizar
as opções do tema. Inclua `Toaster` quando o produto usar notificações.
`createAppRouter` preserva a inferência nativa e oferece preload por intenção,
`defaultPreloadStaleTime: 0` para delegar frescor ao Query e estados padrão em
português. Sobrescreva `defaultPendingComponent`, `defaultErrorComponent` e
`defaultNotFoundComponent` para personalizar/traduzir.

## Rotas por arquivo com Vite

```ts
import { defineConfig } from "vite";
import { laiRouter } from "@organizacaox/lai-design-system/router/vite";

export default defineConfig({
  plugins: [laiRouter()], // antes de react(), se usado
});
```

`laiRouter` usa React e code splitting automático por padrão. Aceita as opções
nativas de diretórios e geração. O scaffold, a árvore gerada e suas declarações
usam `/router` do LAI. Imports internos emitidos pelo code splitter são resolvidos
pelo plugin a partir da instalação do LAI. Gere a árvore (`vite build` ou `vite`)
antes da checagem de tipos de um checkout novo. Não edite `routeTree.gen.ts`.

A API nativa `tanstackRouter` também está disponível para configurações avançadas,
mas a integração de imports LAI pertence a `laiRouter`.

## HTTP e dados

`createApiClient` preserva schemas, plugins, hooks, autenticação e tipos nativos.
Seus padrões são timeout de 15 segundos, zero retries HTTP e `throw: true`.
Erros HTTP são `BetterFetchError`, com `status`; erros de rede/cancelamento podem
ser erros nativos. Passe o `signal` da query até a chamada HTTP.

```ts
import { queryOptions } from "@organizacaox/lai-design-system/query";

const contactsOptions = (organizationId: string) => queryOptions({
  queryKey: ["contacts", organizationId],
  queryFn: ({ signal }) => api<Contact[]>("/contacts", { signal }),
});
```

Use essas mesmas opções em `loader` com `context.queryClient.ensureQueryData`
e em `useQuery`. Após uma mutation, invalide as chaves afetadas. A URL contém
filtros/paginação compartilháveis; Query contém dados do servidor; Zustand contém
estado compartilhado do cliente. Inclua a organização nas chaves de dados por organização.

O Query usa `staleTime: 30_000`, até duas novas tentativas para erros de rede,
408, 429 e 5xx; não repete outros 4xx nem abortos. Mutations não repetem por padrão.
`createAppQueryClient(config)` aceita overrides, caches e opções nativas.
Se ativar retries HTTP explicitamente, coordene-os com os retries do Query.

Para bearer dinâmico, passe `auth: { type: "Bearer", token: () => getToken() }`.
Para cookies cross-origin, configure `credentials: "include"` e CORS no backend.
A base não escolhe o mecanismo de login nem persiste credenciais.

## Stores e troca de contexto

```ts
import { create, persist, createJSONStorage } from "@organizacaox/lai-design-system/store";

interface Preferences { compact: boolean; setCompact: (value: boolean) => void }
export const usePreferences = create<Preferences>()(persist(
  (set) => ({ compact: false, setCompact: (compact) => set({ compact }) }),
  {
    name: "my-product-preferences",
    version: 1,
    storage: createJSONStorage(() => localStorage),
    partialize: ({ compact }) => ({ compact }),
  },
));
```

Selecione campos com `usePreferences(state => state.compact)`; para objetos,
use `useShallow`. Persistência é opt-in, com chave por produto/contexto,
`partialize` e `version`; forneça `migrate` quando mudar o formato persistido.
Em SSR, avalie `skipHydration` e reidratação explícita.

Ao sair ou trocar organização, desmonte a árvore autenticada para interromper
novas consultas, aguarde `resetAppState({ queryClient, resetStores })`, troque a
sessão e remonte/invalide o router. Cada callback restaura a store com
`store.setState(store.getInitialState(), true)` e limpa a persistência relevante
com `await store.persist.clearStorage()`.

A função cancela queries, limpa os caches de queries/mutations e aguarda os resets.
Ela não cancela mutations HTTP já enviadas: finalize operações pendentes antes
da troca, ou controle seu cancelamento no produto. Preferências globais que devem
sobreviver ao logout podem ser omitidas de `resetStores`.

## Exemplo e testes

`tests/fixtures/app-base` é uma aplicação consumidora completa: AppShell, rotas
por arquivo, lista, busca na URL, detalhes, edição/invalidação e store persistida.
O backend local do teste mantém um contato em memória; não usa APIs de produção.

```bash
bun run package:check
bun run package:build
bun run test:app
```

`test:app` empacota o LAI e instala o tarball em diretório temporário com somente
LAI, React e ferramentas de build. Usa dependências aninhadas, sem hoisting das
bibliotecas para o frontend. Valida geração, code splitting, TypeScript
estrito (incluindo rejeição de rotas/params inválidos), HTTP/retries/cancelamento,
reset de store/cache, criação/remoção de rotas no servidor Vite e o fluxo em
Chromium desktop/mobile. Remove os arquivos ao
final. A CI executa esse contrato além dos consumidores de UI/registry.

Referências: [Better Fetch](https://better-fetch.vercel.app/docs/handling-errors),
[TanStack Router](https://tanstack.com/router/latest/docs/guide/external-data-loading),
[Zustand persist](https://zustand.docs.pmnd.rs/reference/middlewares/persist).

A checagem usa `strict: true` e `skipLibCheck: true`, como o projeto LAI:
as declarações atuais de Better Fetch referenciam o tipo global `Timer`, e as do
Router têm uma referência SSR incompatível com a árvore registrada. O teste
valida os tipos usados pelo consumidor e rejeições esperadas; não afirma que
as declarações internas dessas dependências passam com `skipLibCheck: false`.

## Internacionalização

`i18next` e `react-i18next` são dependências diretas. Importe APIs e tipos por
`@organizacaox/lai-design-system/i18n`. Crie uma instância por aplicação (por
requisição no SSR) e aguarde a inicialização antes de renderizar:

```tsx
import { createAppI18n } from "@organizacaox/lai-design-system/i18n";
import { AppProviders } from "@organizacaox/lai-design-system/app";

const i18n = await createAppI18n({
  defaultNS: "app",
  storageKey: "my-product-language",
  resources: {
    "pt-BR": { app: { welcome: "Olá, {{name}}" } },
    en: { app: { welcome: "Hello, {{name}}" } },
    es: { app: { welcome: "Hola, {{name}}" } },
  },
});
// Dentro do bootstrap:
<AppProviders queryClient={queryClient} i18n={i18n}>
  <RouterProvider router={router} />
</AppProviders>;
```

Use `useTranslation("app")`, `Trans` e `i18n.changeLanguage("en")` pelo mesmo
entrypoint. Recursos do produto pertencem a seus namespaces. O namespace `lai`
contém as mensagens compartilhadas em `pt-BR`, `en` e `es`. As chaves LAI são
planas (por exemplo, `pagination.next`); `useLaiTranslation()` aplica essa
configuração sem alterar a forma das chaves do produto.

O idioma inicial segue `lng` explícito, preferência persistida, idioma do
navegador compatível e `pt-BR`. A detecção do navegador pode ser desativada com
`detectLanguage: false`. No servidor, forneça `lng` da requisição; não há acesso
a storage ou detecção de idioma do processo. `supportedLngs` e `fallbackLng`
aceitam configuração nativa. Persistência é opt-in por `storageKey`; falhas de
storage não impedem a tradução. `storage` permite um adaptador próprio.
`i18n.dispose()` remove o listener de persistência quando a instância é descartada.

`AppProviders` atualiza `document.documentElement.lang` e `dir`. Para uma aplicação
embutida, use `updateDocumentLanguage={false}`. `LaiI18nProvider` também é exportado,
com `updateDocument={false}` para providers aninhados, e o `I18nextProvider` nativo
continua disponível. Nenhuma factory registra uma instância global.

AppShell, DataTable, DataPagination, DateRangePicker, Calendar, DataList,
ValidatedForm, FilterBar, BottomSheet e os estados de rota acompanham o idioma.
Dialog, Sheet, Combobox, Sidebar, Pagination, Carousel, Command, Spinner,
Breadcrumb e Toast traduzem seus rótulos internos de acessibilidade. Props
`labels`, `closeLabel`, `locale`, títulos e outras opções explícitas prevalecem.
Sem provider, os textos anteriores são mantidos, inclusive os padrões em inglês
das primitivas. Textos fornecidos pelo produto não são traduzidos automaticamente.
Componentes de terceiros que recebem conteúdo do produto seguem seu próprio contrato.

`useLaiLocale()` conecta `pt-BR`, `en` e `es` aos locales de calendário. Idiomas
adicionais podem fornecer `locale` explicitamente. `createLocaleFormatters(locale)`
fornece `number`, `currency` e `date`; moeda e fuso são escolhas explícitas:

```ts
const format = createLocaleFormatters(i18n.resolvedLanguage ?? "pt-BR");
format.currency(1500, "BRL");
format.date(new Date(), { timeZone: "America/Sao_Paulo", dateStyle: "short" });
```

A tipagem nativa pode ser registrada pelo LAI sem instalar i18next diretamente:

```ts
declare module "@organizacaox/lai-design-system/i18n" {
  interface CustomTypeOptions {
    defaultNS: "app";
    resources: { app: { welcome: string } };
  }
}
```

A factory clona os recursos para impedir compartilhamento mutável entre instâncias.
Para traduções remotas e plugins personalizados, a API nativa `createInstance`
é reexportada: inicialize-a com seus plugins e passe a instância ao provider.

## TanStack Table

`@tanstack/react-table` 9 é dependência direta, com APIs e tipos reexportados em
`@organizacaox/lai-design-system/table`. Use a API v9 (`useTable`, `tableFeatures`
e factories de row models), não os exemplos antigos de `useReactTable` da v8.

```tsx
import {
  useTable, tableFeatures, createColumnHelper,
  rowSortingFeature, createSortedRowModel, sortFn_text,
} from "@organizacaox/lai-design-system/table";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});
const helper = createColumnHelper<typeof features, { name: string }>();
const columns = helper.columns([
  helper.accessor("name", { sortFn: sortFn_text }),
]);
// Dentro do componente, com data estável:
const table = useTable({ features, columns, data });
```

O TanStack Table oferece a lógica headless para tabelas específicas do produto.
O `DataTable` visual existente mantém sua API; esta adição não muda automaticamente
sua implementação. O exemplo `/features` da fixture combina a API nativa v9 com
componentes LAI e valida ordenação e paginação no navegador.

`test:app` agora também verifica imports sem hoisting de i18n/Table, rejeição de
chaves de tradução e colunas inválidas, pluralização, fallback, recursos isolados,
preferência de idioma, formatação, overrides e troca de idioma em desktop/mobile.
