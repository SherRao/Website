import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.fn();
vi.mock("@/auth", () => ({ auth: () => auth() }));

const { proxy } = await import("@/proxy");

describe("the /admin proxy", () => {
    beforeEach(() => auth.mockReset().mockResolvedValue(null));

    it("sends a signed-out page load to sign-in", async () => {
        const res = await proxy(new NextRequest("http://localhost/admin/products?x=1"));
        expect(res?.status).toBe(307);
        const location = new URL(res!.headers.get("location")!);
        expect(location.pathname).toBe("/api/auth/signin");
        expect(location.searchParams.get("callbackUrl")).toBe("/admin/products?x=1");
    });

    it("lets a signed-in page load through", async () => {
        auth.mockResolvedValue({ user: { githubId: "4242" } });
        expect(await proxy(new NextRequest("http://localhost/admin"))).toBeUndefined();
    });

    it("lets server actions and uploads through to their own owner checks", async () => {
        for (const url of ["http://localhost/admin/products", "http://localhost/admin/upload"]) {
            expect(await proxy(new NextRequest(url, { method: "POST" })), url).toBeUndefined();
        }
        expect(auth).not.toHaveBeenCalled();
    });
});
