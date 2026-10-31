import { updateTag } from "next/cache";
import { contentTag } from "@/content";
import { canSaveContent, getRepository, READ_ONLY_MESSAGE, StaleVersionError } from "@/content/repository";
import { isSectionKey, sectionSchemas } from "@/content/schema";
import { NotOwnerError } from "./owner";
import { requireOwner } from "./require-owner";
import { stealthMentions } from "./stealth";

export type FieldError = { path: string; message: string };
export type Rejection = { ok: false; message: string; fieldErrors: FieldError[] };
export type SaveResult = { ok: true } | Rejection;
/** A save from the editor also returns the section's new version, which its next save is based on. */
export type SectionSaveResult = { ok: true; version: string } | Rejection;

export const STALE_MESSAGE =
    "This section was saved somewhere else (another tab or window) after you opened it. Nothing was saved. Copy " +
    "anything you need, then reload the page to edit the latest version.";

const rejected = (message: string, fieldErrors: FieldError[] = []): Rejection => ({ ok: false, message, fieldErrors });

export const STEALTH_MESSAGE = "This would publish details of the company in stealth. Nothing was saved.";

/** Why a change can't be made at all (no owner session, or a store that wouldn't keep it), or null if it can. */
const refuseChange = async (): Promise<Rejection | null> => {
    try {
        await requireOwner();
    } catch (error) {
        if (error instanceof NotOwnerError) return rejected(error.message);
        throw error;
    }
    return canSaveContent() ? null : rejected(READ_ONLY_MESSAGE);
};

/**
 * Saves a whole section: checks the owner session, validates against the schema, refuses anything naming the stealth
 * company, writes it (recording the previous version), then expires the section's cache tag so the next page load
 * shows it. Invalid data changes nothing.
 *
 * `version` is the version the editor loaded (null if the section was never saved). If the section has been saved
 * since, the save is refused rather than overwrite the newer content.
 */
export const saveSectionContent = async (
    key: string,
    data: unknown,
    version: string | null,
): Promise<SectionSaveResult> => {
    const refused = await refuseChange();
    if (refused) return refused;
    if (!isSectionKey(key)) return rejected(`Unknown section "${key}"`);

    const parsed = sectionSchemas[key].safeParse(data);
    if (!parsed.success) {
        return rejected(
            "Some fields need fixing. Nothing was saved.",
            parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        );
    }
    const mentions = stealthMentions(parsed.data);
    if (mentions.length) {
        return rejected(
            STEALTH_MESSAGE,
            mentions.map((path) => ({ path, message: "Mentions the company in stealth" })),
        );
    }
    let saved: string;
    try {
        saved = await (await getRepository()).save(key, parsed.data, version);
    } catch (error) {
        if (error instanceof StaleVersionError) return rejected(STALE_MESSAGE);
        throw error;
    }
    updateTag(contentTag(key));
    return { ok: true, version: saved };
};

/** Makes an earlier revision current again (recorded as a new save), if it still passes the same checks as a save. */
export const restoreRevisionContent = async (key: string, revisionId: number): Promise<SaveResult> => {
    const refused = await refuseChange();
    if (refused) return refused;
    if (!isSectionKey(key)) return rejected(`Unknown section "${key}"`);
    const repo = await getRepository();
    const revision = await repo.getRevision(revisionId);
    if (!revision || revision.key !== key) return rejected("That revision doesn't exist.");
    const parsed = sectionSchemas[key].safeParse(revision.data);
    if (!parsed.success) {
        return rejected("That revision doesn't fit the current content schema, so it can't be restored.");
    }
    if (stealthMentions(parsed.data).length) return rejected(STEALTH_MESSAGE);
    // Saved as parsed, like any save, so the restored content is trimmed and has no keys the schema has since dropped.
    await repo.save(key, parsed.data);
    updateTag(contentTag(key));
    return { ok: true };
};
