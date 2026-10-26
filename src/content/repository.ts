import { fixtures } from "../../tests/fixtures/content";
import type { Content, SectionKey } from "./schema";

export type Revision = { id: number; key: SectionKey; data: unknown; createdAt: Date };

/**
 * Where content is stored. Data is stored and returned as-is: callers validate with the schema before saving and
 * after reading.
 */
export interface ContentRepository {
    /** The current document for a section, or null if it was never saved. */
    get(key: SectionKey): Promise<unknown | null>;
    /** Replaces a section, recording its previous document as a revision in the same transaction. */
    save(key: SectionKey, data: unknown): Promise<void>;
    /** A section's revisions, newest first. */
    listRevisions(key: SectionKey): Promise<Revision[]>;
    /** One revision, or null if there's none with that id. Restoring one is a save of its data. */
    getRevision(id: number): Promise<Revision | null>;
}

/** Content kept in memory, starting from a copy of `initial`. Used for tests, CI and the rollback path. */
export const createFixturesRepository = (initial: Content = fixtures): ContentRepository => {
    const sections = new Map<SectionKey, unknown>(Object.entries(structuredClone(initial)) as [SectionKey, unknown][]);
    const revisions: Revision[] = [];
    let nextId = 1;

    const save = async (key: SectionKey, data: unknown) => {
        if (sections.has(key)) {
            revisions.push({ id: nextId++, key, data: sections.get(key), createdAt: new Date() });
        }
        sections.set(key, structuredClone(data));
    };

    return {
        get: async (key) => (sections.has(key) ? structuredClone(sections.get(key)) : null),
        save,
        listRevisions: async (key) =>
            revisions
                .filter((r) => r.key === key)
                .reverse()
                .map((r) => ({ ...r, data: structuredClone(r.data) })),
        getRevision: async (id) => {
            const revision = revisions.find((r) => r.id === id);
            return revision ? { ...revision, data: structuredClone(revision.data) } : null;
        },
    };
};

export type ContentSource = "db" | "fixtures";

/** CONTENT_SOURCE picks the store: "db" (Neon Postgres) or "fixtures" (the default, no database needed). */
export const contentSource = (): ContentSource => {
    const source = process.env.CONTENT_SOURCE || "fixtures";
    if (source !== "db" && source !== "fixtures") throw new Error(`Unknown CONTENT_SOURCE "${source}"`);
    return source;
};

/**
 * Whether saves can persist. Fixture content is kept in one server's memory, so on a Vercel deployment (many
 * instances, each with its own copy) an edit would be lost or flicker between instances: saving is off there.
 */
export const canSaveContent = () => contentSource() === "db" || !process.env.VERCEL;

export const READ_ONLY_MESSAGE =
    "Editing is off: this deployment reads fixture content. Set CONTENT_SOURCE=db to save.";

// One store per server process. Kept on globalThis so every bundle that imports this module shares it.
const store = globalThis as typeof globalThis & { __contentRepository?: Promise<ContentRepository> };

export const getRepository = (): Promise<ContentRepository> => {
    if (!store.__contentRepository) {
        const pending: Promise<ContentRepository> = (
            contentSource() === "db"
                ? import("@/db/repository").then((m) => m.createDbRepository(m.getDb()))
                : Promise.resolve(createFixturesRepository())
        ).catch((error) => {
            // Don't keep a failed start (say, DATABASE_URL missing for a moment): the next call tries again.
            if (store.__contentRepository === pending) store.__contentRepository = undefined;
            throw error;
        });
        store.__contentRepository = pending;
    }
    return store.__contentRepository;
};

/** Swaps the process's store. For tests only. */
export const setRepository = (repo: ContentRepository | undefined) => {
    store.__contentRepository = repo && Promise.resolve(repo);
};
