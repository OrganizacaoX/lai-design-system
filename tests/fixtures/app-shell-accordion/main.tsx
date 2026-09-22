import { useState } from "react";
import { createRoot } from "react-dom/client";
import { AppShell } from "@/components/app-shell";
import "@/index.css";

// Três grupos recolhíveis com `accordion`: no máximo um aberto por vez, e a
// navegação externa abre o grupo da rota e fecha os outros.
const GROUPS = [
  { id: "reports", label: "Relatórios", items: ["Tendência", "Blocos"] },
  { id: "team", label: "Gestão", items: ["Times", "Papéis"] },
  { id: "audit", label: "Auditoria", items: ["Fila", "Regras"] },
];

function Fixture() {
  const [active, setActive] = useState("Tendência");
  return (
    <AppShell
      brand="Fixture"
      accordion
      mobileNavigation="drawer"
      navigation={GROUPS.map((group) => ({
        id: group.id,
        label: group.label,
        collapsible: true,
        items: group.items.map((label) => ({
          id: label,
          label,
          href: `#${label}`,
          active: label === active,
        })),
      }))}
      renderLink={(item) => (
        <a
          href={item.href}
          onClick={(event) => {
            event.preventDefault();
            setActive(item.id);
          }}
        />
      )}
      labels={{ navigation: "Main navigation" }}
    >
      <h1>{active}</h1>
      <button onClick={() => setActive("Papéis")}>Go to Papéis</button>
    </AppShell>
  );
}

createRoot(document.getElementById("root")!).render(<Fixture />);
