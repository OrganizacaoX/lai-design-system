import { defineConfig } from "vite";
import { laiRouter } from "@organizacaox/lai-design-system/router/vite";
export default defineConfig({ plugins: [laiRouter()] });
