import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Site de documentação/showcase do design system.
// `public/` (que contém o registry em public/r) é copiado para dist/ no build,
// então o registry fica disponível em /r/<item>.json junto com o site.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
});
