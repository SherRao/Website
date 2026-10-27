import { expect, test } from "@playwright/test";
import { jobs as allJobs, products, writing } from "../../src/content";

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

    test("the panels come in order: day job, engineer, stage, founder, off hours", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator(".nav nav a")).toHaveText([
            "the day job",
            "the engineer",
            "the stage",
            "the founder",
            "off hours",
            "resume",
            "say hi",
        ]);
        const ids = await page.$$eval(".panel.chapter", (els) => els.map((el) => el.id));
        expect(ids).toEqual(["dayjob", "engineer", "stage", "founder", "off"]);
        await expect(page.locator(".chapter-head .label-s")).toHaveText(["i.", "ii.", "iii.", "iv.", "v."]);
    });

    test("day job lists shown jobs newest first, freelancing from 2011, shopify once with both stints", async ({
        page,
    }) => {
        await page.goto("/#dayjob");
        const jobs = page.locator("#dayjob .ledger > li");
        const shown = allJobs.filter((j) => j.show);
        await expect(jobs).toHaveCount(shown.length);
        await expect(jobs.first().locator(".org")).toHaveText("mappedin");
        const freelance = jobs.last();
        await expect(freelance.locator(".org")).toHaveText("freelance");
        await expect(freelance.locator(".when")).toHaveText("2011 to 2022");
        const shopify = jobs.filter({ hasText: "shopify" });
        await expect(shopify).toHaveCount(1);
        await expect(shopify.locator(".when > span")).toHaveText(["may to aug 2022", "jan to apr 2023"]);
        for (const hidden of allJobs.filter((j) => !j.show)) {
            await expect(page.locator("#dayjob")).not.toContainText(hidden.org);
        }
        await expect(jobs.filter({ hasText: "konfer" }).locator(".org a")).toHaveAttribute("href", "#founder");
        await expect(jobs.filter({ hasText: "konfer" }).locator(".when")).toHaveText("2024 to now");
    });

    test("day job reads as text: each job's org, role and dates, with decoration hidden", async ({ page }) => {
        await page.goto("/#dayjob");
        const items = await page.locator("#dayjob .ledger > li").all();
        for (const item of items) {
            for (const part of [".when", ".org", ".role", ".line"]) {
                expect((await item.locator(part).innerText()).trim(), part).not.toBe("");
            }
            await expect(item.locator(".leader")).toHaveAttribute("aria-hidden", "true");
            // Just the role and the line: no project names.
            await expect(item.locator(".role > *")).toHaveCount(2);
        }
    });

    test("engineer panel features side projects only, tab first, linking to github", async ({ page }) => {
        await page.goto("/");
        const works = page.locator("#engineer .cell");
        await expect(works.locator(".title")).toHaveText([
            "tab, 2026",
            "kabo, 2021",
            "muspace, 2021",
            "this website, 2026",
        ]);
        const tab = works.first();
        await expect(tab.locator(".role")).toHaveText("side project");
        await expect(tab.locator("a")).toHaveAttribute("href", "https://github.com/SherRao/Tab");
        const others = products.filter((p) => !["tab", "kabo", "muspace", "this website"].includes(p.name));
        await expect(page.locator("#engineer .also-chips:not(.also-wrote) > :not(.label-s)")).toHaveCount(
            others.length,
        );
        for (const work of [
            "blue dot",
            "shopify",
            "rfq dashboard",
            "seahorse",
            "investor platform",
            "spurhacks platform",
        ]) {
            await expect(page.locator("#engineer")).not.toContainText(work);
        }
    });

    test("engineer panel tags the hackathon win and lists the papers", async ({ page }) => {
        await page.goto("/");
        const homestock = page.locator("#engineer .also-chips a", { hasText: "homestock" });
        await expect(homestock.locator(".tag")).toHaveText("winner, openhacks 2020");
        const kabo = page.locator("#engineer .cell", { hasText: "kabo" });
        await expect(kabo.locator(".role")).toHaveText("hackathon project, hack the north 2020++");
        const papers = page.locator("#engineer .also-wrote > :not(.label-s)");
        await expect(papers).toHaveCount(writing.length);
        for (const [i, paper] of writing.entries()) {
            await expect(papers.nth(i)).toHaveAttribute("title", paper.title);
            await expect(papers.nth(i).locator(".sr-only")).toHaveText(`: ${paper.title}`);
            if (paper.url) {
                await expect(papers.nth(i)).toHaveAttribute("href", paper.url);
                // Label in name: the visible short title starts the accessible name.
                await expect(papers.nth(i)).toHaveAccessibleName(`${paper.short}: ${paper.title}`);
            }
        }
    });

    test("the 'built' glance item counts the side projects and links to the engineer panel", async ({ page }) => {
        await page.goto("/");
        const built = page.locator(".glance > *").filter({ hasText: "built" });
        const shown =
            (await page.locator("#engineer .cell").count()) +
            (await page.locator("#engineer .also-chips:not(.also-wrote) > :not(.label-s)").count());
        await expect(built.locator("b")).toHaveText(`${shown} side projects`);
        await expect(built).toHaveAttribute("href", "#engineer");
    });

    test("stage mosaic shows captions on hover and keyboard focus", async ({ page }) => {
        await page.goto("/#stage");
        // While the loader covers the page, Playwright retries the hover by scrolling the tile into view, which moves
        // the page off the panel; the snap rule then puts it back, out from under the pointer.
        await expect(page.locator(".loader")).toBeHidden({ timeout: 5000 });
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

    test("founder panel shows the organizations started, and the ones led as compact items", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("#founder .cell .title")).toHaveText([
            "konfer, 2024 to now",
            "spurhacks, 2025 to now",
            "hawkhacks, 2021 to 2025",
            "untitled, 2026",
        ]);
        const hawkhacks = page.locator("#founder .cell").filter({ hasText: "hawkhacks" });
        await expect(hawkhacks.locator(".role")).toHaveText("founder & president");
        await expect(page.locator("#founder .also-chips > :not(.label-s)")).toHaveText([
            /laurier computing society\s*president, 2020 to 2024/,
            /brainstorm academy\s*program coordinator, 2022 to 2023/,
        ]);
        await expect(page.locator("#founder")).not.toContainText("spur innovation center");
        await expect(page.locator("#founder")).not.toContainText("seahorse");
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

    test("clicking 'say hi' lands the last panel fully in place", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator(".loader")).toBeHidden({ timeout: 5000 });
        await page.locator(".nav a", { hasText: "say hi" }).click();
        await expect.poll(async () => Math.round((await page.locator("#hi").boundingBox())!.y)).toBe(0);
        await page.waitForTimeout(400);
        const box = (await page.locator("#hi").boundingBox())!;
        expect(Math.round(box.y)).toBe(0);
        expect(Math.round(box.height)).toBe(900);
    });

    test("following a nav link from the keyboard moves focus to its section", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator(".loader")).toBeHidden({ timeout: 5000 });
        const changed = page.evaluate(() => new Promise((r) => addEventListener("hashchange", r, { once: true })));
        await page.locator(".nav a", { hasText: "say hi" }).focus();
        await page.keyboard.press("Enter");
        await changed;
        await expect(page.locator("#hi")).toBeFocused();
        await page.keyboard.press("Tab");
        expect(await page.evaluate(() => !!document.activeElement?.closest("#hi"))).toBe(true);
    });

    test("a link to something inside a panel lands on that panel", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator(".loader")).toBeHidden({ timeout: 5000 });
        // No link targets the inside of a panel yet, so add one.
        await page.evaluate(() => {
            const inner = document.createElement("span");
            inner.id = "inner";
            document.querySelector("#founder .cell")!.append(inner);
            const link = document.createElement("a");
            link.href = "#inner";
            link.textContent = "inner";
            document.querySelector(".nav")!.append(link);
        });
        const founder = await page
            .locator("#founder")
            .evaluate((el) => (el.previousElementSibling as HTMLElement).getBoundingClientRect().top + scrollY);
        await page.locator(".nav a", { hasText: "inner" }).click();
        const y = () => page.evaluate(() => Math.round(scrollY));
        await expect.poll(async () => Math.abs((await y()) - founder), { timeout: 4000 }).toBeLessThanOrEqual(2);
        await page.waitForTimeout(400);
        expect(Math.abs((await y()) - founder)).toBeLessThanOrEqual(2);
    });

    test("after the window grows taller, 'say hi' still lands the last panel fully in place", async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 800 });
        await page.goto("/");
        await expect(page.locator(".loader")).toBeHidden({ timeout: 5000 });
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForTimeout(600);
        await page.locator(".nav a", { hasText: "say hi" }).click();
        await expect.poll(async () => Math.round((await page.locator("#hi").boundingBox())!.y)).toBe(0);
        await page.waitForTimeout(400);
        expect(Math.round((await page.locator("#hi").boundingBox())!.y)).toBe(0);
    });
});

test.describe("short desktop window", () => {
    test.use({ viewport: { width: 1440, height: 600 } });

    test("the wheel can rest partway through a panel", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator(".loader")).toBeHidden({ timeout: 5000 });
        await page.mouse.move(720, 300);
        await page.mouse.wheel(0, 300);
        const y = () => page.evaluate(() => Math.round(scrollY));
        // It glides there rather than jumping, then stays.
        await expect.poll(y).toBeGreaterThan(0);
        expect(await y()).toBeLessThan(290);
        await expect.poll(y, { timeout: 4000 }).toBeGreaterThanOrEqual(290);
        await page.waitForTimeout(600);
        expect(Math.abs((await y()) - 300)).toBeLessThanOrEqual(10);
    });

    test("snapping starts without a reload once the window is tall enough", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator(".loader")).toBeHidden({ timeout: 5000 });
        await page.setViewportSize({ width: 1440, height: 900 });
        const next = await page
            .locator(".snap")
            .nth(1)
            .evaluate((el) => el.getBoundingClientRect().top + scrollY);
        await page.mouse.move(720, 450);
        await page.mouse.wheel(0, 100);
        const y = () => page.evaluate(() => Math.round(scrollY));
        await expect.poll(async () => Math.abs((await y()) - next), { timeout: 4000 }).toBeLessThanOrEqual(2);
    });
});

test.describe("phone", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("a scroll stopped partway through a panel stays where it is", async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => window.scrollTo({ top: 1234, behavior: "instant" }));
        await page.waitForTimeout(800);
        expect(await page.evaluate(() => Math.round(scrollY))).toBe(1234);
    });

    test("scrolls normally with no pinning or sideways scroll", async ({ page }) => {
        await page.goto("/");
        expect(await page.locator("#engineer").evaluate((el) => getComputedStyle(el).position)).toBe("relative");
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
        await page.locator(".door-mail").scrollIntoViewIfNeeded();
        await expect(page.locator(".door-mail")).toBeInViewport();
    });

    test("cover fits one screen: full-width name, headline, intro and a one-column credits list", async ({ page }) => {
        await page.goto("/");
        for (const sel of ["h1", ".headline", ".intro"]) await expect(page.locator(sel)).toBeInViewport({ ratio: 1 });
        for (const item of await page.locator(".glance > *").all()) await expect(item).toBeInViewport({ ratio: 1 });
        const { name, rao, left } = await page.evaluate(() => {
            const [first, last] = [...document.querySelectorAll(".name--base > span")].map((s) =>
                s.getBoundingClientRect(),
            );
            const cols = new Set(
                [...document.querySelectorAll(".glance > *")].map((el) => el.getBoundingClientRect().left),
            );
            return { name: first.width, rao: last.right - first.right, left: cols.size };
        });
        // "nausher" fills the width inside the padding, and "rao" ends where it does.
        expect(name).toBeGreaterThan(390 - 2 * 20 - 16);
        expect(Math.abs(rao)).toBeLessThanOrEqual(2);
        expect(left).toBe(1);
    });

    test("nav name stays hidden over the cover and fades in once it scrolls away", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator(".nav > a")).toHaveCSS("opacity", "0");
        await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
        await expect(page.locator(".nav > a")).toHaveCSS("opacity", "1");
    });

    test("day job stacks each job with no sideways scroll", async ({ page }) => {
        await page.goto("/");
        const job = page.locator("#dayjob .ledger > li").first();
        await job.scrollIntoViewIfNeeded();
        await expect(job.locator(".leader")).toBeHidden();
        const { when, org, line } = await job.evaluate((el) => {
            const top = (sel: string) => el.querySelector(sel)!.getBoundingClientRect().top;
            return { when: top(".when"), org: top(".org"), line: top(".line") };
        });
        expect(when).toBeLessThan(org);
        expect(org).toBeLessThan(line);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    });

    for (const sel of ["#engineer .row", "#founder .row", ".mosaic"]) {
        test(`${sel} swipes sideways, with the next item peeking in already lit`, async ({ page }) => {
            await page.goto("/");
            const strip = page.locator(sel);
            await strip.scrollIntoViewIfNeeded();
            const { overflow, snap } = await strip.evaluate((el) => ({
                overflow: el.scrollWidth - el.clientWidth,
                snap: getComputedStyle(el).scrollSnapType,
            }));
            expect(overflow).toBeGreaterThan(100);
            expect(snap).toBe("x mandatory");
            // The first item that starts on screen but runs past its right edge is the one peeking in.
            const i = await strip.evaluate((el) =>
                [...el.querySelectorAll(".rv")].findIndex((rv) => {
                    const r = rv.getBoundingClientRect();
                    return r.left < innerWidth && r.right > innerWidth;
                }),
            );
            expect(i).toBeGreaterThanOrEqual(0);
            const peek = strip.locator(".rv").nth(i);
            await expect(peek).toHaveClass(/is-in/);
        });
    }
});
