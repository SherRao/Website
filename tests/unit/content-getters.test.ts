import { cacheLife, cacheTag } from "next/cache";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getEvents, getPanels, getProducts, getProfile, loadSectionForEditing } from "@/content";
import { createFixturesRepository, setRepository } from "@/content/repository";
import { fixtures } from "../fixtures/content";

describe("content getters", () => {
    afterEach(() => {
        setRepository(undefined);
        vi.restoreAllMocks();
    });

    it("return each section from the store, tagged per section and cached until expired", async () => {
        setRepository(createFixturesRepository());
        expect(await getProfile()).toEqual(fixtures.profile);
        expect(await getProducts()).toEqual(fixtures.products);
        expect(await getEvents()).toEqual(fixtures.events);
        expect(await getPanels()).toEqual(fixtures.panels);
        for (const key of ["profile", "products", "events", "panels"]) {
            expect(cacheTag).toHaveBeenCalledWith(`content:${key}`);
        }
        expect(cacheLife).toHaveBeenCalledWith("max");
    });

    it("throw on a schema-invalid row instead of returning partial data", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        const repo = createFixturesRepository();
        const broken = structuredClone(fixtures.events) as { events: Record<string, unknown>[] };
        delete broken.events[0].name;
        await repo.save("events", broken);
        setRepository(repo);
        await expect(getEvents()).rejects.toThrow(/failed its schema/);
        // A valid section in the same store still reads.
        expect(await getProfile()).toEqual(fixtures.profile);
    });

    it("throw when a section was never saved", async () => {
        setRepository({
            get: async () => null,
            save: async () => {},
            listRevisions: async () => [],
            restore: async () => "profile",
        });
        await expect(getProducts()).rejects.toThrow(/not been saved/);
    });

    it("loading for the editor keeps an invalid section, with its problems, so it can be fixed", async () => {
        const repo = createFixturesRepository();
        const broken = structuredClone(fixtures.events) as { events: Record<string, unknown>[] };
        delete broken.events[0].name;
        await repo.save("events", broken);
        setRepository(repo);
        const { data, issues } = await loadSectionForEditing("events");
        expect(data).toEqual(broken);
        expect(issues.map((i) => i.path)).toEqual(["events.0.name"]);
        expect(await loadSectionForEditing("profile")).toEqual({ data: fixtures.profile, issues: [] });
    });
});
