import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { canSaveContent, READ_ONLY_MESSAGE } from "@/content/repository";
import { blobConfigured, localUploadsEnabled, putLocal } from "@/lib/local-uploads";
import { NotOwnerError } from "@/lib/owner";
import { requireOwner } from "@/lib/require-owner";
import { UPLOADS, isUploadKind, uploadPathname, uploadProblem } from "@/lib/upload-rules";

const fail = (status: number, error: string) => Response.json({ error }, { status });

/**
 * Uploads for the admin panel. With Vercel Blob configured, this hands the browser a short-lived token to upload
 * straight to Blob (which allows files over the 4.5 MB function body limit); Blob enforces the type and size limits
 * set here. Without Blob (local fixtures mode) it takes the file itself. Either way, only the owner gets through, and
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
            const body = (await request.json()) as HandleUploadBody;
            return Response.json(
                await handleUpload({
                    body,
                    request,
                    onBeforeGenerateToken: async (pathname, kind) => {
                        await requireOwner();
                        if (!isUploadKind(kind) || !UPLOADS[kind].pathname.test(pathname)) {
                            throw new Error("Unexpected upload");
                        }
                        return {
                            allowedContentTypes: [...UPLOADS[kind].types],
                            maximumSizeInBytes: UPLOADS[kind].maxBytes,
                            addRandomSuffix: false,
                            allowOverwrite: false,
                        };
                    },
                }),
            );
        } catch (error) {
            return fail(400, (error as Error).message);
        }
    }

    if (!localUploadsEnabled()) return fail(503, "File storage isn't configured (set BLOB_READ_WRITE_TOKEN).");

    const form = await request.formData();
    const kind = form.get("kind");
    const file = form.get("file");
    if (!isUploadKind(kind) || !(file instanceof File)) return fail(400, "Send a kind and a file.");
    const problem = uploadProblem(kind, file);
    if (problem) return fail(400, problem);
    const bytes = new Uint8Array(await file.arrayBuffer());
    // The browser's type is only a claim; a PDF has to start like one.
    if (kind === "resume" && new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-")
        return fail(400, UPLOADS.resume.wrongType);
    return Response.json({ url: putLocal(uploadPathname(kind, file.type), file.type, bytes) });
};
