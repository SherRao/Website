import { expect, test } from "@playwright/test";

test("signed out, /admin redirects to sign-in", async ({ request, page }) => {
    for (const path of ["/admin", "/admin/products"]) {
        const res = await request.get(path, { maxRedirects: 0 });
        expect(res.status(), path).toBeGreaterThanOrEqual(300);
        expect(res.status(), path).toBeLessThan(400);
        const location = new URL(res.headers().location!, "http://localhost");
        expect(location.pathname).toBe("/api/auth/signin");
        expect(location.searchParams.get("callbackUrl")).toBe(path);
    }
    await page.goto("/admin");
    await expect(page.getByRole("button", { name: /sign in with github/i })).toBeVisible();
});

test("the public page and resume links don't go through sign-in", async ({ request }) => {
    expect((await request.get("/", { maxRedirects: 0 })).status()).toBe(200);
    expect((await request.get("/resume", { maxRedirects: 0 })).status()).toBe(307);
});
