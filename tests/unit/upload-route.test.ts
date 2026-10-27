import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const requireOwner = vi.fn();
vi.mock("@/lib/require-owner", () => ({ requireOwner: () => requireOwner() }));
const handleUpload = vi.fn();
vi.mock("@vercel/blob/client", () => ({ handleUpload: (...args: unknown[]) => handleUpload(...args) }));

const { POST } = await import("@/app/admin/upload/route");
const { blobUploadsEnabled } = await import("@/lib/local-uploads");

const tokenRequest = () =>
    new Request("http://localhost/admin/upload", {
        method: "POST",
        body: JSON.stringify({ type: "blob.generate-client-token", payload: { pathname: "resume/1.pdf" } }),
    });

describe("Blob uploads where saving is off", () => {
    beforeEach(() => {
        requireOwner.mockResolvedValue({ user: { githubId: "4242" } });
        handleUpload.mockReset().mockResolvedValue({ type: "blob.generate-client-token", clientToken: "t" });
        vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_test");
        vi.stubEnv("CONTENT_SOURCE", "fixtures");
    });
    afterEach(() => vi.unstubAllEnvs());

    it("hands out an upload token where a save can publish the file", async () => {
        expect(blobUploadsEnabled()).toBe(true);
        expect((await POST(tokenRequest())).status).toBe(200);
        expect(handleUpload).toHaveBeenCalledOnce();
    });

    it("refuses a token, and the editor shows no Blob upload, on a deployment that can't save", async () => {
        vi.stubEnv("VERCEL", "1");
        expect(blobUploadsEnabled()).toBe(false);
        const res = await POST(tokenRequest());
        expect(res.status).toBe(503);
        expect((await res.json()).error).toMatch(/CONTENT_SOURCE=db/);
        expect(handleUpload).not.toHaveBeenCalled();
    });
});
