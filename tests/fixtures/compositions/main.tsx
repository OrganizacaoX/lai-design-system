import { useState } from "react";
import { createRoot } from "react-dom/client";
import { enUS } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import {
  DataTable,
  DataPagination,
  BottomSheet,
  DateRangePicker,
  Button,
  Input,
  useIsMobile,
  isMobile,
} from "../../../src";
function App() {
  const [data, setData] = useState([
    { id: "one", name: "Ana" },
    { id: "two", name: "Bruno" },
  ]);
  const [selected, setSelected] = useState("");
  const [clicked, setClicked] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(12);
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange>();
  const mobile = useIsMobile();
  return (
    <main className="flex flex-col gap-4 p-4">
      <Button onClick={() => setLoading(!loading)}>Loading</Button>
      <Button onClick={() => setData(data.slice(1))}>Remove first</Button>
      <Button
        onClick={() => {
          setData([]);
          setTotal(0);
        }}
      >
        Empty
      </Button>
      <Button onClick={() => setTotal(1)}>Single</Button>
      <DataTable
        data={data}
        columns={[{ key: "name", label: "Name", render: (item) => item.name }]}
        isLoading={loading}
        onRowClick={(item) => setClicked(item.id)}
        bulkActions={[{ label: "Apply", onAction: (ids) => setSelected(ids.join(",")) }]}
        labels={{
          selectAll: "Select all",
          selectRow: (row) => `Select row ${row}`,
          clear: "Clear selection",
          empty: "No records",
          selected: (count) => `${count} selected`,
        }}
      />
      <output aria-label="Selected">{selected}</output>
      <output aria-label="Clicked">{clicked}</output>
      <DataPagination
        page={page}
        limit={limit}
        totalPages={total}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
        labels={{
          previous: "Previous",
          next: "Next",
          goTo: (page) => `Go to ${page}`,
          limit: "Page size",
        }}
      />
      <output aria-label="Limit">{limit}</output>
      <DateRangePicker
        value={range}
        onChange={setRange}
        locale={enUS}
        presets={[]}
        allowFuture
        closeOnSelect
        clearable
        clearLabel="Clear dates"
        placeholder="Choose dates"
        id="dates"
      />
      <output aria-label="Range">
        {range?.from?.getDate()}:{range?.to?.getDate()}
      </output>
      <Button onClick={() => setOpen(true)}>Open panel</Button>
      <BottomSheet
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Test panel"
        closeLabel="Close panel"
      >
        <Input aria-label="Message" />
      </BottomSheet>
      <output aria-label="Mobile">{String(mobile)}</output>
      <Button onClick={() => setClicked(String(isMobile()))}>Snapshot</Button>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
