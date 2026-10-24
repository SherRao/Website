// Copies the content fixtures into the database: validates every section, saves it (recording any previous version
// as a revision), then reads it back and checks it matches. Usage: DATABASE_URL=... pnpm db:seed
import { isDeepStrictEqual } from "node:util";
import { pathToFileURL } from "node:url";
import type { ContentRepository } from "@/content/repository";
import { sectionKeys, sectionSchemas } from "@/content/schema";
import { fixtures } from "../tests/fixtures/content";

export const seedContent = async (repo: ContentRepository, log: (line: string) => void = console.log) => {
    // Validate everything before writing anything.
    const sections = sectionKeys.map((key) => {
        const parsed = sectionSchemas[key].safeParse(fixtures[key]);
        if (!parsed.success) {
            throw new Error(`Fixture "${key}" failed its schema:\n${JSON.stringify(parsed.error.issues, null, 2)}`);
        }
        return [key, parsed.data] as const;
    });

    for (const [key, data] of sections) {
        await repo.save(key, data);
        if (!isDeepStrictEqual(await repo.get(key), data)) throw new Error(`"${key}" read back differently`);
        log(`seeded ${key}: matches the fixture`);
    }
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
    try {
        const { createDbRepository, getDb } = await import("@/db/repository");
        await seedContent(createDbRepository(getDb()));
        process.exit(0);
    } catch (error) {
        console.error(`seed failed: ${(error as Error).message}`);
        process.exit(1);
    }
}
