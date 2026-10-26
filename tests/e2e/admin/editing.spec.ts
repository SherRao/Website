import { expect, test, type Page } from "@playwright/test";
import { openEditor, signInAs } from "./session";

test.beforeEach(async ({ context, baseURL }) => signInAs(context, baseURL!));

const save = async (page: Page) => {
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Saved" })).toBeVisible();
};

test("adding a side project and reordering them shows on the home page after save", async ({ page }) => {
    const name = `e2e project ${Date.now()}`;
    await openEditor(page, "/admin/products");
    await page.getByRole("button", { name: "Add side project" }).click();
    const item = page.getByRole("group", { name: /^14\. / });
    await item.getByLabel("Name").fill(name);
    await expect(item.getByLabel("Name")).toBeFocused();
    await item.getByLabel("Description").fill("made by the end-to-end tests.");
    await item.getByLabel("Role").fill("tester");
    await item.getByLabel("Years").fill("2026");
    await item.getByLabel("Tag").fill("e2e tag");
    // Move it up past freegamenotifier and buddybot, then move julia above maerienette.
    await page.getByRole("button", { name: `Move up: ${name}` }).click();
    await page.getByRole("button", { name: `Move up: ${name}` }).click();
    await page.getByRole("button", { name: "Move up: julia" }).click();
    await save(page);

    await page.goto("/");
    await expect(page.locator("#engineer .also-chips:not(.also-wrote) > :not(.label-s)")).toHaveText([
        "sherbot",
        /^homestock/,
        /^chaterest/,
        "spacestagram",
        "localify",
        "julia",
        "maerienette",
        `${name}e2e tag`,
        "buddybot",
        "freegamenotifier",
    ]);
    // The id was made from the name.
    await openEditor(page, "/admin/products");
    await expect(page.getByRole("group", { name: new RegExp(`\\d+\\. ${name}`) }).getByLabel("Id")).toHaveValue(
        name.replace(/ /g, "-"),
    );
});

test("updating the headline shows on the next page load", async ({ page }) => {
    const lead = `a headline from the panel ${Date.now()},`;
    await openEditor(page, "/admin/profile");
    await page.getByRole("group", { name: "Headline" }).getByLabel("Lead").fill(lead);
    await save(page);
    await page.goto("/");
    await expect(page.locator(".headline")).toContainText(lead);
});

test("typing while a save is in progress keeps the new text and leaves it unsaved", async ({ page }) => {
    const stamp = Date.now();
    await openEditor(page, "/admin/profile");
    const lead = page.getByRole("group", { name: "Headline" }).getByLabel("Lead");
    await lead.fill(`saved ${stamp},`);
    // Hold the save's server action so there's time to type while it's in progress.
    let release!: () => void;
    const held = new Promise<void>((resolve) => (release = resolve));
    await page.route("**/admin/profile", async (route) => {
        if (route.request().method() !== "POST") return route.fallback();
        await held;
        await route.fallback();
    });
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByRole("button", { name: "Saving…" })).toBeVisible();
    await lead.fill(`typed while saving ${stamp},`);
    release();
    await expect(page.getByRole("status").filter({ hasText: "made changes while saving" })).toBeVisible();
    await expect(lead).toHaveValue(`typed while saving ${stamp},`);
    await page.unroute("**/admin/profile");
    await page.goto("/");
    await expect(page.locator(".headline")).toContainText(`saved ${stamp},`);
});

test("an event with no name is rejected, the field is flagged and the site is unchanged", async ({ page }) => {
    await openEditor(page, "/admin/events");
    const name = page.getByRole("group", { name: /^1\. spurhacks 2025/ }).getByLabel("Name");
    await name.fill("");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    const summary = page.getByRole("alert").filter({ hasText: "Nothing was saved" });
    await expect(summary).toBeFocused();
    await expect(summary).toContainText("Events › event 1 › Name");
    await expect(page.locator("#f-events-0-name")).toHaveAttribute("aria-invalid", "true");
    await summary.getByRole("link").first().click();
    await expect(page.locator("#f-events-0-name")).toBeFocused();
    await page.goto("/");
    await expect(page.locator(".shows-line a").first()).toContainText("spurhacks 2025");
});

test("filling in the band card replaces the 'content needed' marker", async ({ page }) => {
    await openEditor(page, "/admin/panels");
    const band = page.getByRole("group", { name: "Music I make (the band)" });
    await band.getByLabel("Content needed").uncheck();
    await band.getByLabel("Details").fill("we play covers on fridays.");
    await save(page);
    await page.goto("/");
    const card = page.locator("#off .card").filter({ hasText: "music i make" });
    await expect(card).toContainText("we play covers on fridays.");
    await expect(card.locator(".needed")).toHaveCount(0);
});

test("renaming the profile shows on the hero and in the footer", async ({ page }) => {
    const setName = async (name: string) => {
        await openEditor(page, "/admin/profile");
        await page.getByLabel("Name", { exact: true }).fill(name);
        await save(page);
    };
    await setName("ada lovelace");
    await page.goto("/");
    await expect(page.locator("h1.name > span")).toHaveText(["ada", "lovelace"]);
    await expect(page.locator(".door .fine")).toHaveText("designed and built by ada lovelace.");
    await setName("nausher rao");
});

test("switching a founder work's art from photo to counter saves only the counter", async ({ page }) => {
    await openEditor(page, "/admin/panels");
    const konfer = page.getByRole("group", { name: /^1\. konfer/ });
    const art = konfer.getByRole("group", { name: "Art" });
    await expect(art.getByLabel("Photo alt text")).toHaveValue(/SPUR x Konfer/);
    await art.getByLabel("Shows").selectOption("counter");
    await expect(art.getByLabel("Photo alt text")).toHaveCount(0);
    await art.getByLabel("Number", { exact: true }).fill("57");
    await art.getByLabel("Read aloud as").fill("57 people on the team");
    await save(page);

    await page.goto("/");
    const founder = page.locator("#founder");
    await expect(founder.getByRole("img", { name: "57 people on the team" })).toHaveCount(1);
    await expect(founder.locator("img[alt*='SPUR x Konfer']")).toHaveCount(0);

    // Switching back starts an empty photo: the old photo wasn't kept in the save.
    await openEditor(page, "/admin/panels");
    const again = page.getByRole("group", { name: /^1\. konfer/ }).getByRole("group", { name: "Art" });
    await again.getByLabel("Shows").selectOption("photo");
    await expect(again.getByLabel("Photo alt text")).toHaveValue("");
});

test("adding a second stint to a job shows both on the home page", async ({ page }) => {
    await openEditor(page, "/admin/jobs");
    const job = page.getByRole("group", { name: /^7\. magnet forensics/ });
    await job.getByRole("button", { name: "Add stint" }).click();
    const stint = job.getByRole("group", { name: /^2\. / });
    await stint.getByLabel("Role").fill("software engineer");
    await stint.getByLabel("Started").fill("2022-01");
    await stint.getByLabel("Ended").fill("2022-04");
    await save(page);

    await page.goto("/#dayjob");
    const row = page.locator("#dayjob .ledger > li").filter({ hasText: "magnet forensics" });
    await expect(row.locator(".when > span")).toHaveText(["sep to dec 2021", "jan to apr 2022"]);
});

test("a stint that ends before it starts is rejected and the date is flagged", async ({ page }) => {
    await openEditor(page, "/admin/jobs");
    const job = page.getByRole("group", { name: /^4\. webisoft/ });
    await job.getByLabel("Ended").fill("2024-01");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    const summary = page.getByRole("alert").filter({ hasText: "Nothing was saved" });
    await expect(summary).toContainText("Ends before it starts");
    await expect(page.locator("#f-jobs-3-stints-0-end")).toHaveAttribute("aria-invalid", "true");
    await page.goto("/#dayjob");
    await expect(page.locator("#dayjob .ledger > li").filter({ hasText: "webisoft" }).locator(".when")).toHaveText(
        "2024",
    );
});

test("restoring the previous revision brings back the earlier headline and keeps the undone one", async ({ page }) => {
    const stamp = Date.now();
    const [a, b] = [`version a ${stamp},`, `version b ${stamp},`];
    const lead = page.getByRole("group", { name: "Headline" }).getByLabel("Lead");
    await openEditor(page, "/admin/profile");
    await lead.fill(a);
    await save(page);
    await lead.fill(b);
    await save(page);
    await page.goto("/");
    await expect(page.locator(".headline")).toContainText(b);

    await page.goto("/admin/profile/revisions");
    const latest = page.locator(".revisions > li").first();
    await expect(latest).toContainText(`headline.lead: “${a}”`);
    await latest.getByRole("button", { name: /Restore/ }).click();
    await expect(page.getByRole("status").filter({ hasText: "Restored" })).toBeVisible();
    await expect(page.locator(".revisions > li").first()).toContainText(`headline.lead: “${b}”`);

    await page.goto("/");
    await expect(page.locator(".headline")).toContainText(a);
});

test("history shows a page of versions at a time", async ({ page }) => {
    await openEditor(page, "/admin/events");
    const place = page.getByRole("group", { name: /^1\. / }).getByLabel("Place");
    for (let i = 0; i < 21; i++) {
        await place.fill(`place ${i}`);
        await save(page);
    }
    await page.goto("/admin/events/revisions");
    await expect(page.locator(".revisions > li")).toHaveCount(20);
    await page.getByRole("link", { name: "Older versions" }).click();
    await expect(page).toHaveURL(/\?page=2$/);
    await expect(page.locator(".revisions > li").first()).toBeVisible();
    await page.getByRole("link", { name: "Newer versions" }).click();
    await expect(page.locator(".revisions > li")).toHaveCount(20);
});
