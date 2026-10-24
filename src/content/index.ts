import { cacheLife, cacheTag } from "next/cache";
import { getRepository } from "./repository";
import { sectionSchemas, type SectionData, type SectionKey } from "./schema";

export * from "./types";
// Temporary: the old module exports, until every reader uses the getters below.
export * from "./profile";
export * from "./products";
export * from "./events";
export * from "./panels";

/** The cache tag for a section. A save expires it, so the next request reads the new content. */
export const contentTag = (key: SectionKey) => `content:${key}`;

export class ContentError extends Error {}

/** Reads and validates a section straight from the store. Throws rather than return missing or invalid content. */
export const loadSection = async <K extends SectionKey>(key: K): Promise<SectionData<K>> => {
    const raw = await (await getRepository()).get(key);
    if (raw === null) throw new ContentError(`Content section "${key}" has not been saved yet`);
    const parsed = sectionSchemas[key].safeParse(raw);
    if (!parsed.success) {
        console.error(`Content section "${key}" failed its schema`, parsed.error.issues);
        throw new ContentError(`Content section "${key}" failed its schema`);
    }
    return parsed.data as SectionData<K>;
};

/**
 * A section through the Next.js cache: kept until a save expires its tag. If reading fails (the store is down or the
 * data is invalid) this throws, so the last good cached entry keeps serving instead of partial content.
 */
const read = async <K extends SectionKey>(key: K): Promise<SectionData<K>> => {
    "use cache";
    cacheTag(contentTag(key));
    cacheLife("max");
    return loadSection(key);
};

export const getProfile = () => read("profile");
export const getProducts = () => read("products");
export const getEvents = () => read("events");
export const getPanels = () => read("panels");
