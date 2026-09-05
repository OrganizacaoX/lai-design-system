import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/compositions",
  workers: 2,
  use: { baseURL: "http://127.0.0.1:4185", trace: "retain-on-failure" },
  webServer: {
    command: "node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4185 --strictPort",
    url: "http://127.0.0.1:4185",
    reuseExistingServer: false,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
});
