import path from "node:path";
import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import packageJson from "./package.json" with { type: "json" };

const externalPackages = new Set([
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
]);

function isExternal(id: string) {
  return id.startsWith("node:") || [...externalPackages].some(
    (packageName) => id === packageName || id.startsWith(`${packageName}/`),
  );
}

export default defineConfig({
  plugins: [
    { name: "lai-tour-css", closeBundle() { copyFileSync(fileURLToPath(import.meta.resolve("driver.js/dist/driver.css")), "lib/tour.css"); } },
    react(),
    tailwindcss(),
    dts({
      // Keep native reexports and Router module augmentations intact.
      bundleTypes: false,
      include: ["src"],
      tsconfigPath: "./tsconfig.lib.json",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  publicDir: false,
  build: {
    outDir: "lib",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        index: path.resolve(import.meta.dirname, "src/index.ts"),
        app: path.resolve(import.meta.dirname, "src/app/index.ts"),
        ...Object.fromEntries(["fetch", "query", "router", "store", "router-vite", "i18n", "table", "form", "schema", "dnd", "virtual", "auth", "auth-plugins", "analytics", "tour", "testing", "motion", "date", "date-locale", "icons", "ai", "ai-client", "ai-testing"].map(name =>
          [name, path.resolve(import.meta.dirname, `src/entries/${name}.ts`)])),
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: "styles",
    },
    rollupOptions: {
      external: isExternal,
      output: {
        banner: (chunk) => chunk.name === "router-vite" ? "" : '"use client";',
      },
    },
  },
});
