import { expect, test } from "@playwright/test";

test("wheel scrolling settles on a snap point", async ({ page }) => {
    await page.goto("/");
    const points = await page.$$eval(".snap", (els) => els.map((el) => Math.round(el.getBoundingClientRect().top + scrollY)));
    expect(points.length).toBeGreaterThanOrEqual(6);
    await page.mouse.move(720, 450);
    for (const delta of [300, 500, 300]) {
        await page.mouse.wheel(0, delta);
        await page.waitForTimeout(1200);
        const y = await page.evaluate(() => Math.round(scrollY));
        expect(points.some((p) => Math.abs(p - y) <= 2), `scrollY ${y} not in ${points}`).toBe(true);
    }
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
});

test("page has exactly one h1", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
});

test("every image has alt text", async ({ page }) => {
    await page.goto("/");
    const missing = await page.$$eval("img", (imgs) => imgs.filter((img) => !img.hasAttribute("alt")).map((img) => img.src));
    expect(missing).toEqual([]);
    // Images that carry content (not decorative) need real text.
    const empty = await page.$$eval<string[], HTMLImageElement>(".mosaic img", (imgs) => imgs.filter((img) => !img.alt.trim()).map((img) => img.src));
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
                    for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
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
