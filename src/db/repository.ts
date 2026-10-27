import { Pool } from "@neondatabase/serverless";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { StaleVersionError, type ContentRepository, type Revision } from "@/content/repository";
import type { SectionKey } from "@/content/schema";
import { contentRevisions, contentSections } from "./schema";

// Any Postgres driver works: Neon in production, PGlite in the unit tests.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = PgDatabase<PgQueryResultHKT, any>;

/** A drizzle client for DATABASE_URL over Neon's WebSocket driver, which supports transactions. */
export const getDb = (url = process.env.DATABASE_URL): Db => {
    if (!url) throw new Error("DATABASE_URL is not set (needed when CONTENT_SOURCE=db)");
    return drizzle({ client: new Pool({ connectionString: url }) });
};

/** A section's version is when it was last saved. Saves run one at a time per section, under a row lock. */
const versionOf = (updatedAt: Date) => updatedAt.toISOString();

const toRevision = (r: typeof contentRevisions.$inferSelect): Revision => ({
    id: r.id,
    key: r.key as SectionKey,
    data: r.data,
    createdAt: r.createdAt,
});

export const createDbRepository = (db: Db): ContentRepository => {
    const save = async (key: SectionKey, data: unknown, expected?: string | null) =>
        db.transaction(async (tx) => {
            const [previous] = await tx
                .select({ data: contentSections.data, updatedAt: contentSections.updatedAt })
                .from(contentSections)
                .where(eq(contentSections.key, key))
                .for("update");
            if (expected !== undefined && expected !== (previous ? versionOf(previous.updatedAt) : null)) {
                throw new StaleVersionError();
            }
            if (previous) await tx.insert(contentRevisions).values({ key, data: previous.data });
            // Always later than the version it replaces, so the version changes even within one millisecond.
            const updatedAt = new Date(Math.max(Date.now(), (previous?.updatedAt.getTime() ?? 0) + 1));
            await tx
                .insert(contentSections)
                .values({ key, data, updatedAt })
                .onConflictDoUpdate({ target: contentSections.key, set: { data, updatedAt } });
            return versionOf(updatedAt);
        });

    return {
        get: async (key) => {
            const [row] = await db
                .select({ data: contentSections.data })
                .from(contentSections)
                .where(eq(contentSections.key, key));
            return row ? row.data : null;
        },
        getVersioned: async (key) => {
            const [row] = await db
                .select({ data: contentSections.data, updatedAt: contentSections.updatedAt })
                .from(contentSections)
                .where(eq(contentSections.key, key));
            return row ? { data: row.data, version: versionOf(row.updatedAt) } : null;
        },
        save,
        listRevisions: async (key, page) => {
            const query = db
                .select()
                .from(contentRevisions)
                .where(eq(contentRevisions.key, key))
                .orderBy(desc(contentRevisions.createdAt), desc(contentRevisions.id))
                .$dynamic();
            const rows = page ? await query.limit(page.limit).offset(page.offset ?? 0) : await query;
            return rows.map(toRevision);
        },
        getRevision: async (id) => {
            const [row] = await db.select().from(contentRevisions).where(eq(contentRevisions.id, id));
            return row ? toRevision(row) : null;
        },
    };
};
