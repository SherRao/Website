/**
 * Uploads kept in memory, for running the admin panel without Vercel Blob: only when CONTENT_SOURCE=fixtures and no
 * BLOB_READ_WRITE_TOKEN is set (local development and the Playwright tests). Served from /uploads/<path>. Never on
 * Vercel, where other instances wouldn't have the file.
 */
type Stored = { type: string; bytes: Uint8Array };

const store = globalThis as typeof globalThis & { __localUploads?: Map<string, Stored> };
const files = () => (store.__localUploads ??= new Map());

export const blobConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export const localUploadsEnabled = () =>
    !blobConfigured() && !process.env.VERCEL && (process.env.CONTENT_SOURCE || "fixtures") === "fixtures";

export const putLocal = (pathname: string, type: string, bytes: Uint8Array) => {
    files().set(pathname, { type, bytes });
    return `/uploads/${pathname}`;
};

export const getLocal = (pathname: string) => files().get(pathname);
