import { defineConfig, devices } from "@playwright/test";
import { TEST_AUTH_ENV } from "./tests/e2e/admin/session";

// Content comes from tests/fixtures/content, so the tests need no database. Auth uses a test secret; admin tests
// sign in with a session cookie made from it (see tests/e2e/admin/session.ts).
const env = { CONTENT_SOURCE: "fixtures", DATABASE_URL: "", BLOB_READ_WRITE_TOKEN: "", ...TEST_AUTH_ENV };

// Runs against the production build so snapping, fonts and images behave like the real site.
export default defineConfig({
    testDir: "tests/e2e",
    fullyParallel: true,
    reporter: "list",
    // The admin tests change content, so they get their own server and run one at a time.
    webServer: [
        {
            command: "pnpm start --port 3200",
            url: "http://localhost:3200",
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
            env,
        },
        {
            // A copy of the build: the server writes regenerated pages into its build folder, and these tests edit
            // content, so sharing .next would leak their edits into the public server (and into later runs).
            command:
                "rm -rf .next-admin && cp -R .next .next-admin && NEXT_DIST_DIR=.next-admin pnpm start --port 3210",
            url: "http://localhost:3210",
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
            env,
        },
    ],
    projects: [
        {
            name: "chromium",
            testIgnore: "admin/**",
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 1440, height: 900 },
                baseURL: "http://localhost:3200",
            },
        },
        {
            name: "admin",
            testMatch: "admin/**/*.spec.ts",
            // After the public tests: some of those measure timing and flake when the machine is busy.
            dependencies: ["chromium"],
            workers: 1,
            fullyParallel: false,
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 1440, height: 900 },
                baseURL: "http://localhost:3210",
            },
        },
    ],
});
