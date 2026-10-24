// Applies the SQL migrations in drizzle/ to DATABASE_URL. Usage: DATABASE_URL=... pnpm db:migrate
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";

const url = process.env.DATABASE_URL;
if (!url) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}
const pool = new Pool({ connectionString: url });
await migrate(drizzle({ client: pool }), { migrationsFolder: "drizzle" });
await pool.end();
console.log("migrations applied");
