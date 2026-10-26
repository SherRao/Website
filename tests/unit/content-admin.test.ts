import { updateTag } from "next/cache";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createFixturesRepository, setRepository, type ContentRepository } from "@/content/repository";
import { NotOwnerError } from "@/lib/owner";
import { fixtures } from "../fixtures/content";

const requireOwner = vi.fn();
vi.mock("@/lib/require-owner", () => ({ requireOwner: () => requireOwner() }));

const { saveSectionContent, restoreRevisionContent } = await import("@/lib/content-admin");

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
        const result = await saveSectionContent("events", events);
        expect(result.ok).toBe(false);
        expect(!result.ok && result.fieldErrors.map((e) => e.path)).toContain("events.0.name");
        expect(await repo.get("events")).toEqual(fixtures.events);
        expect(await repo.listRevisions("events")).toEqual([]);
        expect(updateTag).not.toHaveBeenCalled();
    });

    it("a save without an owner session is rejected and stores nothing", async () => {
        requireOwner.mockRejectedValue(new NotOwnerError());
        const profile = { ...fixtures.profile, intro: "rewritten by someone else" };
        const result = await saveSectionContent("profile", profile);
        expect(result).toMatchObject({ ok: false, message: expect.stringMatching(/sign in/i) });
        expect(await repo.get("profile")).toEqual(fixtures.profile);
        expect(updateTag).not.toHaveBeenCalled();
    });

    it("a valid save stores the section, records a revision and expires its cache tag", async () => {
        const profile = { ...fixtures.profile, intro: "a new intro" };
        expect(await saveSectionContent("profile", profile)).toEqual({ ok: true });
        expect(await repo.get("profile")).toEqual(profile);
        expect((await repo.listRevisions("profile"))[0].data).toEqual(fixtures.profile);
        expect(updateTag).toHaveBeenCalledWith("content:profile");
    });

    it("on a Vercel deployment reading fixtures, saves and restores are refused instead of kept in one instance", async () => {
        await saveSectionContent("profile", { ...fixtures.profile, intro: "edit" });
        const [revision] = await repo.listRevisions("profile");
        vi.mocked(updateTag).mockClear();
        vi.stubEnv("VERCEL", "1");
        try {
            const save = await saveSectionContent("profile", { ...fixtures.profile, intro: "lost" });
            expect(save).toMatchObject({ ok: false, message: expect.stringMatching(/CONTENT_SOURCE=db/) });
            expect((await restoreRevisionContent("profile", revision.id)).ok).toBe(false);
            expect(((await repo.get("profile")) as typeof fixtures.profile).intro).toBe("edit");
            expect(updateTag).not.toHaveBeenCalled();
        } finally {
            vi.unstubAllEnvs();
        }
    });

    it("rejects an unknown section", async () => {
        expect((await saveSectionContent("secrets", {})).ok).toBe(false);
    });

    it("saves a job with a second stint, and rejects one that ends before it starts", async () => {
        const jobs = structuredClone(fixtures.jobs);
        jobs.jobs[0].stints.push({ role: "staff engineer", start: "2026-12" });
        expect(await saveSectionContent("jobs", jobs)).toEqual({ ok: true });
        expect(updateTag).toHaveBeenCalledWith("content:jobs");

        const broken = structuredClone(jobs);
        broken.jobs[0].stints[1].end = "2026-01";
        const result = await saveSectionContent("jobs", broken);
        expect(!result.ok && result.fieldErrors.map((e) => e.path)).toContain("jobs.0.stints.1.end");
        expect(await repo.get("jobs")).toEqual(jobs);
    });

    it("restoring requires the owner, and restores as a new save", async () => {
        await saveSectionContent("profile", { ...fixtures.profile, intro: "edit" });
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
        await saveSectionContent("profile", { ...fixtures.profile, intro: "edit" });
        const [revision] = await repo.listRevisions("profile");
        expect(await restoreRevisionContent("events", revision.id)).toMatchObject({ ok: false });
        expect(await restoreRevisionContent("profile", 9999)).toMatchObject({ ok: false });
        expect(await repo.get("events")).toEqual(fixtures.events);
    });

    it("restoring saves the revision as the schema parses it", async () => {
        await repo.save("profile", { ...fixtures.profile, intro: "  padded  ", retired: "a key the schema dropped" });
        await saveSectionContent("profile", fixtures.profile);
        const [revision] = await repo.listRevisions("profile");
        expect(await restoreRevisionContent("profile", revision.id)).toEqual({ ok: true });
        expect(await repo.get("profile")).toEqual({ ...fixtures.profile, intro: "padded" });
    });
});
