import { Pool } from "@neondatabase/serverless";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { RevisionNotFoundError, type ContentRepository } from "@/content/repository";
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

export const createDbRepository = (db: Db): ContentRepository => {
    const save = async (key: SectionKey, data: unknown) => {
        await db.transaction(async (tx) => {
            const [previous] = await tx
                .select({ data: contentSections.data })
                .from(contentSections)
                .where(eq(contentSections.key, key))
                .for("update");
            if (previous) await tx.insert(contentRevisions).values({ key, data: previous.data });
            await tx
                .insert(contentSections)
                .values({ key, data, updatedAt: new Date() })
                .onConflictDoUpdate({ target: contentSections.key, set: { data, updatedAt: new Date() } });
        });
    };

    return {
        get: async (key) => {
            const [row] = await db
                .select({ data: contentSections.data })
                .from(contentSections)
                .where(eq(contentSections.key, key));
            return row ? row.data : null;
        },
        save,
        listRevisions: async (key) => {
            const rows = await db
                .select()
                .from(contentRevisions)
                .where(eq(contentRevisions.key, key))
                .orderBy(desc(contentRevisions.createdAt), desc(contentRevisions.id));
            return rows.map((r) => ({ id: r.id, key: r.key as SectionKey, data: r.data, createdAt: r.createdAt }));
        },
        restore: async (id) => {
            const [revision] = await db.select().from(contentRevisions).where(eq(contentRevisions.id, id));
            if (!revision) throw new RevisionNotFoundError(id);
            const key = revision.key as SectionKey;
            await save(key, revision.data);
            return key;
        },
    };
};
