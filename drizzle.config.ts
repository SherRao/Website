import { defineConfig } from "drizzle-kit";

// `pnpm db:generate` writes SQL migrations from src/db/schema.ts; `pnpm db:migrate` applies them to DATABASE_URL.
export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
