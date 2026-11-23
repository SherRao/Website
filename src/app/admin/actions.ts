"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { contentTag } from "@/content";
import type { SectionKey } from "@/content/schema";
import {
    restoreRevisionCore,
    saveSectionCore,
    type Rejection,
    type SaveResult,
    type SectionSaveResult,
} from "@/lib/content-admin";
import { NotOwnerError } from "@/lib/owner";
import { requireOwner } from "@/lib/require-owner";

/** A refusal if there's no owner session, or null if there is. Every action checks this itself. */
const ownerRefusal = async (): Promise<Rejection | null> => {
    try {
        await requireOwner();
    } catch (error) {
        if (error instanceof NotOwnerError) return { ok: false, message: error.message, fieldErrors: [] };
        throw error;
    }
    return null;
};

/**
 * Saves one content section from its editor, based on the version it loaded. Returns field errors instead of saving
 * invalid content, and refuses a save based on a version that's no longer current. A save expires the section's
 * cache tag, so the next page load shows it.
 */
export const saveSection = async (key: string, data: unknown, version: string | null): Promise<SectionSaveResult> => {
    const refused = await ownerRefusal();
    if (refused) return refused;
    const result = await saveSectionCore(key, data, version);
    if (result.ok) updateTag(contentTag(key as SectionKey));
    return result;
};

/** Restores a revision for the owner, expiring the section's cache tag if it worked. */
const restore = async (key: string, revisionId: number): Promise<SaveResult> => {
    const refused = await ownerRefusal();
    if (refused) return refused;
    const result = await restoreRevisionCore(key, revisionId);
    if (result.ok) updateTag(contentTag(key as SectionKey));
    return result;
};

/** The Restore button on a revisions page. */
export const restoreRevision = async (key: string, revisionId: number) => {
    const result = await restore(key, revisionId);
    redirect(
        `/admin/${key}/revisions?${result.ok ? `restored=${revisionId}` : `error=${encodeURIComponent(result.message)}`}`,
    );
};

export const signOutOwner = async () => {
    await signOut({ redirectTo: "/" });
};
