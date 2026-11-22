import { expect, test } from "@playwright/test";
import { sign, type RevisionsPage, type SectionRead } from "../../../src/lib/admin-contract";
import { callApi, TEST_API_ENV } from "./content-api";

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

test("a file uploaded through the signed content API is served by the site", async ({ request, baseURL }) => {
    const form = new FormData();
    form.set("kind", "resume");
    form.set("file", new File(["%PDF-1.7 from the content api"], "cv.pdf", { type: "application/pdf" }));
    // Signed over the exact bytes sent, as the admin app forwards a multipart body.
    const encoded = new Request(baseURL!, { method: "POST", body: form });
    const body = Buffer.from(await encoded.arrayBuffer());
    const url = new URL("/api/admin/v1/uploads", baseURL).href;

    const unsigned = await request.post(url, {
        headers: { "Content-Type": encoded.headers.get("Content-Type")! },
        data: body,
    });
    expect(unsigned.status()).toBe(401);

    const res = await request.post(url, {
        headers: {
            ...sign({ secret: TEST_API_ENV.ADMIN_API_SECRETS, method: "POST", url, body: new Uint8Array(body) }),
            "Content-Type": encoded.headers.get("Content-Type")!,
        },
        data: body,
    });
    expect(res.status()).toBe(200);
    const { url: uploaded } = (await res.json()) as { url: string };
    expect(uploaded).toMatch(/^\/uploads\/resume\/[0-9a-f-]{36}\.pdf$/);

    const served = await request.get(uploaded);
    expect(served.status()).toBe(200);
    expect(served.headers()["content-type"]).toBe("application/pdf");
    expect(await served.text()).toBe("%PDF-1.7 from the content api");
});
