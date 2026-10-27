import { expect, test, type Page } from "@playwright/test";

/** Walks the whole page in small steps, like someone scrolling, so every reveal gets a chance to fire. */
const scrollThrough = async (page: Page) => {
    await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 150) {
            window.scrollTo({ top: y, behavior: "instant" });
            await new Promise((r) => setTimeout(r, 30));
        }
    });
    await page.waitForTimeout(2000);
};

/** Lit and dim names line up to within a pixel (sub-pixel rounding). The bug this guards against was ~21px. */
const expectAligned = (n: { base: number[][]; lit: number[][] }) => {
    expect(n.lit.length).toBe(n.base.length);
    n.base.forEach((line, i) =>
        line.forEach((v, j) => expect(Math.abs(n.lit[i][j] - v), `line ${i}, value ${j}`).toBeLessThanOrEqual(1)),
    );
};

/** Text-box positions of the dim and lit names, line by line. */
const nameLines = (page: Page) =>
    page.evaluate(() => {
        const lines = (sel: string) =>
            [...document.querySelectorAll(`${sel} > span`)].map((s) => {
                const r = document.createRange();
                r.selectNodeContents(s);
                const b = r.getBoundingClientRect();
                return [Math.round(b.left), Math.round(b.top), Math.round(b.width)];
            });
        return { base: lines(".name--base"), lit: lines(".name--lit") };
    });

test("spotlight: lit and dim names line up after load, a late font and a resize", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    let n = await nameLines(page);
    expectAligned(n);

    // Simulate a late font load: change the name's size, then fire the event a font load would.
    await page.evaluate(() => {
        document.querySelectorAll<HTMLElement>(".name").forEach((el) => (el.style.fontSize = "120px"));
        document.fonts.dispatchEvent(new Event("loadingdone"));
    });
    await page.waitForTimeout(100);
    n = await nameLines(page);
    expectAligned(n);

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(300);
    n = await nameLines(page);
    expectAligned(n);
});

test("spotlight follows the pointer and the light is on", async ({ page }) => {
    await page.goto("/");
    // the loader covers the page and takes the pointer until it lifts
    await expect(page.locator(".loader")).toBeHidden({ timeout: 5000 });
    await expect(page.locator(".hero")).toHaveClass(/is-lit/);
    await page.mouse.move(300, 300);
    await page.mouse.move(900, 400, { steps: 5 });
    await page.waitForTimeout(800);
    const sx = await page
        .locator(".name--lit")
        .evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue("--sx")));
    const litLeft = await page.locator(".name--lit").evaluate((el) => el.getBoundingClientRect().left);
    expect(Math.abs(sx + litLeft - 900)).toBeLessThan(15);
});

test("every work and photo is fully revealed after scrolling the page", async ({ page }) => {
    await page.goto("/");
    await scrollThrough(page);
    const total = await page.locator(".rv").count();
    expect(total).toBeGreaterThanOrEqual(16);
    await expect(page.locator(".rv.is-in")).toHaveCount(total);
    const hidden = await page.$$eval(".rv", (els) => els.filter((el) => getComputedStyle(el).filter !== "none").length);
    expect(hidden).toBe(0);
});

test("panel titles light up when their panel lands", async ({ page }) => {
    await page.goto("/#founder");
    await page.waitForTimeout(800);
    await expect(page.locator("#founder .chapter-head")).toHaveClass(/is-on/);
    await expect(page.locator("#engineer .chapter-head")).not.toHaveClass(/is-on/);
});

test("counters finish on their final values", async ({ page }) => {
    await page.goto("/");
    await scrollThrough(page);
    await expect(page.locator("[data-count]")).toHaveText(["96", "1,400+"]);
});

test("tab's two captions are never visible at the same time", async ({ page }) => {
    await page.goto("/#engineer");
    const samples = await page.evaluate(async () => {
        const pair = document.querySelector(".tabp-pair")!,
            tab = document.querySelector(".tabp-tab")!;
        const out: number[][] = [];
        for (let i = 0; i < 80; i++) {
            out.push([Number(getComputedStyle(pair).opacity), Number(getComputedStyle(tab).opacity)]);
            await new Promise((r) => setTimeout(r, 100));
        }
        return out;
    });
    expect(samples.some(([a]) => a > 0.9)).toBe(true);
    expect(samples.some(([, b]) => b > 0.9)).toBe(true);
    expect(samples.filter(([a, b]) => a > 0.15 && b > 0.15)).toEqual([]);
});

test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("nothing animates and every final value shows", async ({ page }) => {
        await page.goto("/");
        await page.waitForTimeout(500);
        expect(await page.evaluate(() => document.documentElement.classList.contains("motion"))).toBe(false);
        await expect(page.locator(".hero")).toHaveClass(/is-rm/);
        await expect(page.locator(".name--lit")).toBeHidden();
        expect(await page.locator(".name--base").evaluate((el) => getComputedStyle(el).color)).toBe(
            "rgb(255, 230, 196)",
        );
        await expect(page.locator("[data-count]")).toHaveText(["96", "1,400+"]);
        const running = await page.evaluate(
            () => document.getAnimations().filter((a) => a.playState === "running").length,
        );
        expect(running).toBe(0);
        const veiled = await page.$$eval(
            ".rv",
            (els) =>
                els.filter((el) => getComputedStyle(el).filter !== "none" || getComputedStyle(el).clipPath !== "none")
                    .length,
        );
        expect(veiled).toBe(0);
        await expect(page.locator(".chapter-head.is-on")).toHaveCount(5);
    });

    test("one wheel notch lands on the next panel straight away", async ({ page }) => {
        await page.goto("/");
        const next = await page
            .locator(".snap")
            .nth(1)
            .evaluate((el) => el.getBoundingClientRect().top + scrollY);
        await page.mouse.move(720, 450);
        // Record every frame's position from before the notch until 300ms after it.
        await page.evaluate(() => {
            const w = window as Window & { frames_?: number[] };
            w.frames_ = [];
            const t0 = performance.now();
            const tick = () => {
                w.frames_!.push(Math.round(scrollY));
                if (performance.now() - t0 < 2000) requestAnimationFrame(tick);
            };
            tick();
        });
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(300);
        const seen = await page.evaluate(() => [...new Set((window as Window & { frames_?: number[] }).frames_)]);
        expect(seen).toEqual([0, Math.round(next)]);
    });
});

test.describe("phone", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("a chapter title lights up when its heading scrolls into view", async ({ page }) => {
        await page.goto("/");
        const head = page.locator("#stage .chapter-head");
        await expect(head).not.toHaveClass(/is-on/);
        await head.scrollIntoViewIfNeeded();
        await expect(head).toHaveClass(/is-on/);
        await page.locator(".door-mail").scrollIntoViewIfNeeded();
        await expect(head).not.toHaveClass(/is-on/);
    });

    test("a sideways wheel over a strip scrolls the strip, not the page", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator(".loader")).toBeHidden({ timeout: 5000 });
        const strip = page.locator("#engineer .row");
        await strip.scrollIntoViewIfNeeded();
        const box = (await strip.boundingBox())!;
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        const y = await page.evaluate(() => scrollY);
        // A trackpad swipe is mostly sideways, with a little vertical drift.
        await page.mouse.wheel(400, 20);
        await expect.poll(() => strip.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
        await page.waitForTimeout(500);
        expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThanOrEqual(1);
    });

    test("strips drift on their own, stop when touched and pick up again after 7.5s", async ({ page }) => {
        test.setTimeout(45_000);
        await page.goto("/");
        const strip = page.locator(".mosaic");
        await strip.scrollIntoViewIfNeeded();
        const left = () => strip.evaluate((el) => el.scrollLeft);
        // The drift starts 2.5s after the strip comes into view; leave headroom for a loaded CI machine.
        await expect.poll(left, { timeout: 10_000 }).toBeGreaterThan(10);
        await expect(strip).toHaveClass(/is-drifting/);

        // The looping copy is decoration: hidden from screen readers and skipped by Tab.
        const copies = strip.locator("[data-copy]");
        expect(await copies.count()).toBe(await strip.locator(":scope > :not([data-copy])").count());
        expect(await copies.evaluateAll((els) => els.every((el) => el.getAttribute("aria-hidden") === "true"))).toBe(
            true,
        );
        expect(await copies.evaluateAll((els) => els.every((el) => el.tabIndex < 0))).toBe(true);

        // A press stops it where it is.
        await strip.dispatchEvent("pointerdown");
        await page.evaluate(() => window.dispatchEvent(new PointerEvent("pointerup")));
        const stopped = await left();
        await page.waitForTimeout(2000);
        expect(Math.abs((await left()) - stopped)).toBeLessThanOrEqual(1);
        // It picks up again 7.5s after the release, 2s of which have passed.
        await expect.poll(left, { timeout: 15_000, intervals: [500] }).toBeGreaterThan(stopped + 5);
    });
});

test.describe("phone, reduced motion", () => {
    test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });

    test("strips stay still and never get a looping copy", async ({ page }) => {
        await page.goto("/");
        await page.locator(".mosaic").scrollIntoViewIfNeeded();
        await page.waitForTimeout(4000);
        expect(await page.locator(".mosaic").evaluate((el) => el.scrollLeft)).toBe(0);
        await expect(page.locator("[data-copy]")).toHaveCount(0);
    });
});

test("loader covers the page, then lifts after 1.5s", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".loader")).toBeVisible();
    await expect(page.locator(".loader")).toBeHidden({ timeout: 5000 });
});

test.describe("reduced motion loader", () => {
    test.use({ reducedMotion: "reduce" });

    test("loader is skipped", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator(".loader")).toBeHidden();
    });
});
