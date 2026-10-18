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
