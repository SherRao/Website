import { defineConfig, devices } from "@playwright/test";

// Runs against the production build so snapping, fonts and images behave like the real site.
export default defineConfig({
    testDir: "tests/e2e",
    fullyParallel: true,
    reporter: "list",
    use: { baseURL: "http://localhost:3200" },
    webServer: {
        command: "pnpm start --port 3200",
        url: "http://localhost:3200",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
    projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } }],
});
