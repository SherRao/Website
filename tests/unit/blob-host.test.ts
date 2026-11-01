import { describe, expect, it } from "vitest";
import { blobStoreHost } from "@/lib/blob-host";

describe("blob store host", () => {
    it("comes from the store id in the token", () => {
        expect(blobStoreHost("vercel_blob_rw_AbC123_secretpart")).toBe("abc123.public.blob.vercel-storage.com");
    });

    it("is null without a token", () => {
        expect(blobStoreHost("")).toBeNull();
    });
});
