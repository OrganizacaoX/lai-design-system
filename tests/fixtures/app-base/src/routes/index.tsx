import { Button, Input, PageHeader, StatusPanel } from "@organizacaox/lai-design-system";
import { resetAppState } from "@organizacaox/lai-design-system/app";
import { createFileRoute, Link } from "@organizacaox/lai-design-system/router";
import { useQuery } from "@organizacaox/lai-design-system/query";
import { contactsOptions, queryClient } from "../api";
import { useDraft, resetDraft } from "../state";
export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({ q: typeof search.q === "string" ? search.q : "" }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(contactsOptions(deps.q)),
  component: Contacts,
});
function Contacts() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const contacts = useQuery(contactsOptions(q));
  const note = useDraft((state) => state.note);
  const setNote = useDraft((state) => state.setNote);
  return <><PageHeader title="Contatos" />
    <Input aria-label="Buscar contatos" value={q} onChange={(event) => void navigate({ search: { q: event.target.value } })} />
    {contacts.isError ? <StatusPanel state="error" title="Erro ao buscar" /> : <ul>{contacts.data?.map((contact) => <li key={contact.id}><Link to="/contacts/$id" params={{ id: contact.id }}>{contact.name}</Link></li>)}</ul>}
    <Input aria-label="Rascunho" value={note} onChange={(event) => setNote(event.target.value)} />
    <Button onClick={async () => {
      await navigate({ to: "/signed-out" });
      await resetAppState({ queryClient, resetStores: [resetDraft] });
    }}>Encerrar sessão de exemplo</Button>
  </>;
}
