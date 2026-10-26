import { updateTag } from "next/cache";
import { contentTag } from "@/content";
import { canSaveContent, getRepository, READ_ONLY_MESSAGE } from "@/content/repository";
import { isSectionKey, sectionSchemas, type Content, type SectionKey } from "@/content/schema";
import { NotOwnerError } from "./owner";
import { requireOwner } from "./require-owner";

export type FieldError = { path: string; message: string };
export type SaveResult = { ok: true } | { ok: false; message: string; fieldErrors: FieldError[] };

const rejected = (message: string, fieldErrors: FieldError[] = []): SaveResult => ({ ok: false, message, fieldErrors });

/**
 * Another section as stored, or null if it's missing or fails its schema. A broken section can't be checked against,
 * and it's checked against this one again when it's fixed and saved.
 */
const readValid = async <K extends SectionKey>(key: K): Promise<Content[K] | null> => {
    const parsed = sectionSchemas[key].safeParse(await (await getRepository()).get(key));
    return parsed.success ? (parsed.data as Content[K]) : null;
};

/** Checks that need more than one section: founder works must point at a product that exists. */
const crossCheck = async <K extends SectionKey>(key: K, data: Content[K]): Promise<FieldError[]> => {
    if (key === "panels") {
        const products = await readValid("products");
        const id = (data as Content["panels"]).founderWorks.seahorse.productId;
        if (products && !products.some((p) => p.id === id)) {
            return [{ path: "founderWorks.seahorse.productId", message: `No product has the id "${id}"` }];
        }
    }
    if (key === "products") {
        const panels = await readValid("panels");
        const id = panels?.founderWorks.seahorse.productId;
        if (id && !(data as Content["products"]).some((p) => p.id === id)) {
            return [
                {
                    path: "",
                    message: `Founder works show the product "${id}". Keep a product with that id, or pick another one under Panels first.`,
                },
            ];
        }
    }
    return [];
};

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
    const crossErrors = await crossCheck(key, parsed.data as Content[typeof key]);
    if (crossErrors.length) return rejected("Some fields need fixing. Nothing was saved.", crossErrors);

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
    const crossErrors = await crossCheck(key, parsed.data as Content[typeof key]);
    if (crossErrors.length) {
        return rejected(`That revision can't be restored. ${crossErrors.map((e) => e.message).join(" ")}`, crossErrors);
    }
    // Saved as parsed, like any save, so the restored content is trimmed and has no keys the schema has since dropped.
    await repo.save(key, parsed.data);
    updateTag(contentTag(key));
    return { ok: true };
};
