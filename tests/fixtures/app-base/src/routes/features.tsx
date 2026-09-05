import { useState } from "react";
import { createFileRoute } from "@organizacaox/lai-design-system/router";
import { I18nextProvider, useTranslation, useLaiTranslation, createLocaleFormatters } from "@organizacaox/lai-design-system/i18n";
import { useTable, tableFeatures, rowSortingFeature, rowPaginationFeature, createSortedRowModel, createPaginatedRowModel, createColumnHelper, sortFn_text } from "@organizacaox/lai-design-system/table";
import { Button, DataTable, DataPagination, DateRangePicker, Dialog, DialogTrigger, DialogContent, DialogTitle, type DateRange } from "@organizacaox/lai-design-system";
import { secondaryI18n } from "../localization";

export const Route = createFileRoute("/features")({ loader: async () => ({ secondary: await secondaryI18n }), component: Features });
const data = [{ id: "1", name: "Bruno" }, { id: "2", name: "Ana" }, { id: "3", name: "Carla" }];
const features = tableFeatures({ rowSortingFeature, rowPaginationFeature, sortedRowModel: createSortedRowModel(), paginatedRowModel: createPaginatedRowModel() });
const helper = createColumnHelper<typeof features, typeof data[number]>();
const columns = helper.columns([helper.accessor("name", { sortFn: sortFn_text })]);
function Isolated() {
  const { t } = useTranslation();
  return <p data-testid="isolated">{t("heading")}</p>;
}
function Features() {
  const { secondary } = Route.useLoaderData();
  const { t, i18n } = useTranslation();
  const { language } = useLaiTranslation();
  const [range, setRange] = useState<DateRange | undefined>({ from: new Date(2025, 0, 15) });
  const table = useTable({ features, columns, data, initialState: { pagination: { pageIndex: 0, pageSize: 2 } } });
  return <>
    <h1>{t("heading")}</h1>
    <label>Language<select aria-label="Language" value={language} onChange={(event) => void i18n.changeLanguage(event.target.value)}>
      <option value="pt-BR">Português</option><option value="en">English</option><option value="es">Español</option>
    </select></label>
    <p data-testid="interpolation">{t("greeting", { name: "Ana" })}</p>
    <p data-testid="plural">{t("items", { count: 2 })}</p>
    <p data-testid="number">{createLocaleFormatters(language).number(1234.5)}</p>
    <I18nextProvider i18n={secondary}><Isolated /></I18nextProvider>
    <section aria-label="Defaults">
      <DataTable data={data} columns={[{ key: "name", label: "Name", render: (row) => row.name }]} bulkActions={[{ label: "Action", onAction: () => {} }]} />
      <DataPagination page={1} totalPages={2} limit={2} onPageChange={() => {}} onLimitChange={() => {}} />
      <DateRangePicker ariaLabel="Range" value={range} onChange={setRange} clearable />
      <Dialog><DialogTrigger render={<Button />}>Open dialog</DialogTrigger><DialogContent><DialogTitle>Details</DialogTitle></DialogContent></Dialog>
    </section>
    <section aria-label="Overrides"><DataPagination page={1} totalPages={2} limit={2} onPageChange={() => {}} onLimitChange={() => {}} labels={{ next: "Custom next" }} /></section>
    <section aria-label="TanStack Table">
      <Button onClick={() => table.getColumn("name")?.toggleSorting(false)}>Sort ascending</Button>
      <table><thead><tr><th>Name</th></tr></thead><tbody>{table.getRowModel().rows.map((row) => <tr key={row.id}><td>{row.original.name}</td></tr>)}</tbody></table>
      <Button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>Next table page</Button>
    </section>
  </>;
}
