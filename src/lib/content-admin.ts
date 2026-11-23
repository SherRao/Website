import { canSaveContent, getRepository, isStaleVersionError, READ_ONLY_MESSAGE } from "@/content/repository";
import { isBlobUrl, isSectionKey, sectionSchemas, type SectionData, type SectionKey } from "@/content/schema";
import type { FieldError, Rejection, SaveResult, SectionSaveResult } from "./admin-contract";
import { startsLikePdf, UPLOADS } from "./upload-rules";

export type { FieldError, Rejection, SaveResult, SectionSaveResult };

/*
 * Saving and restoring content, for both the in-site admin's Server Actions and the content API. Neither check here
 * is about who's asking, and nothing here expires the cache: each caller checks its own credentials first (the owner
 * session, or a request signature) and expires the section's cache tag after a success.
 */

export const STALE_MESSAGE =
    "This section was saved somewhere else (another tab or window) after you opened it. Nothing was saved. Copy " +
    "anything you need, then reload the page to edit the latest version.";

/**
 * Why a save or restore was refused, so a caller can answer with the right status: the store wouldn't keep it, the
 * section or revision doesn't exist, the content fails its checks, or the save is based on an old version.
 */
export type RefusalReason = "read-only" | "not-found" | "invalid" | "stale";
export type Refusal = Rejection & { reason: RefusalReason };

const refused = (reason: RefusalReason, message: string, fieldErrors: FieldError[] = []): Refusal => ({
    ok: false,
    reason,
    message,
    fieldErrors,
});

/** How long a save waits to read a new resume's first bytes, in ms. A hung read refuses the save. */
const RESUME_CHECK_TIMEOUT = 10_000;

/**
 * Why a profile save can't publish its resume, or null if it can. A resume uploaded to Blob went there straight from
 * the browser, so the server never saw its bytes: before a save first points the site at it, its first bytes are
 * read to check it's really a PDF.
 */
const resumeProblem = async (key: SectionKey, data: unknown): Promise<string | null> => {
    if (key !== "profile") return null;
    const { url } = (data as SectionData<"profile">).resume;
    if (!isBlobUrl(url)) return null;
    const current = (await (await getRepository()).get("profile")) as { resume?: { url?: string } } | null;
    if (current?.resume?.url === url) return null;
    try {
        const res = await fetch(url, {
            headers: { Range: "bytes=0-4" },
            cache: "no-store",
            signal: AbortSignal.timeout(RESUME_CHECK_TIMEOUT),
        });
        if (!res.ok) return "The resume file couldn't be read. Upload it again.";
        return startsLikePdf(new Uint8Array(await res.arrayBuffer())) ? null : UPLOADS.resume.wrongType;
    } catch {
        return "The resume file couldn't be read. Upload it again.";
    }
};

/**
 * Saves a whole section: validates it against the schema, then writes it (recording the previous version). Invalid
 * data changes nothing. It doesn't check who's asking or expire the cache: its callers do both (the owner session in
 * a Server Action, a signature in the content API), and expire the section's tag after a successful save.
 *
 * `version` is the version the editor loaded (null if the section was never saved). If the section has been saved
 * since, the save is refused rather than overwrite the newer content.
 */
export const saveSectionCore = async (
    key: string,
    data: unknown,
    version: string | null,
): Promise<{ ok: true; version: string } | Refusal> => {
    if (!canSaveContent()) return refused("read-only", READ_ONLY_MESSAGE);
    if (!isSectionKey(key)) return refused("not-found", `Unknown section "${key}"`);

    const parsed = sectionSchemas[key].safeParse(data);
    if (!parsed.success) {
        return refused(
            "invalid",
            "Some fields need fixing. Nothing was saved.",
            parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        );
    }
    const resume = await resumeProblem(key, parsed.data);
    if (resume) return refused("invalid", `${resume} Nothing was saved.`, [{ path: "resume.url", message: resume }]);
    try {
        return { ok: true, version: await (await getRepository()).save(key, parsed.data, version) };
    } catch (error) {
        if (isStaleVersionError(error)) return refused("stale", STALE_MESSAGE);
        throw error;
    }
};

/**
 * Makes an earlier revision current again (recorded as a new save), if it still passes the same content checks as a
 * save. It takes no version: restoring is a deliberate overwrite, and what it replaces stays in the history. Like
 * saveSectionCore, the caller checks who's asking and expires the section's tag.
 */
export const restoreRevisionCore = async (key: string, revisionId: number): Promise<{ ok: true } | Refusal> => {
    if (!canSaveContent()) return refused("read-only", READ_ONLY_MESSAGE);
    if (!isSectionKey(key)) return refused("not-found", `Unknown section "${key}"`);
    const repo = await getRepository();
    const revision = await repo.getRevision(revisionId);
    if (!revision || revision.key !== key) return refused("not-found", "That revision doesn't exist.");
    const parsed = sectionSchemas[key].safeParse(revision.data);
    if (!parsed.success) {
        return refused("invalid", "That revision doesn't fit the current content schema, so it can't be restored.");
    }
    const resume = await resumeProblem(key, parsed.data);
    if (resume) return refused("invalid", `${resume} Nothing was restored.`);
    // Saved as parsed, like any save, so the restored content is trimmed and has no keys the schema has since dropped.
    await repo.save(key, parsed.data);
    return { ok: true };
};
