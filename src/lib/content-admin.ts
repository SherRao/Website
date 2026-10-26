import { updateTag } from "next/cache";
import { contentTag } from "@/content";
import { canSaveContent, getRepository, READ_ONLY_MESSAGE } from "@/content/repository";
import { isSectionKey, sectionSchemas } from "@/content/schema";
import { NotOwnerError } from "./owner";
import { requireOwner } from "./require-owner";

export type FieldError = { path: string; message: string };
export type SaveResult = { ok: true } | { ok: false; message: string; fieldErrors: FieldError[] };

const rejected = (message: string, fieldErrors: FieldError[] = []): SaveResult => ({ ok: false, message, fieldErrors });

/** Why a change can't be made at all (no owner session, or a store that wouldn't keep it), or null if it can. */
const refuseChange = async (): Promise<SaveResult | null> => {
    try {
        await requireOwner();
    } catch (error) {
        if (error instanceof NotOwnerError) return rejected(error.message);
        throw error;
    }
    return canSaveContent() ? null : rejected(READ_ONLY_MESSAGE);
};

/**
 * Saves a whole section: checks the owner session, validates against the schema, writes it (recording the previous
 * version), then expires the section's cache tag so the next page load shows it. Invalid data changes nothing.
 */
export const saveSectionContent = async (key: string, data: unknown): Promise<SaveResult> => {
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
    await (await getRepository()).save(key, parsed.data);
    updateTag(contentTag(key));
    return { ok: true };
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
    // Saved as parsed, like any save, so the restored content is trimmed and has no keys the schema has since dropped.
    await repo.save(key, parsed.data);
    updateTag(contentTag(key));
    return { ok: true };
};
