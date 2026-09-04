import path from "node:path";

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
  return [...externalPackages].some(
    (packageName) => id === packageName || id.startsWith(`${packageName}/`),
  );
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      bundleTypes: true,
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
      entry: path.resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
      cssFileName: "styles",
    },
    rollupOptions: {
      external: isExternal,
      output: {
        banner: '"use client";',
      },
    },
  },
});
