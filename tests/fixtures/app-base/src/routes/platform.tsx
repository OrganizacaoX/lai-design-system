import { useEffect, useState } from "react";
import { createFileRoute } from "@organizacaox/lai-design-system/router";
import { useLaiForm, formApiErrors } from "@organizacaox/lai-design-system/form";
import { z } from "@organizacaox/lai-design-system/schema";
import { SortableList } from "@organizacaox/lai-design-system/dnd";
import { VirtualList } from "@organizacaox/lai-design-system/virtual";
import { createAppAuthClient } from "@organizacaox/lai-design-system/auth";
import { organizationClient } from "@organizacaox/lai-design-system/auth/plugins";
import { createAppAnalytics } from "@organizacaox/lai-design-system/analytics";
import { createAppTour, type Driver } from "@organizacaox/lai-design-system/tour";
import "@organizacaox/lai-design-system/tour/styles.css";
import { motion } from "@organizacaox/lai-design-system/motion";
import { format } from "@organizacaox/lai-design-system/date";
import { ptBR } from "@organizacaox/lai-design-system/date/locale";
import { Check } from "@organizacaox/lai-design-system/icons";
import { useChat } from "@organizacaox/lai-design-system/ai";
import { createChat } from "@organizacaox/lai-design-system/ai/testing";
import { renderWithLai, userEvent } from "@organizacaox/lai-design-system/testing";
import { useQuery } from "@organizacaox/lai-design-system/query";
import { useLaiTranslation } from "@organizacaox/lai-design-system/i18n";
export const Route = createFileRoute("/platform")({ component: Platform });
const chat = createChat().user("Olá").assistant(({ writer }) => {
  writer.reasoning("Verificando a base.");
  writer.tool("check", { input: { name: "LAI" } }).output({ ok: true });
  writer.text("Integração pronta.");
});
const connection = chat.transport({ delayMs: 10 });
const rows = Array.from({ length: 1000 }, (_, id) => ({ id, name: `Item ${id}` }));
function Probe() {
  const { language } = useLaiTranslation();
  const [clicked, setClicked] = useState(false);
  const query = useQuery({ queryKey: ["kit"], queryFn: async () => "ok" });
  return <button onClick={() => setClicked(true)}>{language}:{query.data}:{String(clicked)}</button>;
}
function Platform() {
  const [saved, setSaved] = useState("");
  const [items, setItems] = useState(["Ana", "Bruno", "Carla"]);
  const [auth, setAuth] = useState("");
  const [analytics, setAnalytics] = useState("");
  const [kit, setKit] = useState("");
  const [tour, setTour] = useState<Driver>();
  useEffect(() => () => tour?.destroy(), [tour]);
  const { language } = useLaiTranslation();
  const form = useLaiForm({ defaultValues: { name: "" }, validators: {
    onChange: z.object({ name: z.string().min(3, "Informe ao menos 3 caracteres") }),
    onSubmitAsync: async ({ value }) => value.name === "Admin" ? formApiErrors({ name: "Nome reservado pela API" }) : undefined,
  }, onSubmit: async ({ value }) => setSaved(value.name) });
  const { messages, append, status } = useChat({ initialMessages: chat.get(0), connection });
  const busy = status === "submitted" || status === "streaming";
  return <>
    <h1>Platform integrations</h1>
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Check aria-label="Ready" />{format(new Date(2026, 0, 2), "MMMM", { locale: ptBR })}</motion.p>
    <form onSubmit={event => { event.preventDefault(); void form.handleSubmit(); }}>
      <form.AppField name="name">{field => <field.TextField label="Customer name" />}</form.AppField>
      <form.AppForm><form.SubmitButton>Save platform form</form.SubmitButton></form.AppForm>
    </form><p data-testid="saved">{saved}</p>
    <SortableList items={items} getId={item => item} getLabel={item => `Move ${item}`} renderItem={item => <span>{item}</span>} onReorder={setItems} label="People order" />
    <VirtualList items={rows} getKey={item => item.id} renderItem={item => <div style={{ height: 48 }}>{item.name}</div>} label="Virtual people" height={240} />
    <button onClick={async () => {
      const client = createAppAuthClient({ baseURL: window.location.origin, plugins: [organizationClient()] });
      const result = await client.getSession();
      setAuth(result.data?.user.name ?? result.error?.message ?? "No session");
    }}>Load session</button><p data-testid="auth">{auth}</p>
    <button onClick={() => {
      const client = createAppAnalytics({ key: "local-test", host: window.location.origin + "/telemetry", config: {
        persistence: "memory", opt_out_useragent_filter: true, disable_external_dependency_loading: true, advanced_disable_feature_flags: true,
        before_send: event => { if (event?.event === "platform_clicked") setAnalytics(event.event); return null; },
      } });
      client?.capture("platform_clicked");
      client?.opt_out_capturing();
    }}>Test analytics</button><p data-testid="analytics">{analytics}</p>
    <button id="tour-target" onClick={() => {
      tour?.destroy();
      const next = createAppTour({ locale: language, animate: false, steps: [{ element: "#tour-target", popover: { title: "LAI tour", description: "Primeiro passo" } }] });
      setTour(next); next.drive();
    }}>Start tour</button>
    <section aria-label="AI conversation">
      <button disabled={busy || !chat.next(messages)} onClick={() => { const next = chat.next(messages); if (next) void append(next); }}>Run AI fixture</button>
      <p data-testid="ai-status">{status}</p>
      {messages.map(message => <div key={message.id} data-role={message.role}>{message.parts.map((part, index) =>
        <p key={index} data-part={part.type}>{part.type === "text" || part.type === "thinking" ? part.content : JSON.stringify(part)}</p>)}</div>)}
    </section>
    <button onClick={async () => {
      const target = document.createElement("div"); document.body.append(target);
      const view = await renderWithLai(<Probe />, { container: target, i18n: { lng: "es" } });
      try {
        const button = await view.findByRole("button", { name: "es:ok:false" });
        await userEvent.setup().click(button);
        await view.findByRole("button", { name: "es:ok:true" });
        setKit("isolated and cleaned");
      } finally { await view.dispose(); target.remove(); }
    }}>Test render kit</button><p data-testid="kit">{kit}</p>
  </>;
}
