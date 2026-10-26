import { expect, test, type Page } from "@playwright/test";
import { openEditor, signInAs } from "./session";

test.beforeEach(async ({ context, baseURL }) => signInAs(context, baseURL!));

const save = async (page: Page) => {
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Saved" })).toBeVisible();
};

test("adding a product and reordering products shows on the home page after save", async ({ page }) => {
    const name = `e2e product ${Date.now()}`;
    await openEditor(page, "/admin/products");
    await page.getByRole("button", { name: "Add product" }).click();
    const item = page.getByRole("group", { name: /^8\. / });
    await item.getByLabel("Name").fill(name);
    await expect(item.getByLabel("Name")).toBeFocused();
    await item.getByLabel("Description").fill("made by the end-to-end tests.");
    await item.getByLabel("Role").fill("tester");
    await item.getByLabel("Years").fill("2026");
    // Move it up past shopify and rfq dashboard, then move spur investor platform above spurhacks platform.
    await page.getByRole("button", { name: `Move up: ${name}` }).click();
    await page.getByRole("button", { name: `Move up: ${name}` }).click();
    await page.getByRole("button", { name: "Move up: spur investor platform" }).click();
    await save(page);

    await page.goto("/");
    await expect(page.locator("#engineer .also-chips > :not(.label-s)")).toHaveText([
        "spur investor platform",
        "spurhacks platform",
        "seahorse",
        name,
        "rfq dashboard",
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
