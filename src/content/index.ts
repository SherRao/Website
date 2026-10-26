import { cacheLife, cacheTag } from "next/cache";
import { getRepository } from "./repository";
import { sectionSchemas, type SectionData, type SectionKey } from "./schema";

export * from "./types";

/** The cache tag for a section. A save expires it, so the next request reads the new content. */
export const contentTag = (key: SectionKey) => `content:${key}`;

export class ContentError extends Error {}

export type ContentIssue = { path: string; message: string };

export type EditableSection<K extends SectionKey> =
    | { data: SectionData<K>; issues: []; missing: false }
    | { data: unknown; issues: ContentIssue[]; missing: false }
    | { data: undefined; issues: []; missing: true };

/**
 * Reads a section straight from the store, keeping it even if it fails its schema, with the problems found. For the
 * admin panel, so a section that went invalid, or was never saved (`missing`), can still be opened and fixed.
 */
export const loadSectionForEditing = async <K extends SectionKey>(key: K): Promise<EditableSection<K>> => {
    const raw = await (await getRepository()).get(key);
    if (raw === null) return { data: undefined, issues: [], missing: true };
    const parsed = sectionSchemas[key].safeParse(raw);
    if (parsed.success) return { data: parsed.data as SectionData<K>, issues: [], missing: false };
    return {
        data: raw,
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        missing: false,
    };
};

/** Reads and validates a section straight from the store. Throws rather than return missing or invalid content. */
export const loadSection = async <K extends SectionKey>(key: K): Promise<SectionData<K>> => {
    const section = await loadSectionForEditing(key);
    if (section.missing) throw new ContentError(`Content section "${key}" has not been saved yet`);
    if (section.issues.length) {
        console.error(`Content section "${key}" failed its schema`, section.issues);
        throw new ContentError(`Content section "${key}" failed its schema`);
    }
    return section.data as SectionData<K>;
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
export const getJobs = () => read("jobs");
