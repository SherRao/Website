import { answerChange, refuse, signedSection } from "@/lib/admin-api";
import { restoreRevisionCore } from "@/lib/content-admin";

/**
 * POST /api/admin/v1/sections/:key/revisions/:id/restore: makes an earlier version of the section current again,
 * recorded as a new save. 404 if there's no such revision of this section, 422 if it no longer passes the schema (or
 * the resume check), 503 where saving is off. A success is live on the next page load.
 */
export const POST = signedSection<{ key: string; id: string }>(async ({ key, params }) => {
    const id = /^\d{1,15}$/.test(params.id) ? Number(params.id) : NaN;
    if (!Number.isSafeInteger(id)) return refuse(404, "That revision doesn't exist.");
    return answerChange(key, await restoreRevisionCore(key, id));
});
