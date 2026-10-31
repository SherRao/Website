import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { signInAs } from "./session";

const PAGES = [
    "/admin",
    "/admin/profile",
    "/admin/products",
    "/admin/events",
    "/admin/panels",
    "/admin/profile/revisions",
    "/admin/products/revisions",
    "/admin/events/revisions",
    "/admin/panels/revisions",
    "/admin/assumed",
];

const axe = (page: Page) =>
    new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]);

test.beforeEach(async ({ context, baseURL }) => signInAs(context, baseURL!));

for (const path of PAGES) {
    test(`${path} has no axe violations`, async ({ page }) => {
        await page.goto(path);
        await expect(page.getByRole("main")).not.toContainText("Loading…");
        const { violations } = await axe(page).analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
}

test("an editor showing errors has no axe violations", async ({ page }) => {
    await page.goto("/admin/events");
    await expect(page.locator("form.editor[data-hydrated]")).toBeVisible();
    await page.locator("#f-events-0-name").fill("");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Nothing was saved" })).toBeFocused();
    const { violations } = await axe(page).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
});

test("list items can be reordered from the keyboard, keeping focus on the moved item", async ({ page }) => {
    await page.goto("/admin/panels");
    await expect(page.locator("form.editor[data-hydrated]")).toBeVisible();
    const down = page.getByRole("button", { name: "Move down: resident evil" });
    await down.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Move down: resident evil" })).toBeFocused();
    await expect(page.getByRole("group", { name: /^2\. resident evil/ })).toBeVisible();
    await expect(page.locator("[aria-live='polite']")).toHaveText("Moved resident evil to position 2 of 4.");
});
