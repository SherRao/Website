import { revalidateTag } from "next/cache";
import { contentTag } from "@/content";
import { isSectionKey, type SectionKey } from "@/content/schema";
import {
    parseSecrets,
    SIGNATURE_HEADER,
    TIMESTAMP_HEADER,
    verify,
    type FieldError,
    type Rejection,
} from "./admin-contract";
import type { Refusal, RefusalReason } from "./content-admin";

/**
 * Shared by every route under /api/admin/v1: the content API the admin app calls (see src/lib/admin-contract.ts).
 * Only the admin's server calls it, never a browser, so it sends no CORS headers.
 */

/** A JSON answer that no cache keeps: every answer reflects the store at the time of the request. */
export const json = (body: unknown, status = 200) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** A refusal, in the shape the editor already shows (`{ ok: false, message, fieldErrors }`). */
export const refuse = (status: number, message: string, fieldErrors: FieldError[] = []) =>
    json({ ok: false, message, fieldErrors } satisfies Rejection, status);

/** What a signed request gives its handler: the body it was signed over, already read, and its route params. */
export type Signed<P> = { request: Request; body: Uint8Array; params: P };

type Context<P> = { params: Promise<P> };

/**
 * Wraps a route handler so it only runs for a request signed with one of ADMIN_API_SECRETS. The signature is checked
 * before anything else, and a request that fails gets a bare 401 that doesn't say why.
 */
export const signed =
    <P = Record<string, never>>(handler: (req: Signed<P>) => Promise<Response>) =>
    async (request: Request, context: Context<P>): Promise<Response> => {
        const body = new Uint8Array(await request.arrayBuffer());
        const ok = verify({
            secrets: parseSecrets(process.env.ADMIN_API_SECRETS),
            method: request.method,
            url: request.url,
            body,
            timestamp: request.headers.get(TIMESTAMP_HEADER),
            signature: request.headers.get(SIGNATURE_HEADER),
        });
        if (!ok) return refuse(401, "Unauthorized");
        return handler({ request, body, params: await context.params });
    };

/** Like `signed`, for routes under /sections/[key]: an unknown section gets a 404 before the handler runs. */
export const signedSection = <P extends { key: string }>(
    handler: (req: Signed<P> & { key: SectionKey }) => Promise<Response>,
) =>
    signed<P>(async (req) => {
        const { key } = req.params;
        if (!isSectionKey(key)) return refuse(404, `Unknown section "${key}"`);
        return handler({ ...req, key });
    });

/** The body as JSON, or undefined if it isn't JSON. */
export const parseJson = (body: Uint8Array): unknown => {
    try {
        return JSON.parse(new TextDecoder().decode(body));
    } catch {
        return undefined;
    }
};

const STATUS: Record<RefusalReason, number> = { "read-only": 503, "not-found": 404, invalid: 422, stale: 409 };

/**
 * Answers a save or restore of `key`. After a success it expires the section's cache tag at once, so the next page
 * load reads the new content: route handlers can't call updateTag, and `{ expire: 0 }` never serves the stale copy.
 */
export const answerChange = <T extends { ok: true }>(key: SectionKey, result: T | Refusal) => {
    if (!result.ok) return refuse(STATUS[result.reason], result.message, result.fieldErrors);
    revalidateTag(contentTag(key), { expire: 0 });
    return json(result);
};
