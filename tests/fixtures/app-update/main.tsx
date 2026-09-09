import { useState } from "react";
import { createRoot } from "react-dom/client";
import { AppUpdateCard, AppUpdatingScreen, Button } from "../../../src";
import "@/index.css";

function Fixture() {
  const [screen, setScreen] = useState<"none" | "updating" | "failed">("none");
  const [updates, setUpdates] = useState(0);
  const [retries, setRetries] = useState(0);
  const [cleared, setCleared] = useState(0);
  const [contextual, setContextual] = useState(false);
  const [withClearCache, setWithClearCache] = useState(false);
  return (
    <main className="p-4">
      {/* Abaixo do card e acima do overlay: o teste continua dirigindo a fixture
          sem que os controles cubram o que está sendo testado. */}
      <div className="relative z-60 mt-56 flex flex-wrap items-center gap-2">
        <Button onClick={() => setContextual(value => !value)}>Alternar textos</Button>
        <Button onClick={() => setWithClearCache(value => !value)}>Alternar limpar cache</Button>
        <Button onClick={() => setScreen("updating")}>Tela atualizando</Button>
        <Button onClick={() => setScreen("failed")}>Tela falha</Button>
        <Button onClick={() => setScreen("none")}>Fechar tela</Button>
        <output aria-label="Updates">{updates}</output>
        <output aria-label="Retries">{retries}</output>
        <output aria-label="Cleared">{cleared}</output>
      </div>
      {screen === "none" ? (
        <AppUpdateCard
          onUpdate={() => setUpdates(value => value + 1)}
          description={contextual ? "Atualizar agora interrompe a ligação." : undefined}
        />
      ) : (
        <AppUpdatingScreen
          variant={screen}
          onRetry={() => setRetries(value => value + 1)}
          onClearCache={withClearCache ? () => setCleared(value => value + 1) : undefined}
        />
      )}
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<Fixture />);
