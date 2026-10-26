import { expect, test } from "@playwright/test";
import { signInAs } from "./session";

test("the admin shell lists every section, with sign-out", async ({ page, context, baseURL }) => {
    await signInAs(context, baseURL!);
    await page.goto("/admin");
    await expect(page.getByRole("heading", { level: 1, name: "Content" })).toBeVisible();
    const nav = page.getByRole("navigation", { name: "Admin" });
    for (const name of ["Profile", "Side projects", "Events", "Panels", "Jobs", "Assumed facts"]) {
        await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
    }
    const main = page.getByRole("main");
    for (const name of ["Profile", "Side projects", "Events", "Panels", "Jobs", "Assumed facts"]) {
        await expect(main.getByRole("heading", { level: 2, name })).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
});

test("a session for another GitHub account gets no editor", async ({ page, context, baseURL }) => {
    await signInAs(context, baseURL!, "999");
    await page.goto("/admin/profile");
    await expect(page).toHaveURL(/\/api\/auth\/signin/);
    await expect(page.locator("form.editor")).toHaveCount(0);
});

test("signing out ends the session", async ({ page, context, baseURL }) => {
    await signInAs(context, baseURL!);
    await page.goto("/admin");
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(baseURL + "/");
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/api\/auth\/signin/);
});
