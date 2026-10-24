import { expect, test } from "@playwright/test";
import { fixtures } from "../../fixtures/content";
import { signInAs } from "./session";

/** Every object in the fixtures marked assumed, by the name it's listed under. */
const assumedInFixtures = () => {
    const names: string[] = [];
    const walk = (v: unknown) => {
        if (!v || typeof v !== "object") return;
        if (Array.isArray(v)) return v.forEach(walk);
        const o = v as Record<string, unknown>;
        if (o.assumed === true) names.push(String(o.name ?? o.title ?? o.org ?? o.label ?? o.value));
        Object.values(o).forEach(walk);
    };
    walk(fixtures);
    return names;
};

test("the assumed-only view lists every fixture fact marked assumed", async ({ page, context, baseURL }) => {
    await signInAs(context, baseURL!);
    await page.goto("/admin/assumed");
    const names = assumedInFixtures();
    expect(names).toEqual(
        expect.arrayContaining([
            "mappedin",
            "blue dot",
            "hawkhacks 2024",
            "collision yacht soirée",
            "spur community bbq festival",
        ]),
    );
    const items = page.locator(".assumed > li");
    await expect(items).toHaveCount(names.length);
    for (const name of names) await expect(items.filter({ hasText: name })).toHaveCount(1);

    // Each links to the field to clear.
    await items.filter({ hasText: "hawkhacks 2024" }).getByRole("link").click();
    await expect(page).toHaveURL(/\/admin\/events#f-events-1-assumed$/);
    await expect(page.locator("#f-events-1-assumed")).toBeChecked();
});
