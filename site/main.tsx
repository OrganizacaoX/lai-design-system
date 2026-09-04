import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";
import { ThemeProvider } from "@/components/theme-provider";

import "./code-theme.css";
import { App } from "./App";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
