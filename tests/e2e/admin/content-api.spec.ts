import { expect, test } from "@playwright/test";
import type { RevisionsPage, SectionRead } from "../../../src/lib/admin-contract";
import { callApi } from "./content-api";

type Profile = { headline: { lead: string; emphasis: string } };

test("a signed save of the headline through the content API shows on the next page load", async ({
    page,
    request,
    baseURL,
}) => {
    const api = (method: "GET" | "PUT" | "POST", path: string, opts?: { body?: unknown; secret?: string | null }) =>
        callApi(request, baseURL!, method, path, opts);

    expect((await api("GET", "/sections/profile", { secret: null })).status()).toBe(401);
    expect((await api("GET", "/sections/profile", { secret: "not-the-secret" })).status()).toBe(401);

    const read = await api("GET", "/sections/profile");
    expect(read.status()).toBe(200);
    const { data, version } = (await read.json()) as SectionRead & { data: Profile };
    const before = data.headline.lead;
    const lead = `a headline from the content api ${Date.now()},`;

    const saved = await api("PUT", "/sections/profile", {
        body: { data: { ...data, headline: { ...data.headline, lead } }, version },
    });
    expect(saved.status()).toBe(200);
    expect(await saved.json()).toEqual({ ok: true, version: expect.any(String) });

    await page.goto("/");
    await expect(page.locator(".headline")).toContainText(lead);

    // The same save again is based on a version that's no longer current.
    const stale = await api("PUT", "/sections/profile", { body: { data, version } });
    expect(stale.status()).toBe(409);

    // Restoring the version the save replaced brings the old headline back, on the next page load too.
    const history = (await (await api("GET", "/sections/profile/revisions?limit=1")).json()) as RevisionsPage;
    expect((history.revisions[0].data as Profile).headline.lead).toBe(before);
    const restored = await api("POST", `/sections/profile/revisions/${history.revisions[0].id}/restore`);
    expect(restored.status()).toBe(200);

    await page.goto("/");
    await expect(page.locator(".headline")).toContainText(before);
    await expect(page.locator(".headline")).not.toContainText(lead);
});
