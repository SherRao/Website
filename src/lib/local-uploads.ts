import { canSaveContent, contentSource } from "@/content/repository";
import type { UploadMode } from "./admin-contract";
import { isUploadKind, startsLikePdf, uploadPathname, uploadProblem, UPLOADS } from "./upload-rules";

/**
 * Uploads kept in memory, for running the admin panel without Vercel Blob: only when CONTENT_SOURCE=fixtures and no
 * BLOB_READ_WRITE_TOKEN is set (local development and the Playwright tests). Served from /uploads/<path>. Never on
 * Vercel, where other instances wouldn't have the file.
 */
type Stored = { type: string; bytes: Uint8Array };

const store = globalThis as typeof globalThis & { __localUploads?: Map<string, Stored> };
const files = () => (store.__localUploads ??= new Map());

export const blobConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/**
 * Uploads go to Vercel Blob only where a save can publish them. Where saving is off, an uploaded file could never be
 * used, so it would sit in Blob unreferenced.
 */
export const blobUploadsEnabled = () => blobConfigured() && canSaveContent();

export const localUploadsEnabled = () => !blobConfigured() && contentSource() === "fixtures" && canSaveContent();

/** How the editor uploads files on this deployment. */
export const uploadMode = (): UploadMode => (blobUploadsEnabled() ? "blob" : localUploadsEnabled() ? "local" : "off");

export const putLocal = (pathname: string, type: string, bytes: Uint8Array) => {
    files().set(pathname, { type, bytes });
    return `/uploads/${pathname}`;
};

export const getLocal = (pathname: string) => files().get(pathname);

/**
 * Takes an upload sent as a form with a `kind` and a `file`, checks it like Blob would (type and size) and, for a
 * resume, that it really is a PDF, then keeps it. Answers its URL, or why it wasn't kept.
 */
export const acceptLocalUpload = async (form: FormData): Promise<{ url: string } | { error: string }> => {
    const kind = form.get("kind");
    const file = form.get("file");
    if (!isUploadKind(kind) || !(file instanceof File)) return { error: "Send a kind and a file." };
    const problem = uploadProblem(kind, file);
    if (problem) return { error: problem };
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (kind === "resume" && !startsLikePdf(bytes)) return { error: UPLOADS.resume.wrongType };
    return { url: putLocal(uploadPathname(kind, file.type), file.type, bytes) };
};
