import { Link } from "@organizacaox/lai-design-system/router";
import { queryOptions } from "@organizacaox/lai-design-system/query";
import { createApiClient } from "@organizacaox/lai-design-system/fetch";
import { createStore, persist } from "@organizacaox/lai-design-system/store";
const api = createApiClient({ baseURL: "/api" });
const result: Promise<{ id: string }> = api<{ id: string }>("/contact");
void result;
// @ts-expect-error Router registration must reject nonexistent routes.
const invalidRoute = <Link to="/does-not-exist" />;
// @ts-expect-error Route params must remain mandatory through the facade.
const missingParam = <Link to="/contacts/$id" />;
const validRoute = <Link to="/contacts/$id" params={{ id: "1" }} />;
const opts = queryOptions({ queryKey: ["typed"], queryFn: () => api<{ id: string }>("/contact") });
const store = createStore<{ count: number }>()(persist(() => ({ count: 0 }), { name: "typed" }));
// @ts-expect-error Store types must not become any through reexports.
store.setState({ count: "invalid" });
void [invalidRoute, missingParam, validRoute, opts];

import { useTranslation } from "@organizacaox/lai-design-system/i18n";
import { createColumnHelper, tableFeatures } from "@organizacaox/lai-design-system/table";
function TranslationTypes() {
  const { t } = useTranslation();
  const text: string = t("heading");
  // @ts-expect-error Consumer translation keys stay typed through the LAI facade.
  t("nonexistent.translation");
  return text;
}
const tableHelper = createColumnHelper<ReturnType<typeof tableFeatures<{}>>, { name: string }>();
tableHelper.accessor("name", {});
// @ts-expect-error Column keys must remain constrained to the data model.
tableHelper.accessor("missing", {});
void TranslationTypes;

import { useLaiForm } from "@organizacaox/lai-design-system/form";
import { z } from "@organizacaox/lai-design-system/schema";
import { createAppAuthClient } from "@organizacaox/lai-design-system/auth";
import { organizationClient } from "@organizacaox/lai-design-system/auth/plugins";
import { VirtualList } from "@organizacaox/lai-design-system/virtual";
function FormTypes() {
  const form = useLaiForm({ defaultValues: { name: "" }, validators: { onChange: z.object({ name: z.string() }) } });
  form.setFieldValue("name", "Ana");
  // @ts-expect-error Field values retain their type.
  form.setFieldValue("name", 42);
  // @ts-expect-error Unknown field names are rejected.
  form.setFieldValue("missing", "value");
  return null;
}
const authClient = createAppAuthClient({ plugins: [organizationClient()] });
void authClient.organization.setActive({ organizationId: "example" });
// @ts-expect-error Plugin inputs retain native inference.
void authClient.organization.setActive({ organizationId: 42 });
const schema = z.object({ count: z.number() });
type Schema = z.infer<typeof schema>;
// @ts-expect-error Schema inference is preserved.
const wrong: Schema = { count: "wrong" };
const list = <VirtualList items={[{ id: 1 }]} label="test" getKey={item => item.id} renderItem={item => {
  // @ts-expect-error List row inference rejects nonexistent properties.
  return item.missing;
}} />;
void [FormTypes, wrong, list];

import { toolDefinition, clientTools } from "@organizacaox/lai-design-system/ai/client";
import { createChat } from "@organizacaox/lai-design-system/ai/testing";
const lookup = toolDefinition({ name: "lookup", description: "Find a person", inputSchema: z.object({ id: z.number() }), outputSchema: z.object({ name: z.string() }) });
const tools = clientTools(lookup.client());
createChat<typeof tools>().assistant(({ writer }) => {
  writer.tool("lookup", { input: { id: 1 } }).output({ name: "Ana" });
  // @ts-expect-error Tool names must remain typed through both facades.
  writer.tool("missing", { input: { id: 1 } });
  // @ts-expect-error Tool input schema inference must survive packaging.
  writer.tool("lookup", { input: { id: "wrong" } });
});
