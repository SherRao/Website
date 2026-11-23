import { canSaveContent, READ_ONLY_MESSAGE } from "@/content/repository";
import { json, refuse, signed } from "@/lib/admin-api";
import { acceptLocalUpload, blobConfigured, localUploadsEnabled } from "@/lib/local-uploads";

/**
 * POST /api/admin/v1/uploads: in local fixture mode (no Blob store), the admin app forwards a multipart form with a
 * `kind` and a `file`, signed over its raw bytes. The file is checked like Blob would check it, a resume must really
 * be a PDF, and it's kept in memory and served from `/uploads/<path>`. Answers `{ url }`. 503 anywhere else.
 */
export const POST = signed(async ({ request, body }) => {
    if (!canSaveContent()) return refuse(503, READ_ONLY_MESSAGE);
    if (!localUploadsEnabled()) {
        return refuse(
            503,
            blobConfigured()
                ? "This deployment stores uploads in Vercel Blob. Ask POST /uploads/token for an upload token."
                : "File storage isn't configured (set BLOB_READ_WRITE_TOKEN).",
        );
    }
    let form: FormData;
    try {
        // The body was read to check its signature, so the form is parsed from those same bytes.
        const type = request.headers.get("Content-Type") ?? "";
        form = await new Response(body, { headers: { "Content-Type": type } }).formData();
    } catch {
        return refuse(400, "Send a multipart form with a kind and a file.");
    }
    const result = await acceptLocalUpload(form);
    return "error" in result ? refuse(400, result.error) : json(result);
});
