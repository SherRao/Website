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

    it("rejects an unknown section", async () => {
        expect((await saveSectionContent("secrets", {})).ok).toBe(false);
    });

    it("rejects founder works pointing at a product that doesn't exist, and removing the product they show", async () => {
        const panels = structuredClone(fixtures.panels);
        panels.founderWorks.seahorse.productId = "nope";
        const result = await saveSectionContent("panels", panels);
        expect(!result.ok && result.fieldErrors[0].path).toBe("founderWorks.seahorse.productId");

        const withoutSeahorse = fixtures.products.filter((p) => p.id !== "seahorse");
        expect((await saveSectionContent("products", withoutSeahorse)).ok).toBe(false);
        expect(await repo.get("products")).toEqual(fixtures.products);
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

    it("restoring a revision that would break the founder works product link is rejected", async () => {
        // Rename the "seahorse" product to "seahorse-app", moving Panels over before the old id goes away.
        const seahorseApp = { ...fixtures.products.find((p) => p.id === "seahorse")!, id: "seahorse-app" };
        const panels = structuredClone(fixtures.panels);
        panels.founderWorks.seahorse.productId = "seahorse-app";
        const renamed = fixtures.products.map((p) => (p.id === "seahorse" ? seahorseApp : p));
        expect(await saveSectionContent("products", [...fixtures.products, seahorseApp])).toEqual({ ok: true });
        expect(await saveSectionContent("panels", panels)).toEqual({ ok: true });
        expect(await saveSectionContent("products", renamed)).toEqual({ ok: true });
        vi.mocked(updateTag).mockClear();

        // Old Panels point at "seahorse", which no longer exists.
        const [oldPanels] = await repo.listRevisions("panels");
        const result = await restoreRevisionContent("panels", oldPanels.id);
        expect(result).toMatchObject({ ok: false, message: expect.stringContaining('"seahorse"') });
        expect(await repo.get("panels")).toEqual(panels);

        // The original Products have no "seahorse-app", which Panels now show.
        const original = (await repo.listRevisions("products")).at(-1)!;
        expect((await restoreRevisionContent("products", original.id)).ok).toBe(false);
        expect(await repo.get("products")).toEqual(renamed);
        expect(updateTag).not.toHaveBeenCalled();
    });
});
