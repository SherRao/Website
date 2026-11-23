/**
 * The content API contract between a site and the admin app (openspec/changes/extract-content-admin). The admin app
 * keeps a byte-for-byte copy of this file, so it imports nothing but Node's crypto: no site types, no site config.
 * Both copies are pinned by the same known-answer signature test, so a drift fails a test on either side.
 *
 * Breaking changes get a new `/vN/` path prefix and a new CONTRACT_VERSION.
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/** The contract version a site reports in its manifest. An admin marks a site with any other version unavailable. */
export const CONTRACT_VERSION = 1;

// Layout: how a site's sections are edited. Plain data, so it travels as JSON.

/**
 * One field in a section's editor. Keys and nesting follow the site's content schema; the site decides what's valid,
 * the layout only decides how it's edited. `Upload` is the set of upload kind names the site declares.
 */
export type LayoutField<Upload extends string = string> =
    | {
          kind: "text";
          key: string;
          label: string;
          optional?: boolean;
          multiline?: boolean;
          hint?: string;
          type?: "url" | "email";
      }
    /** An id that's filled in from another field (the name) if left blank. */
    | { kind: "slug"; key: string; label: string; from: string; hint?: string }
    | { kind: "number"; key: string; label: string; step?: number; optional?: boolean; hint?: string }
    | { kind: "checkbox"; key: string; label: string; optional?: boolean; hint?: string }
    | { kind: "select"; key: string; label: string; options: { value: number | string; label: string }[] }
    | { kind: "group"; key: string; label: string; fields: LayoutField<Upload>[] }
    | {
          kind: "list";
          key: string;
          label: string;
          item: string;
          fields: LayoutField<Upload>[];
          summary: string;
          empty: Empty;
      }
    | { kind: "strings"; key: string; label: string; item: string }
    | { kind: "placeholder"; key: string; label: string; extra?: LayoutField<Upload>[] }
    /** A file upload whose URL is stored. `upload` names one of the manifest's upload kinds. */
    | { kind: "upload"; key: string; label: string; upload: Upload; hint?: string }
    /**
     * One of several shapes, told apart by a `kind` value: pick one and edit its fields. Only the chosen shape's
     * fields are saved. If optional, "none" leaves the field out.
     */
    | {
          kind: "variant";
          key: string;
          label: string;
          optional?: { label: string };
          hint?: string;
          options: { value: string; label: string; fields: LayoutField<Upload>[]; empty: Empty }[];
      };

/** What a new list item, or a newly chosen variant, starts as. The editor copies it before use. */
export type Empty = Record<string, unknown>;

/** A section's title and description, and the fields its editor shows. */
export type SectionLayout<Upload extends string = string> = {
    title: string;
    description: string;
    fields: LayoutField<Upload>[];
};

/**
 * What an upload kind accepts and where its files go. The editor checks a file against this and names it
 * `<prefix>/<uuid>.<extension for its type>`; the site checks the name again before storing anything.
 */
export type UploadRules = {
    types: string[];
    accept: string;
    maxBytes: number;
    prefix: string;
    extensions: Record<string, string>;
    wrongType: string;
};

// Wire: what the endpoints under /api/admin/v1/ take and answer.

export type FieldError = { path: string; message: string };
/** Every refusal, from a failed check to a stale save, has this shape. */
export type Rejection = { ok: false; message: string; fieldErrors: FieldError[] };
export type SaveResult = { ok: true } | Rejection;
/** A save also returns the section's new version, which the editor's next save is based on. */
export type SectionSaveResult = { ok: true; version: string } | Rejection;

/** How the editor uploads: straight to Blob with a token from the site, through the site itself, or not at all. */
export type UploadMode = "blob" | "local" | "off";

/** A list the admin can build from loaded sections, like every object marked `assumed: true`. */
export type Flag = { key: string; title: string; description: string };

/** GET /manifest */
export type Manifest = {
    contract: number;
    project: { name: string; origin: string };
    sections: ({ key: string } & SectionLayout)[];
    uploads: Record<string, UploadRules>;
    flags: Flag[];
    saving: { enabled: true } | { enabled: false; reason: string };
    uploadMode: UploadMode;
};

/**
 * GET /sections/:key. Read from the store, not a cache. Data that fails the schema is still returned, with its
 * problems; a section never saved is `missing`, with no version.
 */
export type SectionRead =
    | { data: unknown; issues: FieldError[]; missing: false; version: string }
    | { data: null; issues: []; missing: true; version: null };

/** PUT /sections/:key. `version` is the one the editor loaded (null if the section was missing). */
export type SectionSave = { data: unknown; version: string | null };

/** One earlier version of a section: the content a save replaced. */
export type RevisionEntry = { id: number; createdAt: string; data: unknown };

/** GET /sections/:key/revisions?limit&offset, newest first. `hasOlder` says whether there's another page. */
export type RevisionsPage = { current: unknown; revisions: RevisionEntry[]; hasOlder: boolean };

// Signing: every request carries an HMAC-SHA256 over what it asks for, made with a secret the site holds.

export const TIMESTAMP_HEADER = "x-admin-timestamp";
export const SIGNATURE_HEADER = "x-admin-signature";

/** How far a request's timestamp may be from the site's clock, either way, in seconds. */
export const SIGNATURE_WINDOW = 300;

export type Body = string | Uint8Array;

type Signed = {
    method: string;
    /** The request's path and query exactly as sent, like `/api/admin/v1/sections/profile/revisions?limit=20`. */
    target: string;
    /** Unix seconds, as sent in TIMESTAMP_HEADER. */
    timestamp: number | string;
    body?: Body;
};

const sha256 = (body: Body) => createHash("sha256").update(body).digest("hex");

/** What gets signed: `METHOD \n PATH?QUERY \n TIMESTAMP \n hex(sha256(body))`. A missing body hashes as empty. */
export const signingString = ({ method, target, timestamp, body = "" }: Signed) =>
    `${method.toUpperCase()}\n${target}\n${timestamp}\n${sha256(body)}`;

const hmac = (secret: string, message: string) => createHmac("sha256", secret).update(message).digest("hex");

/** The path and query of a URL, as the site sees it. */
export const requestTarget = (url: string | URL) => {
    const u = new URL(url);
    return `${u.pathname}${u.search}`;
};

const nowSeconds = () => Math.floor(Date.now() / 1000);

/** The headers that sign a request to `url`. */
export const sign = ({
    secret,
    method,
    url,
    body,
    now = nowSeconds(),
}: {
    secret: string;
    method: string;
    url: string | URL;
    body?: Body;
    now?: number;
}): Record<string, string> => ({
    [TIMESTAMP_HEADER]: String(now),
    [SIGNATURE_HEADER]: hmac(secret, signingString({ method, target: requestTarget(url), timestamp: now, body })),
});

/** The secrets in a comma-separated list, like ADMIN_API_SECRETS. Several are accepted at once while rotating. */
export const parseSecrets = (list: string | undefined) =>
    (list ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

/**
 * Whether a request was signed with one of `secrets`, for exactly this method, path, query and body, within
 * SIGNATURE_WINDOW of `now`. Signatures are compared in constant time.
 */
export const verify = ({
    secrets,
    method,
    url,
    body,
    timestamp,
    signature,
    now = nowSeconds(),
}: {
    secrets: string[];
    method: string;
    url: string | URL;
    body?: Body;
    timestamp: string | null;
    signature: string | null;
    now?: number;
}): boolean => {
    if (!secrets.length || !timestamp || !signature) return false;
    if (!/^\d{1,12}$/.test(timestamp) || !/^[0-9a-f]{64}$/.test(signature)) return false;
    if (Math.abs(now - Number(timestamp)) > SIGNATURE_WINDOW) return false;
    const message = signingString({ method, target: requestTarget(url), timestamp, body });
    const given = Buffer.from(signature, "hex");
    // Every secret is checked, so the time taken doesn't say which one matched.
    return secrets.reduce(
        (ok, secret) => timingSafeEqual(Buffer.from(hmac(secret, message), "hex"), given) || ok,
        false,
    );
};
