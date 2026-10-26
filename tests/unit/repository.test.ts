import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createFixturesRepository, getRepository, setRepository, type ContentRepository } from "@/content/repository";
import { createDbRepository } from "@/db/repository";
import { fixtures } from "../fixtures/content";

const withHeadline = (lead: string) => ({ ...fixtures.profile, headline: { ...fixtures.profile.headline, lead } });

/** A fresh Postgres (PGlite) with the real migrations applied and the fixtures seeded. */
const dbRepository = async () => {
    const db = drizzle({ client: new PGlite() });
    await migrate(db, { migrationsFolder: path.join(__dirname, "../../drizzle") });
    const repo = createDbRepository(db);
    for (const [key, data] of Object.entries(fixtures)) await repo.save(key as keyof typeof fixtures, data);
    return repo;
};

const implementations: [string, () => Promise<ContentRepository>][] = [
    ["fixtures", async () => createFixturesRepository()],
    ["database (PGlite)", dbRepository],
];

describe.each(implementations)("content repository: %s", (_, create) => {
    let repo: ContentRepository;
    beforeEach(async () => {
        repo = await create();
    });

    it("reads each section as stored", async () => {
        for (const [key, data] of Object.entries(fixtures)) {
            expect(await repo.get(key as keyof typeof fixtures)).toEqual(data);
        }
    });

    it("a save replaces the section and records the previous version as a revision", async () => {
        const before = await repo.listRevisions("profile");
        const eventsBefore = await repo.listRevisions("events");
        await repo.save("profile", withHeadline("first edit"));
        expect(await repo.get("profile")).toEqual(withHeadline("first edit"));

        const after = await repo.listRevisions("profile");
        expect(after).toHaveLength(before.length + 1);
        expect(after[0].data).toEqual(fixtures.profile);
        expect(after[0].key).toBe("profile");
        expect(after[0].createdAt).toBeInstanceOf(Date);
        // Other sections are untouched.
        expect(await repo.listRevisions("events")).toEqual(eventsBefore);
    });

    it("restoring a revision makes it current and records the undone version as a new save", async () => {
        await repo.save("profile", withHeadline("first edit"));
        await repo.save("profile", withHeadline("second edit"));
        const [latest] = await repo.listRevisions("profile");
        expect(latest.data).toEqual(withHeadline("first edit"));

        expect(await repo.restore(latest.id)).toBe("profile");
        expect(await repo.get("profile")).toEqual(withHeadline("first edit"));

        const history = await repo.listRevisions("profile");
        expect(history[0].data).toEqual(withHeadline("second edit"));
        expect(history.map((r) => r.data)).toContainEqual(withHeadline("first edit"));
    });

    it("restoring an unknown revision fails and changes nothing", async () => {
        await expect(repo.restore(9999)).rejects.toThrow(/not found/);
        expect(await repo.get("profile")).toEqual(fixtures.profile);
    });

    it("returned data can't be mutated in place", async () => {
        const profile = (await repo.get("profile")) as typeof fixtures.profile;
        profile.name = "changed";
        expect(((await repo.get("profile")) as typeof fixtures.profile).name).toBe(fixtures.profile.name);
    });
});

describe("getRepository", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        setRepository(undefined);
    });

    it("doesn't keep a failed start, so the next call tries again", async () => {
        setRepository(undefined);
        vi.stubEnv("CONTENT_SOURCE", "db");
        vi.stubEnv("DATABASE_URL", "");
        await expect(getRepository()).rejects.toThrow(/DATABASE_URL/);
        // The pool connects lazily, so a placeholder URL is enough to start.
        vi.stubEnv("DATABASE_URL", "postgres://user:pass@localhost:5432/db");
        await expect(getRepository()).resolves.toMatchObject({ get: expect.any(Function) });
    });
});

describe("seed script", () => {
    it("validates the fixtures, writes every section and reads each back unchanged", async () => {
        const { seedContent } = await import("../../scripts/seed-content.mjs");
        const db = drizzle({ client: new PGlite() });
        await migrate(db, { migrationsFolder: path.join(__dirname, "../../drizzle") });
        const repo = createDbRepository(db);
        const lines: string[] = [];
        await seedContent(repo, (l) => lines.push(l));
        expect(lines).toHaveLength(4);
        for (const [key, data] of Object.entries(fixtures)) {
            expect(await repo.get(key as keyof typeof fixtures)).toEqual(data);
        }
        // Running it again is safe: it records the previous versions as revisions.
        await seedContent(repo, () => {});
        expect(await repo.listRevisions("profile")).toHaveLength(1);
    });
});
