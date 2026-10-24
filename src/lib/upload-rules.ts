/** What each kind of upload accepts and where it's stored. Shared by the upload button and the upload route. */
export const UPLOADS = {
    resume: {
        types: ["application/pdf"],
        accept: "application/pdf,.pdf",
        maxBytes: 10 * 1024 * 1024,
        pathname: /^resume\/\d+\.pdf$/,
        wrongType: "The resume must be a PDF.",
    },
    photo: {
        types: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
        accept: "image/jpeg,image/png,image/webp,image/avif,image/gif",
        maxBytes: 10 * 1024 * 1024,
        pathname: /^photos\/[0-9a-f-]{36}\.(jpg|png|webp|avif|gif)$/,
        wrongType: "Photos must be JPEG, PNG, WebP, AVIF or GIF images.",
    },
} as const;

export type UploadKind = keyof typeof UPLOADS;

export const isUploadKind = (v: unknown): v is UploadKind => v === "resume" || v === "photo";

const EXTENSIONS: Record<string, string> = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/gif": "gif",
};

/** The storage path for a new upload: resume/<timestamp>.pdf or photos/<uuid>.<ext>. */
export const uploadPathname = (kind: UploadKind, type: string) =>
    kind === "resume" ? `resume/${Date.now()}.pdf` : `photos/${crypto.randomUUID()}.${EXTENSIONS[type]}`;

/** Why a file can't be uploaded as this kind, or null if it can. */
export const uploadProblem = (kind: UploadKind, file: { type: string; size: number }): string | null => {
    const rule = UPLOADS[kind];
    if (!(rule.types as readonly string[]).includes(file.type)) return rule.wrongType;
    if (file.size > rule.maxBytes) return `Files must be ${rule.maxBytes / 1024 / 1024} MB or smaller.`;
    if (file.size === 0) return "That file is empty.";
    return null;
};
