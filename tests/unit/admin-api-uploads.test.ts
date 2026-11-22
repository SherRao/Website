import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as uploadLocal } from "@/app/api/admin/v1/uploads/route";
import { POST as uploadToken } from "@/app/api/admin/v1/uploads/token/route";
import { GET as serveUpload } from "@/app/uploads/[...path]/route";
import { createFixturesRepository, READ_ONLY_MESSAGE, setRepository } from "@/content/repository";
import { uploadPathname } from "@/lib/upload-rules";
import { call, ORIGIN, TEST_SECRET } from "./admin-api-client";

/** A Blob read-write token in the real format, for a store that doesn't exist. Tokens are made locally from it. */
const BLOB_TOKEN = "vercel_blob_rw_teststore_notarealsecret";

/** What the browser's `upload()` sends to the admin, which forwards it unchanged. */
const tokenRequest = (pathname: string, kind: string | null) => ({
    type: "blob.generate-client-token",
    payload: { pathname, clientPayload: kind, multipart: false },
});

const askForToken = (body: unknown, opts: Parameters<typeof call>[2] = {}) =>
    call(uploadToken, "/uploads/token", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        ...opts,
    });

/** What a client token allows, as Blob reads it: the token ends with base64 of `<signature>.<base64 payload>`. */
const allowed = (clientToken: string) => {
    const encoded = clientToken.split("_")[4];
    const payload = Buffer.from(encoded, "base64").toString().split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64").toString()) as Record<string, unknown>;
};

/** A multipart form as raw bytes, the way the admin forwards it, with its content type. */
const multipart = async (fields: Record<string, string | File>) => {
    const form = new FormData();
    for (const [name, value] of Object.entries(fields)) form.set(name, value);
    const encoded = new Request(ORIGIN, { method: "POST", body: form });
    return {
        body: new Uint8Array(await encoded.arrayBuffer()),
        headers: { "Content-Type": encoded.headers.get("Content-Type")! },
    };
};

const sendFile = async (fields: Record<string, string | File>, opts: Parameters<typeof call>[2] = {}) =>
    call(uploadLocal, "/uploads", { method: "POST", ...(await multipart(fields)), ...opts });

beforeEach(() => {
    vi.stubEnv("ADMIN_API_SECRETS", TEST_SECRET);
    vi.stubEnv("CONTENT_SOURCE", "fixtures");
    vi.stubEnv("VERCEL", "");
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
    setRepository(createFixturesRepository());
});
afterEach(() => {
    vi.unstubAllEnvs();
    setRepository(undefined);
});

describe("the upload routes' signature check", () => {
    it.each(["none", "expired", "future", { secret: "someone-else" }] as const)(
        "refuses a token request signed %o with a bare 401",
        async (signature) => {
            vi.stubEnv("BLOB_READ_WRITE_TOKEN", BLOB_TOKEN);
            const res = await askForToken(tokenRequest(uploadPathname("photo", "image/webp"), "photo"), { signature });
            expect(res.status).toBe(401);
            expect(await res.json()).toEqual({ ok: false, message: "Unauthorized", fieldErrors: [] });
        },
    );

    it.each(["none", "expired", "future", { secret: "someone-else" }] as const)(
        "refuses a file signed %o with a bare 401",
        async (signature) => {
            const res = await sendFile(
                { kind: "photo", file: new File(["gif"], "a.gif", { type: "image/gif" }) },
                { signature },
            );
            expect(res.status).toBe(401);
        },
    );

    it("refuses a file swapped after signing", async () => {
        const signed = await multipart({
            kind: "resume",
            file: new File(["%PDF-1.7"], "a.pdf", { type: "application/pdf" }),
        });
        const res = await sendFile(
            { kind: "resume", file: new File(["%PDF-1.7 evil"], "a.pdf", { type: "application/pdf" }) },
            { signedBody: signed.body },
        );
        expect(res.status).toBe(401);
    });
});

describe("POST /uploads/token", () => {
    beforeEach(() => vi.stubEnv("BLOB_READ_WRITE_TOKEN", BLOB_TOKEN));

    it("authorizes a photo for one path, the photo types and the size limit, with no renaming or overwriting", async () => {
        const pathname = uploadPathname("photo", "image/webp");
        const res = await askForToken(tokenRequest(pathname, "photo"));
        expect(res.status).toBe(200);
        const reply = await res.json();
        expect(reply).toEqual({
            type: "blob.generate-client-token",
            clientToken: expect.stringMatching(/^vercel_blob_client_teststore_/),
        });
        const token = allowed(reply.clientToken);
        expect(token).toMatchObject({
            pathname,
            allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
            maximumSizeInBytes: 10 * 1024 * 1024,
            addRandomSuffix: false,
            allowOverwrite: false,
        });
        // Short-lived: Blob's default of an hour at most.
        expect(token.validUntil as number).toBeLessThanOrEqual(Date.now() + 60 * 60 * 1000 + 1000);
    });

    it("authorizes a resume only as a PDF", async () => {
        const res = await askForToken(tokenRequest(uploadPathname("resume", "application/pdf"), "resume"));
        expect(allowed((await res.json()).clientToken).allowedContentTypes).toEqual(["application/pdf"]);
    });

    it.each([
        ["an HTML file as a photo", "photos/0b5c8d3e-6f1a-4a7b-9c2d-1e3f5a7b9c0d.html", "photo"],
        [
            "a photo under the resume prefix",
            uploadPathname("photo", "image/png").replace("photos/", "resume/"),
            "photo",
        ],
        ["a guessable name", "resume/1729800000000.pdf", "resume"],
        ["a path outside the prefix", "photos/../index.html", "photo"],
        ["an unknown kind", uploadPathname("photo", "image/png"), "avatar"],
        ["no kind", uploadPathname("photo", "image/png"), null],
    ])("refuses %s with 400 and no token", async (_, pathname, kind) => {
        const res = await askForToken(tokenRequest(pathname, kind));
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body).toMatchObject({ ok: false, message: "Unexpected upload" });
        expect(body).not.toHaveProperty("clientToken");
    });

    it("only issues tokens: other Blob events are refused", async () => {
        const res = await askForToken({ type: "blob.upload-completed", payload: { blob: {}, tokenPayload: "photo" } });
        expect(res.status).toBe(400);
        expect((await askForToken("not an upload")).status).toBe(400);
    });

    it("refuses with 503 on a deployment that can't save", async () => {
        vi.stubEnv("VERCEL", "1");
        const res = await askForToken(tokenRequest(uploadPathname("photo", "image/webp"), "photo"));
        expect(res.status).toBe(503);
        expect(await res.json()).toMatchObject({ message: READ_ONLY_MESSAGE });
    });

    it("refuses with 503 where there's no Blob store", async () => {
        vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
        const res = await askForToken(tokenRequest(uploadPathname("photo", "image/webp"), "photo"));
        expect(res.status).toBe(503);
        expect((await res.json()).message).toMatch(/POST \/uploads/);
    });
});

describe("POST /uploads (local fixture mode)", () => {
    it("keeps a photo and answers a URL the site then serves", async () => {
        const res = await sendFile({ kind: "photo", file: new File(["GIF89a"], "a.gif", { type: "image/gif" }) });
        expect(res.status).toBe(200);
        const { url } = (await res.json()) as { url: string };
        expect(url).toMatch(/^\/uploads\/photos\/[0-9a-f-]{36}\.gif$/);

        const served = await serveUpload(new Request(new URL(url, ORIGIN)), {
            params: Promise.resolve({ path: url.replace("/uploads/", "").split("/") }),
        });
        expect(served.status).toBe(200);
        expect(served.headers.get("Content-Type")).toBe("image/gif");
        expect(await served.text()).toBe("GIF89a");
    });

    it("keeps a real PDF as the resume", async () => {
        const res = await sendFile({
            kind: "resume",
            file: new File(["%PDF-1.7"], "cv.pdf", { type: "application/pdf" }),
        });
        expect(res.status).toBe(200);
        expect((await res.json()).url).toMatch(/^\/uploads\/resume\/[0-9a-f-]{36}\.pdf$/);
    });

    it.each([
        [
            "a file that only claims to be a PDF",
            { kind: "resume", file: new File(["<html>"], "cv.pdf", { type: "application/pdf" }) },
            /PDF/,
        ],
        [
            "an HTML file as a photo",
            { kind: "photo", file: new File(["<html>"], "a.html", { type: "text/html" }) },
            /JPEG/,
        ],
        ["an empty file", { kind: "photo", file: new File([], "a.png", { type: "image/png" }) }, /empty/],
        ["an unknown kind", { kind: "avatar", file: new File(["x"], "a.png", { type: "image/png" }) }, /kind/],
        ["no file", { kind: "photo" }, /file/],
    ] as const)("refuses %s with 400", async (_, fields, message) => {
        const res = await sendFile(fields as Record<string, string | File>);
        expect(res.status).toBe(400);
        expect((await res.json()).message).toMatch(message);
    });

    it("refuses a body that isn't a multipart form with 400", async () => {
        const res = await call(uploadLocal, "/uploads", {
            method: "POST",
            body: "{}",
            headers: { "Content-Type": "application/json" },
        });
        expect(res.status).toBe(400);
    });

    it("refuses with 503 on a deployment that can't save", async () => {
        vi.stubEnv("VERCEL", "1");
        const res = await sendFile({ kind: "photo", file: new File(["GIF89a"], "a.gif", { type: "image/gif" }) });
        expect(res.status).toBe(503);
        expect(await res.json()).toMatchObject({ message: READ_ONLY_MESSAGE });
    });

    it("refuses with 503 where uploads go to Blob instead", async () => {
        vi.stubEnv("BLOB_READ_WRITE_TOKEN", BLOB_TOKEN);
        const res = await sendFile({ kind: "photo", file: new File(["GIF89a"], "a.gif", { type: "image/gif" }) });
        expect(res.status).toBe(503);
        expect((await res.json()).message).toMatch(/uploads\/token/);
    });
});
