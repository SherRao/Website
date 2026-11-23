import type { HandleUploadBody } from "@vercel/blob/client";
import { canSaveContent, READ_ONLY_MESSAGE } from "@/content/repository";
import { acceptLocalUpload, blobConfigured, localUploadsEnabled } from "@/lib/local-uploads";
import { NotOwnerError } from "@/lib/owner";
import { requireOwner } from "@/lib/require-owner";
import { authorizeBlobUpload } from "@/lib/upload-authorization";

const fail = (status: number, error: string) => Response.json({ error }, { status });

/**
 * Uploads for the admin panel. With Vercel Blob configured, this hands the browser a short-lived token to upload
 * straight to Blob (which allows files over the 4.5 MB function body limit); Blob enforces the type and size limits
 * set here (a save that publishes a resume checks it's really a PDF). Without Blob (local fixtures mode) it takes the file itself. Either way, only the owner gets through, and
 * only where saving is on: elsewhere nothing could publish the file.
 * Uploading doesn't change content: the returned URL goes into a field, and saving the section publishes it.
 */
export const POST = async (request: Request) => {
    try {
        await requireOwner();
    } catch (error) {
        if (error instanceof NotOwnerError) return fail(401, error.message);
        throw error;
    }
    if (!canSaveContent()) return fail(503, READ_ONLY_MESSAGE);

    if (blobConfigured()) {
        try {
            return Response.json(
                await authorizeBlobUpload((await request.json()) as HandleUploadBody, request, requireOwner),
            );
        } catch (error) {
            return fail(400, (error as Error).message);
        }
    }

    if (!localUploadsEnabled()) return fail(503, "File storage isn't configured (set BLOB_READ_WRITE_TOKEN).");

    const result = await acceptLocalUpload(await request.formData());
    return "error" in result ? fail(400, result.error) : Response.json(result);
};
