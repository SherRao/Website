import { updateTag } from "next/cache";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createFixturesRepository, getRepository, setRepository, type ContentRepository } from "@/content/repository";
import type { SectionKey } from "@/content/schema";
import { NotOwnerError } from "@/lib/owner";
import { fixtures } from "../fixtures/content";

const requireOwner = vi.fn();
vi.mock("@/lib/require-owner", () => ({ requireOwner: () => requireOwner() }));

const { saveSectionContent, restoreRevisionContent } = await import("@/lib/content-admin");

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

    describe("the company in stealth", () => {
        beforeEach(() => vi.stubEnv("STEALTH_TERMS", "Hushco, quiet labs"));
        afterEach(() => vi.unstubAllEnvs());

        it("a save that names it is refused, with the fields that do, and stores nothing", async () => {
            const panels = structuredClone(fixtures.panels);
            panels.founder.stealth.note = "a new company: hushco.";
            panels.writing[0].title = "Notes from Quiet Labs";
            const result = await saveSectionContent("panels", panels, await versionOf("panels"));
            expect(result).toMatchObject({ ok: false, message: expect.stringMatching(/stealth/) });
            expect(!result.ok && result.fieldErrors.map((e) => e.path)).toEqual([
                "founder.stealth.note",
                "writing.0.title",
            ]);
            expect(await repo.get("panels")).toEqual(fixtures.panels);
            expect(updateTag).not.toHaveBeenCalled();
        });

        it("a revision that names it can't be restored", async () => {
            await repo.save("profile", { ...fixtures.profile, intro: "now at hushco" });
            await repo.save("profile", fixtures.profile);
            const [revision] = await repo.listRevisions("profile");
            expect(await restoreRevisionContent("profile", revision.id)).toMatchObject({ ok: false });
            expect(await repo.get("profile")).toEqual(fixtures.profile);
        });

        it("content that doesn't name it saves as usual", async () => {
            const profile = { ...fixtures.profile, intro: "a new intro" };
            expect(await saveSectionContent("profile", profile, await versionOf("profile"))).toMatchObject({
                ok: true,
            });
        });
    });
});
