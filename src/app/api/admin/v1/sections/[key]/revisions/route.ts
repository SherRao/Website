import { getRepository } from "@/content/repository";
import { json, signedSection } from "@/lib/admin-api";
import type { RevisionsPage } from "@/lib/admin-contract";

/** Revisions per page when the admin doesn't say, as on the in-site history page, and the most it can ask for. */
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/** A whole number from `min` to `max` from a query value, or `fallback` if it isn't one. */
const whole = (param: string | null, fallback: number, min: number, max: number) => {
    const n = param === null || param === "" ? NaN : Math.floor(Number(param));
    return Number.isNaN(n) ? fallback : Math.min(Math.max(min, n), max);
};

/**
 * GET /api/admin/v1/sections/:key/revisions?limit&offset: the current content and one page of earlier versions,
 * newest first. It reads one more than a page to tell whether there are older ones.
 */
export const GET = signedSection<{ key: string }>(async ({ request, key }) => {
    const { searchParams } = new URL(request.url);
    const limit = whole(searchParams.get("limit"), DEFAULT_LIMIT, 1, MAX_LIMIT);
    const offset = whole(searchParams.get("offset"), 0, 0, Number.MAX_SAFE_INTEGER - MAX_LIMIT);
    const repo = await getRepository();
    const [current, listed] = await Promise.all([repo.get(key), repo.listRevisions(key, { limit: limit + 1, offset })]);
    return json({
        current,
        revisions: listed
            .slice(0, limit)
            .map((r) => ({ id: r.id, createdAt: r.createdAt.toISOString(), data: r.data })),
        hasOlder: listed.length > limit,
    } satisfies RevisionsPage);
});
