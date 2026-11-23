import type { HandleUploadBody } from "@vercel/blob/client";
import { canSaveContent, READ_ONLY_MESSAGE } from "@/content/repository";
import { json, parseJson, refuse, signed } from "@/lib/admin-api";
import { blobConfigured } from "@/lib/local-uploads";
import { authorizeBlobUpload } from "@/lib/upload-authorization";

const isTokenRequest = (body: unknown): body is HandleUploadBody =>
    typeof body === "object" &&
    body !== null &&
    "type" in body &&
    body.type === "blob.generate-client-token" &&
    "payload" in body &&
    typeof body.payload === "object" &&
    body.payload !== null;

/**
 * POST /api/admin/v1/uploads/token: the admin app forwards the browser's Vercel Blob client-upload request, and gets
 * back a short-lived token for this site's own Blob store, limited to one path, the kind's types and its size. The
 * browser then uploads straight to Blob, so the admin never holds this site's storage credentials. 503 where uploads
 * are off: saving is off (nothing could publish the file), or there's no Blob store.
 */
export const POST = signed(async ({ request, body }) => {
    if (!canSaveContent()) return refuse(503, READ_ONLY_MESSAGE);
    if (!blobConfigured()) {
        return refuse(503, "This deployment has no Blob store (BLOB_READ_WRITE_TOKEN). Upload with POST /uploads.");
    }
    const upload = parseJson(body);
    if (!isTokenRequest(upload)) return refuse(400, "Send a Blob client-token request (blob.generate-client-token).");
    try {
        return json(await authorizeBlobUpload(upload, request));
    } catch (error) {
        return refuse(400, (error as Error).message);
    }
});
