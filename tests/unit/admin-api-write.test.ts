import { revalidateTag, updateTag } from "next/cache";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as restore } from "@/app/api/admin/v1/sections/[key]/revisions/[id]/restore/route";
import { PUT as save } from "@/app/api/admin/v1/sections/[key]/route";
import {
    createFixturesRepository,
    READ_ONLY_MESSAGE,
    setRepository,
    type ContentRepository,
} from "@/content/repository";
import { fixtures } from "@/content/seed";
import { call, jsonBody, spyOn, TEST_SECRET, untouched } from "./admin-api-client";

type Profile = typeof fixtures.profile;

let repo: ReturnType<typeof spyOn>;
const use = (store: ContentRepository) => {
    repo = spyOn(store);
    setRepository(repo);
};

beforeEach(() => {
    vi.stubEnv("ADMIN_API_SECRETS", TEST_SECRET);
    vi.stubEnv("CONTENT_SOURCE", "fixtures");
    vi.stubEnv("VERCEL", "");
    use(createFixturesRepository());
});
afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    setRepository(undefined);
    vi.mocked(revalidateTag).mockClear();
    vi.mocked(updateTag).mockClear();
});

const put = (key: string, body: unknown, opts: Parameters<typeof call>[2] = {}) =>
    call(save, `/sections/${key}`, { method: "PUT", params: { key }, ...jsonBody(body), ...opts });

const restoreRevision = (key: string, id: number | string, opts: Parameters<typeof call>[2] = {}) =>
    call(restore, `/sections/${key}/revisions/${id}/restore`, {
        method: "POST",
        params: { key, id: String(id) },
        ...opts,
    });

const stored = async () => (await repo.get("profile")) as Profile;

/** Checks that nothing was invalidated, by either API. */
const nothingExpired = () => {
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
};

describe("the write routes' signature check", () => {
    const routes = [
        {
            name: "PUT /sections/:key",
            send: (opts = {}) => put("profile", { data: fixtures.profile, version: "0" }, opts),
        },
        { name: "POST /sections/:key/revisions/:id/restore", send: (opts = {}) => restoreRevision("profile", 1, opts) },
    ];

    describe.each(routes)("$name", ({ send }) => {
        it.each(["none", "expired", "future", { secret: "someone-else" }] as const)(
            "refuses a request signed %o with a bare 401, without touching the store",
            async (signature) => {
                const res = await send({ signature });
                expect(res.status).toBe(401);
                expect(await res.json()).toEqual({ ok: false, message: "Unauthorized", fieldErrors: [] });
                expect(untouched(repo)).toBe(true);
                nothingExpired();
            },
        );
    });

    it("refuses a save whose body was changed after signing, and keeps the stored content", async () => {
        const signed = JSON.stringify({ data: fixtures.profile, version: "0" });
        const res = await put(
            "profile",
            { data: { ...fixtures.profile, intro: "swapped in" }, version: "0" },
            { signedBody: signed },
        );
        expect(res.status).toBe(401);
        expect(untouched(repo)).toBe(true);
        expect(await stored()).toEqual(fixtures.profile);
        nothingExpired();
    });
});

describe("PUT /sections/:key", () => {
    it("saves a valid section, answers its new version and expires its cache tag at once", async () => {
        const res = await put("profile", { data: { ...fixtures.profile, intro: "from the api" }, version: "0" });
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ ok: true, version: "1" });
        expect((await stored()).intro).toBe("from the api");
        expect((await repo.listRevisions("profile"))[0].data).toEqual(fixtures.profile);
        expect(revalidateTag).toHaveBeenCalledExactlyOnceWith("content:profile", { expire: 0 });
        expect(updateTag).not.toHaveBeenCalled();
    });

    it("refuses a save based on an old version with 409 and keeps the newer content", async () => {
        expect((await put("profile", { data: { ...fixtures.profile, intro: "first" }, version: "0" })).status).toBe(
            200,
        );
        vi.mocked(revalidateTag).mockClear();
        const res = await put("profile", { data: { ...fixtures.profile, intro: "second" }, version: "0" });
        expect(res.status).toBe(409);
        expect(await res.json()).toMatchObject({
            ok: false,
            message: expect.stringMatching(/reload/),
            fieldErrors: [],
        });
        expect((await stored()).intro).toBe("first");
        nothingExpired();
    });

    it("refuses an invalid section with 422 and its field errors, and stores nothing", async () => {
        const events = structuredClone(fixtures.events);
        events.events[0].name = "";
        const res = await put("events", { data: events, version: "0" });
        expect(res.status).toBe(422);
        const body = await res.json();
        expect(body).toMatchObject({ ok: false, message: expect.stringMatching(/Nothing was saved/) });
        expect(body.fieldErrors.map((e: { path: string }) => e.path)).toContain("events.0.name");
        expect(body).not.toHaveProperty("reason");
        expect(await repo.get("events")).toEqual(fixtures.events);
        nothingExpired();
    });

    it("refuses a resume in Blob that isn't really a PDF with 422", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => new Response("<html>", { status: 206 })),
        );
        const url = "https://abc.public.blob.vercel-storage.com/resume/0b5c8d3e-6f1a-4a7b-9c2d-1e3f5a7b9c0d.pdf";
        const res = await put("profile", { data: { ...fixtures.profile, resume: { url } }, version: "0" });
        expect(res.status).toBe(422);
        expect((await res.json()).fieldErrors).toEqual([{ path: "resume.url", message: expect.stringMatching(/PDF/) }]);
        expect(await stored()).toEqual(fixtures.profile);
        nothingExpired();
    });

    it.each([
        ["not JSON", "{"],
        ["no version", JSON.stringify({ data: fixtures.profile })],
        ["a numeric version", JSON.stringify({ data: fixtures.profile, version: 0 })],
        ["no data", JSON.stringify({ version: "0" })],
    ])("refuses a body with %s with 422", async (_, raw) => {
        const res = await call(save, "/sections/profile", { method: "PUT", params: { key: "profile" }, body: raw });
        expect(res.status).toBe(422);
        expect(await stored()).toEqual(fixtures.profile);
        nothingExpired();
    });

    it("creates a section that was never saved, from a save based on it being missing", async () => {
        const { products: _, ...rest } = fixtures;
        use(createFixturesRepository(rest as typeof fixtures));
        const res = await put("products", { data: fixtures.products, version: null });
        expect(res.status).toBe(200);
        expect(revalidateTag).toHaveBeenCalledExactlyOnceWith("content:products", { expire: 0 });
    });

    it("refuses with 503 on a deployment that can't save, and says why", async () => {
        vi.stubEnv("VERCEL", "1");
        const res = await put("profile", { data: { ...fixtures.profile, intro: "lost" }, version: "0" });
        expect(res.status).toBe(503);
        expect(await res.json()).toEqual({ ok: false, message: READ_ONLY_MESSAGE, fieldErrors: [] });
        expect(await stored()).toEqual(fixtures.profile);
        nothingExpired();
    });

    it("answers an unknown section with 404", async () => {
        const res = await put("secrets", { data: {}, version: null });
        expect(res.status).toBe(404);
        expect(untouched(repo)).toBe(true);
        nothingExpired();
    });
});

describe("POST /sections/:key/revisions/:id/restore", () => {
    /** Saves an edit through the store, so the fixture profile becomes revision 1. */
    const edit = async () => {
        await repo.save("profile", { ...fixtures.profile, intro: "edited" });
        return (await repo.listRevisions("profile"))[0];
    };

    it("restores a revision as a new save, keeps what it replaced, and expires the tag at once", async () => {
        const revision = await edit();
        const res = await restoreRevision("profile", revision.id);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ ok: true });
        expect(await stored()).toEqual(fixtures.profile);
        expect(((await repo.listRevisions("profile"))[0].data as Profile).intro).toBe("edited");
        expect(revalidateTag).toHaveBeenCalledExactlyOnceWith("content:profile", { expire: 0 });
        expect(updateTag).not.toHaveBeenCalled();
    });

    it("won't restore another section's revision, a missing one, or a nonsense id", async () => {
        const revision = await edit();
        for (const [key, id] of [
            ["events", revision.id],
            ["profile", 9999],
            ["profile", "abc"],
            ["profile", "1.5"],
            ["profile", "99999999999999999999"],
        ] as const) {
            const res = await restoreRevision(key, id);
            expect(res.status).toBe(404);
            expect(await res.json()).toMatchObject({ ok: false });
        }
        expect(await repo.get("events")).toEqual(fixtures.events);
        expect((await stored()).intro).toBe("edited");
        nothingExpired();
    });

    it("refuses with 422 a revision that no longer fits the schema, and keeps the current content", async () => {
        await repo.save("profile", { ...fixtures.profile, name: "" });
        await repo.save("profile", fixtures.profile);
        const [invalid] = await repo.listRevisions("profile");
        const res = await restoreRevision("profile", invalid.id);
        expect(res.status).toBe(422);
        expect(await res.json()).toMatchObject({ ok: false, message: expect.stringMatching(/schema/) });
        expect(await stored()).toEqual(fixtures.profile);
        nothingExpired();
    });

    it("refuses with 503 on a deployment that can't save", async () => {
        const revision = await edit();
        vi.stubEnv("VERCEL", "1");
        const res = await restoreRevision("profile", revision.id);
        expect(res.status).toBe(503);
        expect((await stored()).intro).toBe("edited");
        nothingExpired();
    });

    it("answers an unknown section with 404", async () => {
        expect((await restoreRevision("secrets", 1)).status).toBe(404);
        expect(untouched(repo)).toBe(true);
    });
});
