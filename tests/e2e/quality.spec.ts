import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** The snap points: every .snap marker the layout renders, as a scroll position. */
const snapPoints = (page: Page) =>
    page.$$eval(".snap", (els) =>
        els
            .filter((el) => el.getClientRects().length)
            .map((el) => Math.round(el.getBoundingClientRect().top + scrollY)),
    );

/** Waits for the page to come to rest on `y` (within 2px), then checks it stays there. */
const expectRestingOn = async (page: Page, y: number) => {
    const at = () => page.evaluate(() => Math.round(scrollY));
    await expect.poll(async () => Math.abs((await at()) - y), { timeout: 4000 }).toBeLessThanOrEqual(2);
    await page.waitForTimeout(400);
    expect(Math.abs((await at()) - y)).toBeLessThanOrEqual(2);
};

test.describe("panel snapping", () => {
    let points: number[];
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await expect(page.locator(".loader")).toBeHidden({ timeout: 5000 });
        points = await snapPoints(page);
        expect(points).toHaveLength(7);
        await page.mouse.move(720, 450);
    });

    test("one wheel notch lands on the next panel", async ({ page }) => {
        await page.mouse.wheel(0, 100);
        await expectRestingOn(page, points[1]);
        await page.mouse.wheel(0, -100);
        await expectRestingOn(page, points[0]);
    });

    test("a hard spin or a long trackpad-style burst moves exactly one panel", async ({ page }) => {
        await page.mouse.wheel(0, 3000);
        await expectRestingOn(page, points[1]);
        // A trackpad fling is a steady stream of small deltas; sent from the page so test load can't split it.
        await page.evaluate(async () => {
            for (let i = 0; i < 60; i++) {
                window.dispatchEvent(
                    new WheelEvent("wheel", { deltaY: 60, clientX: 720, clientY: 450, cancelable: true }),
                );
                await new Promise((r) => setTimeout(r, 16));
            }
        });
        await expectRestingOn(page, points[2]);
    });

    test("a diagonal trackpad fling moves exactly one panel", async ({ page }) => {
        await page.evaluate(async () => {
            for (let i = 0; i < 40; i++) {
                window.dispatchEvent(
                    new WheelEvent("wheel", { deltaX: 120, deltaY: 100, clientX: 720, clientY: 450, cancelable: true }),
                );
                await new Promise((r) => setTimeout(r, 16));
            }
        });
        await expectRestingOn(page, points[1]);
    });

    test("Page Down lands on the next panel", async ({ page }) => {
        await page.keyboard.press("PageDown");
        await expectRestingOn(page, points[1]);
    });

    test("a scrollbar-style jump settles on the nearest panel", async ({ page }) => {
        const y = Math.round(points[3] + (points[4] - points[3]) * 0.3);
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
        await expectRestingOn(page, points[3]);
    });
});

test("page has exactly one h1", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
});

test("every image has alt text", async ({ page }) => {
    await page.goto("/");
    const missing = await page.$$eval("img", (imgs) =>
        imgs.filter((img) => !img.hasAttribute("alt")).map((img) => img.src),
    );
    expect(missing).toEqual([]);
    // Images that carry content (not decorative) need real text.
    const empty = await page.$$eval<string[], HTMLImageElement>(".mosaic img", (imgs) =>
        imgs.filter((img) => !img.alt.trim()).map((img) => img.src),
    );
    expect(empty).toEqual([]);
});

test("keyboard focus moves through the page in reading order and reaches the email link", async ({ page }) => {
    await page.goto("/");
    const handles = [];
    for (let i = 0; i < 80; i++) {
        await page.keyboard.press("Tab");
        const handle = await page.evaluateHandle(() => document.activeElement!);
        if (await handle.evaluate((el) => el === document.body)) break;
        handles.push(handle);
        if (await handle.evaluate((el) => el.classList.contains("door-mail"))) break;
    }
    expect(handles.length).toBeGreaterThan(5);
    expect(await handles.at(-1)!.evaluate((el) => el.classList.contains("door-mail"))).toBe(true);
    for (let i = 1; i < handles.length; i++) {
        const forward = await page.evaluate(
            ([a, b]) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING),
            [handles[i - 1], handles[i]],
        );
        expect(forward, `focus step ${i} went backwards`).toBe(true);
    }
    // Nothing focusable hides inside the decorative lit copy of the name.
    expect(await page.locator("[aria-hidden='true'] a, [aria-hidden='true'] button").count()).toBe(0);
});

test("layout shift stays under 0.1 while loading", async ({ page }) => {
    await page.goto("/");
    const cls = await page.evaluate(
        () =>
            new Promise<number>((resolve) => {
                let total = 0;
                new PerformanceObserver((list) => {
                    for (const entry of list.getEntries() as (PerformanceEntry & {
                        value: number;
                        hadRecentInput: boolean;
                    })[]) {
                        if (!entry.hadRecentInput) total += entry.value;
                    }
                }).observe({ type: "layout-shift", buffered: true });
                setTimeout(() => resolve(total), 2500);
            }),
    );
    expect(cls).toBeLessThan(0.1);
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`no console errors scrolling the whole page (${reducedMotion})`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion });
        const errors: string[] = [];
        page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
        page.on("pageerror", (err) => errors.push(err.message));
        await page.goto("/");
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y <= height; y += 450) {
            await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
            await page.waitForTimeout(150);
        }
        await page.waitForTimeout(500);
        expect(errors).toEqual([]);
    });
}

test.describe("accessibility", () => {
    // Reduced motion, so reveals and title lighting are in their final state when axe checks contrast.
    test.use({ reducedMotion: "reduce" });

    test("the home page has no axe violations", async ({ page }) => {
        await page.goto("/");
        await page.waitForTimeout(500);
        const { violations } = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
            .analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });

    test("the new artworks are labelled images", async ({ page }) => {
        await page.goto("/#engineer");
        for (const label of [/^Kabo scoring/, /^Two listeners/, /^This page in miniature/]) {
            const art = page.getByRole("img", { name: label });
            await expect(art).toBeVisible();
            await expect(art.locator("svg, .kabo").first()).toHaveAttribute("aria-hidden", "true");
        }
    });
});
