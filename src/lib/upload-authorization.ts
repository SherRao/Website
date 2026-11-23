import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isUploadKind, UPLOADS } from "./upload-rules";

/**
 * Answers a Vercel Blob client-upload request (`handleUpload`) for the site's own Blob store. A token is only issued
 * for a declared upload kind (sent as the client payload) at a path that kind's rule allows, which is how
 * uploadPathname names files. Blob then enforces the kind's types and size, and never overwrites or renames.
 *
 * `check` runs before a token is issued: the in-site upload route checks the owner session there. The content API has
 * already checked the request's signature.
 */
export const authorizeBlobUpload = (
    body: HandleUploadBody,
    request: Request,
    check: () => Promise<unknown> = async () => {},
) =>
    handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname, kind) => {
            await check();
            if (!isUploadKind(kind) || !UPLOADS[kind].pathname.test(pathname)) throw new Error("Unexpected upload");
            return {
                allowedContentTypes: [...UPLOADS[kind].types],
                maximumSizeInBytes: UPLOADS[kind].maxBytes,
                addRandomSuffix: false,
                allowOverwrite: false,
            };
        },
    });
