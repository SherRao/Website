import { expect, test } from "@playwright/test";

test("page has title, description and Open Graph tags with a share image", async ({ page, request }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Nausher Rao/);
    const meta = (sel: string) => page.locator(sel).getAttribute("content");
    expect(await meta('meta[name="description"]')).toMatch(/engineer at Mappedin/);
    expect(await meta('meta[property="og:title"]')).toMatch(/engineer, founder, stage manager/);
    expect(await meta('meta[property="og:description"]')).toBeTruthy();
    const image = await meta('meta[property="og:image"]');
    expect(image).toMatch(/^https:\/\/sherrao\.tech\/opengraph-image/);
    expect(await meta('meta[property="og:image:width"]')).toBe("1200");
    expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");

    // The image itself renders.
    const res = await request.get(new URL(image!).pathname + new URL(image!).search);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
});

test("the public site sends the basic security headers", async ({ request }) => {
    const {
        "x-content-type-options": sniff,
        "referrer-policy": referrer,
        "x-frame-options": frame,
    } = (await request.get("/")).headers();
    expect(sniff).toBe("nosniff");
    expect(referrer).toBe("strict-origin-when-cross-origin");
    expect(frame).toBe("DENY");
});

test("the public site has a content security policy that its own pages load under", async ({ page, request }) => {
    const blocked: string[] = [];
    page.on("console", (m) => m.text().includes("Content Security Policy") && blocked.push(m.text()));
    const res = await page.goto("/");
    const csp = res!.headers()["content-security-policy"];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".mosaic img").first()).toBeAttached();
    expect(blocked).toEqual([]);

    const admin = (await request.get("/admin", { maxRedirects: 0 })).headers()["content-security-policy"];
    expect(admin ?? "").not.toContain("default-src");
    const signIn = (await request.get("/api/auth/signin", { maxRedirects: 0 })).headers();
    expect(signIn["content-security-policy"] ?? "").not.toContain("default-src");
});

test("album art from Spotify loads under the content security policy", async ({ page }) => {
    await page.route("https://i.scdn.co/**", (r) =>
        r.fulfill({ contentType: "image/gif", body: Buffer.from("R0lGODlhAQABAAAAACw=", "base64") }),
    );
    await page.route("**/api/spotify/now-playing", (r) =>
        r.fulfill({
            json: {
                title: "t",
                artist: "a",
                album: "b",
                albumArt: "https://i.scdn.co/image/abc",
                url: "https://open.spotify.com/track/x",
                isPlaying: true,
            },
        }),
    );
    const blocked: string[] = [];
    page.on("console", (m) => m.text().includes("Content Security Policy") && blocked.push(m.text()));
    await page.goto("/#off");
    await expect(page.locator(".now-track img")).toBeAttached();
    await expect.poll(() => page.locator(".now-track img").evaluate((i: HTMLImageElement) => i.complete)).toBe(true);
    expect(blocked).toEqual([]);
});

test("robots.txt keeps crawlers out of the admin panel and API routes", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("Disallow: /admin");
    expect(text).toContain("Disallow: /api/");
});

test("the sitemap lists the home page, and robots.txt points to it", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("<loc>https://sherrao.tech</loc>");
    expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap: https://sherrao.tech/sitemap.xml");
});
