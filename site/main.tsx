import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";
import { ThemeProvider } from "@/components/theme-provider";

import "./code-theme.css";
import { App } from "./App";
import { AppShellExample } from "./app-shell-example";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <ThemeProvider>
      {window.location.pathname === "/examples/app-shell" ? <AppShellExample /> : <App />}
    </ThemeProvider>
  </StrictMode>,
);
