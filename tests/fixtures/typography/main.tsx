import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { TypographyExample } from "../../../site/typography-example";
import { Text } from "@/components/ui/typography";
import { Shimmer } from "@/components/ui/shimmer";
import "@/index.css";
function Fixture() {
  const [active, setActive] = useState(true);
  const paragraph = useRef<HTMLParagraphElement>(null);
  return <main className="mx-auto max-w-4xl p-5">
    <TypographyExample />
    <Text ref={paragraph} tabIndex={-1} className="mt-0" id="override">Texto personalizável</Text>
    <button onClick={() => paragraph.current?.focus()}>Focar texto</button>
    <div className="mt-5"><Shimmer active={active} duration={3500} role="status">{active ? "Gerando resposta…" : "Resposta concluída"}</Shimmer></div>
    <button onClick={() => setActive(value => !value)}>Alternar efeito</button>
    <div dir="rtl"><Shimmer data-testid="rtl">جار التحميل</Shimmer></div>
  </main>;
}
createRoot(document.getElementById("root")!).render(<Fixture />);
