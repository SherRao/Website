import { revalidateTag, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createFixturesRepository, getRepository, setRepository, type ContentRepository } from "@/content/repository";
import type { SectionKey } from "@/content/schema";
import type { SaveResult } from "@/lib/content-admin";
import { NotOwnerError } from "@/lib/owner";
import { fixtures } from "@/content/seed";

const requireOwner = vi.fn();
vi.mock("@/lib/require-owner", () => ({ requireOwner: () => requireOwner() }));
vi.mock("@/auth", () => ({ signOut: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

// The in-site Server Actions: the owner's session, then the shared save or restore, then the cache tag expired.
const { saveSection: saveSectionContent, restoreRevision } = await import("@/app/admin/actions");
const { saveSectionCore, restoreRevisionCore } = await import("@/lib/content-admin");

/** Restores through the Restore button's action, reading the result from where it redirects. */
const restoreRevisionContent = async (key: string, revisionId: number): Promise<SaveResult> => {
    vi.mocked(redirect).mockClear();
    await restoreRevision(key, revisionId);
    const to = new URL(vi.mocked(redirect).mock.calls[0][0], "http://localhost");
    expect(to.pathname).toBe(`/admin/${key}/revisions`);
    const error = to.searchParams.get("error");
    if (error === null) {
        expect(to.searchParams.get("restored")).toBe(String(revisionId));
        return { ok: true };
    }
    return { ok: false, message: error, fieldErrors: [] };
};

/** The version an editor opening the section now would load. */
const versionOf = async (key: SectionKey) => (await (await getRepository()).getVersioned(key))?.version ?? null;

describe("saving content", () => {
    let repo: ContentRepository;
    beforeEach(() => {
        repo = createFixturesRepository();
        setRepository(repo);
        requireOwner.mockResolvedValue({ user: { githubId: "4242" } });
    });
    afterEach(() => {
        setRepository(undefined);
        vi.mocked(updateTag).mockClear();
    });

    it("an invalid save is rejected with field errors and leaves stored content unchanged", async () => {
        const events = structuredClone(fixtures.events);
        events.events[0].name = "";
        const result = await saveSectionContent("events", events, await versionOf("events"));
        expect(result.ok).toBe(false);
        expect(!result.ok && result.fieldErrors.map((e) => e.path)).toContain("events.0.name");
        expect(await repo.get("events")).toEqual(fixtures.events);
        expect(await repo.listRevisions("events")).toEqual([]);
        expect(updateTag).not.toHaveBeenCalled();
    });

    it("a save without an owner session is rejected and stores nothing", async () => {
        requireOwner.mockRejectedValue(new NotOwnerError());
        const profile = { ...fixtures.profile, intro: "rewritten by someone else" };
        const result = await saveSectionContent("profile", profile, await versionOf("profile"));
        expect(result).toMatchObject({ ok: false, message: expect.stringMatching(/sign in/i) });
        expect(await repo.get("profile")).toEqual(fixtures.profile);
        expect(updateTag).not.toHaveBeenCalled();
    });

    it("a valid save stores the section, records a revision and expires its cache tag", async () => {
        const profile = { ...fixtures.profile, intro: "a new intro" };
        expect(await saveSectionContent("profile", profile, await versionOf("profile"))).toMatchObject({ ok: true });
        expect(await repo.get("profile")).toEqual(profile);
        expect((await repo.listRevisions("profile"))[0].data).toEqual(fixtures.profile);
        expect(updateTag).toHaveBeenCalledWith("content:profile");
    });

    it("a save based on a version that's no longer current is refused and keeps the newer content", async () => {
        const opened = await versionOf("profile");
        const first = await saveSectionContent("profile", { ...fixtures.profile, intro: "from tab one" }, opened);
        expect(first).toMatchObject({ ok: true });
        vi.mocked(updateTag).mockClear();

        const stale = await saveSectionContent("profile", { ...fixtures.profile, intro: "from tab two" }, opened);
        expect(stale).toMatchObject({ ok: false, message: expect.stringMatching(/reload/i) });
        expect(((await repo.get("profile")) as typeof fixtures.profile).intro).toBe("from tab one");
        expect(updateTag).not.toHaveBeenCalled();

        // The version a save returns is what the editor's next save is based on.
        const again = await saveSectionContent(
            "profile",
            { ...fixtures.profile, intro: "tab one again" },
            first.ok ? first.version : null,
        );
        expect(again).toMatchObject({ ok: true });
    });

    it("a section that was never saved can only be created by a save based on it being missing", async () => {
        const withoutProducts = Object.fromEntries(Object.entries(fixtures).filter(([key]) => key !== "products"));
        setRepository(createFixturesRepository(withoutProducts as typeof fixtures));
        expect(await versionOf("products")).toBeNull();
        expect(await saveSectionContent("products", fixtures.products, null)).toMatchObject({ ok: true });
        expect((await saveSectionContent("products", fixtures.products, null)).ok).toBe(false);
    });

    it("on a Vercel deployment reading fixtures, saves and restores are refused instead of kept in one instance", async () => {
        await saveSectionContent("profile", { ...fixtures.profile, intro: "edit" }, await versionOf("profile"));
        const [revision] = await repo.listRevisions("profile");
        vi.mocked(updateTag).mockClear();
        vi.stubEnv("VERCEL", "1");
        try {
            const save = await saveSectionContent(
                "profile",
                { ...fixtures.profile, intro: "lost" },
                await versionOf("profile"),
            );
            expect(save).toMatchObject({ ok: false, message: expect.stringMatching(/CONTENT_SOURCE=db/) });
            expect((await restoreRevisionContent("profile", revision.id)).ok).toBe(false);
            expect(((await repo.get("profile")) as typeof fixtures.profile).intro).toBe("edit");
            expect(updateTag).not.toHaveBeenCalled();
        } finally {
            vi.unstubAllEnvs();
        }
    });

    it("rejects an unknown section", async () => {
        expect((await saveSectionContent("secrets", {}, null)).ok).toBe(false);
    });

    it("saves a job with a second stint, and rejects one that ends before it starts", async () => {
        const jobs = structuredClone(fixtures.jobs);
        jobs.jobs[0].stints.push({ role: "staff engineer", start: "2026-12" });
        expect(await saveSectionContent("jobs", jobs, await versionOf("jobs"))).toMatchObject({ ok: true });
        expect(updateTag).toHaveBeenCalledWith("content:jobs");

        const broken = structuredClone(jobs);
        broken.jobs[0].stints[1].end = "2026-01";
        const result = await saveSectionContent("jobs", broken, await versionOf("jobs"));
        expect(!result.ok && result.fieldErrors.map((e) => e.path)).toContain("jobs.0.stints.1.end");
        expect(await repo.get("jobs")).toEqual(jobs);
    });

    it("restoring requires the owner, and restores as a new save", async () => {
        await saveSectionContent("profile", { ...fixtures.profile, intro: "edit" }, await versionOf("profile"));
        const [revision] = await repo.listRevisions("profile");

        requireOwner.mockRejectedValueOnce(new NotOwnerError());
        expect((await restoreRevisionContent("profile", revision.id)).ok).toBe(false);
        expect(((await repo.get("profile")) as typeof fixtures.profile).intro).toBe("edit");

        expect(await restoreRevisionContent("profile", revision.id)).toEqual({ ok: true });
        expect(await repo.get("profile")).toEqual(fixtures.profile);
        expect(((await repo.listRevisions("profile"))[0].data as typeof fixtures.profile).intro).toBe("edit");
        expect(updateTag).toHaveBeenLastCalledWith("content:profile");
    });

    it("won't restore another section's revision, or one that doesn't exist", async () => {
        await saveSectionContent("profile", { ...fixtures.profile, intro: "edit" }, await versionOf("profile"));
        const [revision] = await repo.listRevisions("profile");
        expect(await restoreRevisionContent("events", revision.id)).toMatchObject({ ok: false });
        expect(await restoreRevisionContent("profile", 9999)).toMatchObject({ ok: false });
        expect(await repo.get("events")).toEqual(fixtures.events);
    });

    it("restoring saves the revision as the schema parses it", async () => {
        await repo.save("profile", { ...fixtures.profile, intro: "  padded  ", retired: "a key the schema dropped" });
        await saveSectionContent("profile", fixtures.profile, await versionOf("profile"));
        const [revision] = await repo.listRevisions("profile");
        expect(await restoreRevisionContent("profile", revision.id)).toEqual({ ok: true });
        expect(await repo.get("profile")).toEqual({ ...fixtures.profile, intro: "padded" });
    });

    it("the shared save and restore check no session and expire nothing: their callers do", async () => {
        requireOwner.mockRejectedValue(new NotOwnerError());
        const saved = await saveSectionCore(
            "profile",
            { ...fixtures.profile, intro: "core" },
            await versionOf("profile"),
        );
        expect(saved).toEqual({ ok: true, version: expect.any(String) });
        const [revision] = await repo.listRevisions("profile");
        expect(await restoreRevisionCore("profile", revision.id)).toEqual({ ok: true });
        expect(requireOwner).not.toHaveBeenCalled();
        expect(updateTag).not.toHaveBeenCalled();
        expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("refuses a stale save even when the store's error comes from another bundle's copy of the module", async () => {
        // Each Next.js bundle has its own copy of the repository module, but they share one store through globalThis.
        const fromAnotherBundle = Object.assign(new Error("The section was saved since this version was read"), {
            name: "StaleVersionError",
        });
        setRepository({ ...repo, save: async () => Promise.reject(fromAnotherBundle) });
        expect(await saveSectionCore("profile", fixtures.profile, "0")).toMatchObject({ ok: false, reason: "stale" });
    });

    it("the shared save says why it refused, so the content API can pick a status", async () => {
        const events = structuredClone(fixtures.events);
        events.events[0].name = "";
        expect(await saveSectionCore("events", events, await versionOf("events"))).toMatchObject({ reason: "invalid" });
        expect(await saveSectionCore("events", fixtures.events, "stale")).toMatchObject({ reason: "stale" });
        expect(await saveSectionCore("secrets", {}, null)).toMatchObject({ reason: "not-found" });
        expect(await restoreRevisionCore("profile", 9999)).toMatchObject({ reason: "not-found" });
        vi.stubEnv("VERCEL", "1");
        try {
            expect(await saveSectionCore("profile", fixtures.profile, "0")).toMatchObject({ reason: "read-only" });
        } finally {
            vi.unstubAllEnvs();
        }
    });

    describe("publishing a resume uploaded to Blob", () => {
        const blobResume = "https://abc.public.blob.vercel-storage.com/resume/0b5c8d3e-6f1a-4a7b-9c2d-1e3f5a7b9c0d.pdf";
        const serve = (body: string) =>
            vi.stubGlobal(
                "fetch",
                vi.fn(async () => new Response(body, { status: 206 })),
            );
        afterEach(() => vi.unstubAllGlobals());

        const revisionWithBlobResume = async () => {
            await repo.save("profile", { ...fixtures.profile, resume: { url: blobResume } });
            await repo.save("profile", fixtures.profile);
            return (await repo.listRevisions("profile"))[0];
        };

        it("is refused on restore if the file isn't really a PDF", async () => {
            const revision = await revisionWithBlobResume();
            serve("<html>");
            expect(await restoreRevisionContent("profile", revision.id)).toMatchObject({
                ok: false,
                message: expect.stringMatching(/Nothing was restored/),
            });
            expect(await repo.get("profile")).toEqual(fixtures.profile);
        });

        it("is restored if the file is a PDF", async () => {
            const revision = await revisionWithBlobResume();
            serve("%PDF-1.7");
            expect(await restoreRevisionContent("profile", revision.id)).toEqual({ ok: true });
        });

        it("is refused if the file isn't really a PDF", async () => {
            serve("<html>");
            const profile = { ...fixtures.profile, resume: { url: blobResume } };
            const result = await saveSectionContent("profile", profile, await versionOf("profile"));
            expect(result).toMatchObject({ ok: false, message: expect.stringMatching(/PDF/) });
            expect(!result.ok && result.fieldErrors.map((e) => e.path)).toEqual(["resume.url"]);
            expect(fetch).toHaveBeenCalledWith(
                blobResume,
                expect.objectContaining({ headers: { Range: "bytes=0-4" } }),
            );
            expect(await repo.get("profile")).toEqual(fixtures.profile);
        });

        it("saves a real PDF, and doesn't read it again on later saves", async () => {
            serve("%PDF-1.7");
            const profile = { ...fixtures.profile, resume: { url: blobResume } };
            const first = await saveSectionContent("profile", profile, await versionOf("profile"));
            expect(first).toMatchObject({ ok: true });
            vi.mocked(fetch).mockClear();
            const again = { ...profile, intro: "a new intro" };
            expect(await saveSectionContent("profile", again, first.ok ? first.version : null)).toMatchObject({
                ok: true,
            });
            expect(fetch).not.toHaveBeenCalled();
        });

        it("is refused if the file can't be read", async () => {
            vi.stubGlobal(
                "fetch",
                vi.fn(async () => new Response("", { status: 404 })),
            );
            const profile = { ...fixtures.profile, resume: { url: blobResume } };
            expect(await saveSectionContent("profile", profile, await versionOf("profile"))).toMatchObject({
                ok: false,
            });
        });
    });
});
