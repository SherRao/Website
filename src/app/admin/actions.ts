"use server";

import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { restoreRevisionContent, saveSectionContent } from "@/lib/content-admin";

/**
 * Saves one content section from its editor, based on the version it loaded. Returns field errors instead of saving
 * invalid content, and refuses a save based on a version that's no longer current.
 */
export const saveSection = async (key: string, data: unknown, version: string | null) =>
    saveSectionContent(key, data, version);

/** The Restore button on a revisions page. */
export const restoreRevision = async (key: string, revisionId: number) => {
    const result = await restoreRevisionContent(key, revisionId);
    redirect(
        `/admin/${key}/revisions?${result.ok ? `restored=${revisionId}` : `error=${encodeURIComponent(result.message)}`}`,
    );
};

export const signOutOwner = async () => {
    await signOut({ redirectTo: "/" });
};
