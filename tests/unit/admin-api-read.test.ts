import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET as manifest } from "@/app/api/admin/v1/manifest/route";
import { GET as revisions } from "@/app/api/admin/v1/sections/[key]/revisions/route";
import { GET as section } from "@/app/api/admin/v1/sections/[key]/route";
import { editorLayout, FLAGS, UPLOAD_KINDS } from "@/content/editor-layout";
import {
    createFixturesRepository,
    READ_ONLY_MESSAGE,
    setRepository,
    type ContentRepository,
} from "@/content/repository";
import { sectionKeys } from "@/content/schema";
import { fixtures } from "@/content/seed";
import type { Manifest, RevisionsPage, SectionRead } from "@/lib/admin-contract";
import { call, spyOn, TEST_SECRET, untouched } from "./admin-api-client";

/** Every read route, with a request it would answer. Groups that add routes add them to their own tests. */
const routes = [
    { name: "GET /manifest", handler: manifest, path: "/manifest" },
    { name: "GET /sections/:key", handler: section, path: "/sections/profile", params: { key: "profile" } },
    {
        name: "GET /sections/:key/revisions",
        handler: revisions,
        path: "/sections/profile/revisions",
        params: { key: "profile" },
    },
];

let repo: ReturnType<typeof spyOn>;
const use = (store: ContentRepository) => {
    repo = spyOn(store);
    setRepository(repo);
};

beforeEach(() => {
    vi.stubEnv("ADMIN_API_SECRETS", `old-secret,${TEST_SECRET}`);
    vi.stubEnv("CONTENT_SOURCE", "fixtures");
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
    vi.stubEnv("VERCEL", "");
    use(createFixturesRepository());
});
afterEach(() => {
    vi.unstubAllEnvs();
    setRepository(undefined);
});

describe("the content API's signature check", () => {
    describe.each(routes)("$name", ({ handler, path, params }) => {
        it.each(["none", "expired", "future", { secret: "someone-else" }] as const)(
            "refuses a request signed %o with a bare 401, without touching the store",
            async (signature) => {
                const res = await call(handler, path, { params, signature });
                expect(res.status).toBe(401);
                expect(await res.json()).toEqual({ ok: false, message: "Unauthorized", fieldErrors: [] });
                expect(untouched(repo)).toBe(true);
            },
        );

        it("refuses every request when no secret is configured", async () => {
            vi.stubEnv("ADMIN_API_SECRETS", "");
            expect((await call(handler, path, { params })).status).toBe(401);
            expect(untouched(repo)).toBe(true);
        });

        it("answers a signed request, with either secret while rotating", async () => {
            expect((await call(handler, path, { params })).status).toBe(200);
            expect((await call(handler, path, { params, signature: { secret: "old-secret" } })).status).toBe(200);
        });

        it("isn't cached", async () => {
            expect((await call(handler, path, { params })).headers.get("Cache-Control")).toBe("no-store");
        });
    });

    it("checks the signature before the section key", async () => {
        const res = await call(section, "/sections/secrets", { params: { key: "secrets" }, signature: "none" });
        expect(res.status).toBe(401);
    });
});

describe("GET /manifest", () => {
    it("describes every section, the upload kinds and flags, in fixtures mode", async () => {
        const res = await call(manifest, "/manifest");
        const body = (await res.json()) as Manifest;
        const layout = editorLayout();
        expect(body).toEqual({
            contract: 1,
            project: { name: fixtures.profile.site.title, origin: "https://sherrao.tech" },
            sections: sectionKeys.map((key) => ({ key, ...layout[key] })),
            uploads: UPLOAD_KINDS,
            flags: FLAGS,
            saving: { enabled: true },
            uploadMode: "local",
        });
        expect(body.flags.map((f) => f.key)).toEqual(["assumed"]);
    });

    it("says saving is off, and why, on a Vercel deployment reading fixtures", async () => {
        vi.stubEnv("VERCEL", "1");
        const body = (await (await call(manifest, "/manifest")).json()) as Manifest;
        expect(body.saving).toEqual({ enabled: false, reason: READ_ONLY_MESSAGE });
        expect(body.uploadMode).toBe("off");
    });

    it("says uploads go to Blob where Blob is configured and saving is on", async () => {
        vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_test");
        expect(((await (await call(manifest, "/manifest")).json()) as Manifest).uploadMode).toBe("blob");
    });

    it("still opens if the profile can't be read", async () => {
        const { profile: _, ...rest } = fixtures;
        use(createFixturesRepository(rest as typeof fixtures));
        const res = await call(manifest, "/manifest");
        expect(res.status).toBe(200);
        expect(((await res.json()) as Manifest).project.origin).toBe("http://localhost:3000");
    });
});

describe("GET /sections/:key", () => {
    it("returns a valid section from the store, with its version", async () => {
        const res = await call(section, "/sections/events", { params: { key: "events" } });
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            data: fixtures.events,
            issues: [],
            missing: false,
            version: "0",
        } satisfies SectionRead);
    });

    it("returns a section that fails its schema as stored, with each problem", async () => {
        const broken = { ...fixtures.events, events: [{ ...fixtures.events.events[0], name: "" }] };
        await repo.save("events", broken);
        const body = (await (
            await call(section, "/sections/events", { params: { key: "events" } })
        ).json()) as SectionRead;
        expect(body.data).toEqual(broken);
        expect(body.issues.map((i) => i.path)).toContain("events.0.name");
        expect(body).toMatchObject({ missing: false, version: "1" });
    });

    it("reports a section that was never saved as missing", async () => {
        const { products: _, ...rest } = fixtures;
        use(createFixturesRepository(rest as typeof fixtures));
        const res = await call(section, "/sections/products", { params: { key: "products" } });
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ data: null, issues: [], missing: true, version: null });
    });

    it("answers an unknown section with 404, without touching the store", async () => {
        const res = await call(section, "/sections/secrets", { params: { key: "secrets" } });
        expect(res.status).toBe(404);
        expect(await res.json()).toMatchObject({ ok: false, message: expect.stringMatching(/secrets/) });
        expect(untouched(repo)).toBe(true);
    });
});

describe("GET /sections/:key/revisions", () => {
    const page = async (query = "", key = "profile") =>
        (await (
            await call(revisions, `/sections/${key}/revisions${query}`, { params: { key } })
        ).json()) as RevisionsPage;

    it("is empty for a section that was never changed, with its current content", async () => {
        expect(await page()).toEqual({ current: fixtures.profile, revisions: [], hasOlder: false });
    });

    it("pages through earlier versions, newest first", async () => {
        for (let i = 1; i <= 5; i++) await repo.save("profile", { ...fixtures.profile, intro: `edit ${i}` });

        const first = await page("?limit=2");
        expect(first.current).toMatchObject({ intro: "edit 5" });
        expect(first.revisions.map((r) => (r.data as { intro: string }).intro)).toEqual(["edit 4", "edit 3"]);
        expect(first.hasOlder).toBe(true);
        expect(new Date(first.revisions[0].createdAt).toISOString()).toBe(first.revisions[0].createdAt);
        expect(repo.listRevisions).toHaveBeenLastCalledWith("profile", { limit: 3, offset: 0 });

        const last = await page("?limit=2&offset=4");
        expect(last.revisions.map((r) => (r.data as { intro: string }).intro)).toEqual([fixtures.profile.intro]);
        expect(last.hasOlder).toBe(false);

        expect((await page("?limit=2&offset=6")).revisions).toEqual([]);
    });

    it("uses a page of 20 for a missing or nonsense limit, and at most 100", async () => {
        await page("?limit=abc&offset=-3");
        expect(repo.listRevisions).toHaveBeenLastCalledWith("profile", { limit: 21, offset: 0 });
        await page("?limit=5000");
        expect(repo.listRevisions).toHaveBeenLastCalledWith("profile", { limit: 101, offset: 0 });
    });

    it("answers an unknown section with 404", async () => {
        const res = await call(revisions, "/sections/secrets/revisions", { params: { key: "secrets" } });
        expect(res.status).toBe(404);
        expect(untouched(repo)).toBe(true);
    });
});
