import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";
import { ThemeProvider } from "@/components/theme-provider";

import "./code-theme.css";
import { App } from "./App";
import { AppShellExample } from "./app-shell-example";
import { AuthGate } from "./components/auth-gate";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthGate>
        {window.location.pathname === "/examples/app-shell" ? (
          <AppShellExample />
        ) : (
          <App />
        )}
      </AuthGate>
    </ThemeProvider>
  </StrictMode>,
);
