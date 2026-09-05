# Integrações de aplicação

Instale `@organizacaox/lai-design-system` e React/React DOM 19. As dependências abaixo são resolvidas pelo LAI, inclusive em instalações sem hoisting. Use os subpaths para manter imports explícitos. O LAI conserva os tipos e APIs das bibliotecas; as fábricas adicionam somente convenções compartilhadas.

| Import após `@organizacaox/lai-design-system` | API |
| --- | --- |
| `/form` | TanStack Form, `useLaiForm`, `formApiErrors` |
| `/schema` | Zod, `z`, inferência de schemas |
| `/dnd` | DnD Kit core/sortable, `CSS`, `SortableList` |
| `/virtual` | TanStack Virtual, `VirtualList` |
| `/auth`, `/auth/plugins` | Better Auth React e plugins de cliente |
| `/motion` | Motion React |
| `/date`, `/date/locale` | date-fns e locales |
| `/icons` | Lucide React |
| `/analytics` | PostHog e `createAppAnalytics` |
| `/tour`, `/tour/styles.css` | Driver.js, `createAppTour` e CSS explícito |
| `/testing` | Testing Library, user-event e helpers LAI |
| `/ai`, `/ai/client` | TanStack AI React, cliente/transports e `toolDefinition` |
| `/ai/testing` | `createChat` de `@shadcn/helpers/tanstack-ai` |

## Formulários e validação

```tsx
import { useLaiForm, formApiErrors } from "@organizacaox/lai-design-system/form";
import { z } from "@organizacaox/lai-design-system/schema";

const form = useLaiForm({
  defaultValues: { name: "" },
  validators: {
    onChange: z.object({ name: z.string().min(3, t("name.tooShort")) }),
    onSubmitAsync: async ({ value }) => {
      const result = await validateName(value.name);
      if (result.code === "reserved") {
        return formApiErrors({ name: t("name.reserved") });
      }
    },
  },
  onSubmit: async ({ value }) => save(value),
});

<form onSubmit={event => { event.preventDefault(); void form.handleSubmit(); }}>
  <form.AppField name="name">
    {field => <field.TextField label={t("name.label")} />}
  </form.AppField>
  <form.AppForm><form.SubmitButton>{t("save")}</form.SubmitButton></form.AppForm>
</form>
```

`TextField` liga valor, blur, erros, label e descrição acessível ao Input LAI. É um campo de string. Use `form.Field` e a API nativa para selects, booleanos e campos compostos. `SubmitButton` acompanha submissão e validação. Erros de schema e de API aceitam mensagens traduzidas; traduza códigos no domínio da aplicação. O LAI não altera o locale global do Zod. Erros gerais retornados por `formApiErrors(fields, message)` ficam disponíveis no estado do formulário para a UI de resumo do produto. Não use o callback de validação para executar a gravação; ele pode rodar novamente.

## Ordenação e virtualização

```tsx
import { SortableList } from "@organizacaox/lai-design-system/dnd";
import { VirtualList } from "@organizacaox/lai-design-system/virtual";

<SortableList items={people} getId={person => person.id}
  getLabel={person => `Mover ${person.name}`} label="Ordem das pessoas"
  renderItem={person => <span>{person.name}</span>} onReorder={setPeople} />

<VirtualList items={people} getKey={person => person.id} label="Pessoas"
  height={400} estimateSize={48} renderItem={person => <PersonRow person={person} />} />
```

IDs devem ser únicos e estáveis. O handle usa ponteiro/toque e teclado: espaço inicia/finaliza, setas movem, Escape cancela. A lista segue a linguagem do provider LAI para instruções. `getLabel` pertence ao produto e deve ser traduzido.

`VirtualList` mede alturas reais, mantém overscan e informa posição/tamanho total à tecnologia assistiva. Para tabelas, use `useVirtualizer` de `/virtual` com `table.getRowModel().rows` de `/table`; o produto controla a semântica de tabela, foco de células e colunas. Não aninhe a lista dentro de um `tbody`.

## Autenticação e troca de organização

```ts
import { createAppAuthClient, transitionAuthState } from "@organizacaox/lai-design-system/auth";
import { organizationClient } from "@organizacaox/lai-design-system/auth/plugins";

const auth = createAppAuthClient({ baseURL: apiOrigin, plugins: [organizationClient()] });
const result = await transitionAuthState({
  queryClient,
  suspend: suspendProtectedUIAndSettleMutations,
  action: () => auth.organization.setActive({ organizationId }),
  resetStores: [resetProductStore],
  resume: remountAndInvalidateRouter,
});
if (result.error) showError(result.error.message);
```

`auth.useSession()`, `auth.signOut()` e os métodos dos plugins permanecem nativos. Configure plugins equivalentes no servidor. `suspend` deve terminar somente após desmontar os consumidores protegidos e resolver/cancelar mutações do produto. A operação roda depois; quando tem sucesso, o LAI cancela queries, limpa cache e chama os resets antes de `resume`. Se a operação falha, preserva cache e executa `resume`; exceções continuam sendo lançadas. Para logout, passe `action: () => auth.signOut()`. Credenciais, cookies, CORS e autorização pertencem ao servidor. A biblioteca não interrompe mutações que já foram enviadas.

## Analytics e tours

```ts
import { createAppAnalytics } from "@organizacaox/lai-design-system/analytics";
const analytics = createAppAnalytics({ key: publicProjectKey, host: analyticsHost, enabled });
analytics?.identify(user.id);
analytics?.capture("report_opened", { reportId });
// Logout: analytics?.reset(); desativação: analytics?.opt_out_capturing();
```

Crie uma instância por aplicação quando ela decidir habilitar analytics. `enabled: false` e execução no servidor retornam `null`. Defaults desativam autocapture, pageviews/pageleave automáticos e gravação de sessão; `config` permite decisões explícitas do produto. Importar o módulo não inicializa o SDK. Após inicializar, o SDK pode consultar configuração remota e flags no host configurado. Para registrar navegação, conecte o router a `capture` no produto.

```ts
import { createAppTour } from "@organizacaox/lai-design-system/tour";
import "@organizacaox/lai-design-system/tour/styles.css";
const tour = createAppTour({ locale: i18n.language, steps });
tour.drive();
// Cleanup de efeito/navegação:
tour.destroy();
```

Próximo/anterior/concluir/progresso têm defaults pt-BR/en/es e aceitam overrides nativos. Recrie o tour se o idioma mudar. Mantenha um tour ativo por vez, conforme o modelo de estado do Driver.js. Passos, seleção de público e persistência da conclusão pertencem ao produto. A fábrica não inicia tours automaticamente.

## IA e conversas de teste

```tsx
import { useChat } from "@organizacaox/lai-design-system/ai";
import { createChat } from "@organizacaox/lai-design-system/ai/testing";

// Defina fora do render para manter o transporte estável.
const fixture = createChat().user("Olá").assistant("Olá! Como posso ajudar?");
const connection = fixture.transport({ delayMs: 0 });
function ChatDemo() {
  const { messages, append, status } = useChat({ initialMessages: fixture.get(0), connection });
  const next = fixture.next(messages);
  return <button disabled={!next || status === "streaming" || status === "submitted"}
    onClick={() => { if (next) void append(next); }}>Enviar próxima mensagem</button>;
}
```

O [helper shadcn](https://ui.shadcn.com/docs/helpers/tanstack-ai) reproduz conversas locais como eventos AG-UI, incluindo texto, reasoning, ferramentas e erros. Não chama um modelo nem substitui um backend de IA. Para produção, use `fetchServerSentEvents` de `/ai` ou transports de `/ai/client`, apontando para o endpoint da aplicação. Chaves de modelos e adapters de provedor ficam no servidor.

Ferramentas tipadas também ficam no LAI:

```ts
import { toolDefinition, clientTools } from "@organizacaox/lai-design-system/ai/client";
import { z } from "@organizacaox/lai-design-system/schema";
const lookup = toolDefinition({
  name: "lookup", description: "Buscar pessoa",
  inputSchema: z.object({ id: z.number() }),
  outputSchema: z.object({ name: z.string() }),
});
const tools = clientTools(lookup.client());
const fixture = createChat<typeof tools>();
```

Compatibilidade fixada: `@shadcn/helpers 0.2.0`, AI React `0.16.4`, AI Client `0.20.0`, AI `0.40.0`. Esse conjunto respeita os peers do helper. Upgrades devem validar streaming e tipos em conjunto; não atualizar apenas um pacote. A dependência AI fornece os contratos compartilhados; o LAI não exporta um entrypoint de servidor com adapters de modelo.

## Kit de testes

```tsx
import { renderWithLai, userEvent } from "@organizacaox/lai-design-system/testing";
const view = await renderWithLai(<MyForm />, { i18n: { lng: "es" } });
try {
  await userEvent.setup().click(view.getByRole("button", { name: "Guardar" }));
  await view.findByText("Guardado");
} finally {
  await view.dispose();
}
```

Importe `/testing` somente em arquivos de teste. Use ambiente DOM do seu runner ou navegador real com React em modo de desenvolvimento/teste, pois a Testing Library usa `act`. `renderWithLai` cria QueryClient sem retries e i18n isolados, sem alterar idioma do documento. `dispose` desmonta a UI, cancela queries, limpa cache e remove listeners de idioma. Chame-o em `finally`/`afterEach`. O runner e seu ambiente DOM são ferramentas do projeto e não são substituídos pelo LAI.

`createLaiTestContext` fornece `Wrapper`, `queryClient`, `i18n` e `dispose` para testes customizados. `createTestRouter` aceita as opções nativas, incluindo `context`, com memory history por padrão; passe `createMemoryHistory({ initialEntries })` de `/router` para outra rota inicial. Monte o RouterProvider com o Wrapper quando precisar dos dois. Crie stores por teste; `createStoreReset(store)` restaura o estado inicial via setState. Para middleware persist, use storage de teste isolado e limpe-o no teardown se necessário.
