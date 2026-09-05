import { defineConfig, devices } from "@playwright/test";
const port = Number(process.env.LAI_E2E_PORT ?? 4197);
export default defineConfig({
  outputDir: "test-results/browser",
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: `http://127.0.0.1:${port}`, trace: "retain-on-failure" },
  webServer: {
    command: `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      testIgnore: /catalog.spec.ts/,
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
});
