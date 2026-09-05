import { useState } from "react";
import { Button, Input, PageHeader, StatusPanel } from "@organizacaox/lai-design-system";
import { createFileRoute, Link } from "@organizacaox/lai-design-system/router";
import { useQuery, useMutation, useQueryClient } from "@organizacaox/lai-design-system/query";
import { api, contactOptions, type Contact } from "../api";
export const Route = createFileRoute("/contacts/$id")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(contactOptions(params.id)),
  component: ContactPage,
});
function ContactPage() {
  const { id } = Route.useParams();
  const contact = useQuery(contactOptions(id));
  const client = useQueryClient();
  const [name, setName] = useState<string>();
  const save = useMutation({
    mutationFn: () => api<Contact>(`/contacts/${id}`, { method: "PATCH", body: { name: name ?? contact.data?.name } }),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ["contacts"] }),
        client.invalidateQueries({ queryKey: ["contact", id] }),
      ]);
    },
  });
  return <><PageHeader title={contact.data?.name ?? "Contato"} />
    <Input aria-label="Nome" value={name ?? contact.data?.name ?? ""} onChange={(event) => setName(event.target.value)} />
    <Button loading={save.isPending} onClick={() => save.mutate()}>Salvar</Button>
    {save.isSuccess && <StatusPanel state="success" title="Contato salvo" />}
    {save.isError && <StatusPanel state="error" title="Erro ao salvar" />}
    <Link to="/" search={{ q: "" }}>Voltar à lista</Link>
  </>;
}
