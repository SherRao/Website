import { expect, test } from "@playwright/test";

const panelTop = (id: string) =>
    `(() => { const s = document.getElementById("${id}"); s.style.position = "relative"; const y = s.getBoundingClientRect().top + scrollY; s.style.position = ""; return Math.round(y); })()`;

test.describe("large screen panels", () => {
    test("panels pin and the next one slides over", async ({ page }) => {
        await page.goto("/");
        const engineerTop = await page.evaluate<number>(panelTop("engineer"));
        await page.evaluate((y: number) => window.scrollTo({ top: y + 200, behavior: "instant" }), engineerTop);
        await page.waitForTimeout(400);
        // The engineer panel is pinned at the top while we're past its start.
        const box = await page.locator("#engineer").boundingBox();
        expect(Math.round(box!.y)).toBe(0);
        expect(Math.round(box!.height)).toBe(900);
        expect(await page.locator("#engineer").evaluate((el) => getComputedStyle(el).position)).toBe("sticky");
    });

    for (const size of [
        { width: 1440, height: 900 },
        { width: 1280, height: 720 },
    ]) {
        test(`every panel fits one screen at ${size.width}x${size.height}`, async ({ page }) => {
            await page.setViewportSize(size);
            await page.goto("/");
            const overflow = await page.$$eval(".panel-in", (els) =>
                els.map((el) => el.scrollHeight - el.clientHeight),
            );
            expect(
                overflow.every((o) => o <= 1),
                JSON.stringify(overflow),
            ).toBe(true);
            const hero = await page.$eval(".hero", (el) => el.scrollHeight - el.clientHeight);
            expect(hero).toBeLessThanOrEqual(1);
        });
    }

    test("cover shows name, headline, intro and all five glance items without scrolling", async ({ page }) => {
        await page.goto("/");
        for (const sel of ["h1", ".headline", ".intro"]) await expect(page.locator(sel)).toBeInViewport();
        await expect(page.locator(".glance > *")).toHaveCount(5);
        for (const item of await page.locator(".glance > *").all()) await expect(item).toBeInViewport({ ratio: 1 });
    });

    test("engineer panel features tab as a side project linking to github", async ({ page }) => {
        await page.goto("/");
        const tab = page.locator("#engineer .cell").filter({ hasText: "side project" });
        await expect(tab.locator(".title")).toContainText("tab, 2026");
        await expect(tab.locator("a")).toHaveAttribute("href", "https://github.com/SherRao/Tab");
        await expect(page.locator("#engineer .also-chips > :not(.label-s)")).toHaveCount(4);
    });

    test("stage mosaic shows captions on hover and keyboard focus", async ({ page }) => {
        await page.goto("/#stage");
        const tiles = page.locator(".mosaic .tile");
        expect(await tiles.count()).toBeGreaterThanOrEqual(8);
        const caption = tiles.nth(1).locator("figcaption");
        await tiles.nth(1).hover();
        await expect(caption).toHaveCSS("opacity", "1");
        await page.mouse.move(0, 0);
        await tiles.nth(2).focus();
        await expect(tiles.nth(2).locator("figcaption")).toHaveCSS("opacity", "1");
        await expect(page.locator(".shows-line a")).toHaveCount(4);
    });

    test("stealth company shows only as untitled, in stealth", async ({ page }) => {
        await page.goto("/");
        const stealth = page.locator("#founder .cell").filter({ hasText: "untitled" });
        await expect(stealth).toContainText("a new company, in stealth.");
        await expect(stealth.locator("a")).toHaveCount(0);
        await expect(page.locator(".glance > div")).toHaveText(/a new company\s*in stealth/);
    });

    test("off hours shows its five cards with placeholders and films", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("#off .card")).toHaveCount(5);
        await expect(page.locator("#off .needed")).toHaveCount(3);
        await expect(page.locator("#off .films li")).toHaveCount(4);
        await expect(page.locator('#off a.card[href="https://letterboxd.com/SherRao"]')).toHaveCount(1);
    });

    test("say hi links to email, socials and resume", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator(".door-mail")).toHaveAttribute("href", "mailto:nausher@sherrao.tech");
        await expect(page.locator(".door nav a")).toHaveText([
            "instagram",
            "github",
            "linkedin",
            "letterboxd",
            "resume",
        ]);
    });

    test("resume links open the pdf in a new tab", async ({ page, request }) => {
        await page.goto("/");
        for (const link of [
            page.locator(".nav a", { hasText: "resume" }),
            page.locator(".door nav a", { hasText: "resume" }),
        ]) {
            await expect(link).toHaveAttribute("target", "_blank");
            const href = await link.getAttribute("href");
            expect(href).toMatch(/\.pdf$/);
            expect((await request.get(href!)).ok()).toBe(true);
        }
    });
});

test.describe("phone", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("scrolls normally with no pinning, snapping or sideways scroll", async ({ page }) => {
        await page.goto("/");
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType)).toBe("none");
        expect(await page.locator("#engineer").evaluate((el) => getComputedStyle(el).position)).toBe("relative");
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
        await page.locator(".door-mail").scrollIntoViewIfNeeded();
        await expect(page.locator(".door-mail")).toBeInViewport();
    });
});
