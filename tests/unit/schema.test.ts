import { describe, expect, it } from "vitest";
import { eventsSchema, panelsSchema, profileSchema, sectionKeys, sectionSchemas } from "@/content/schema";
import { fixtures } from "../fixtures/content";

const clone = <T>(v: T): T => structuredClone(v);
const issuePaths = (r: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) =>
    (r.error?.issues ?? []).map((i) => i.path.join("."));

describe("fixtures", () => {
    for (const key of sectionKeys) {
        it(`the ${key} fixture passes its schema`, () => {
            const result = sectionSchemas[key].safeParse(fixtures[key]);
            expect(result.error?.issues ?? []).toEqual([]);
        });
    }
});

describe("schema rejects", () => {
    it("an event with no name", () => {
        const events = clone(fixtures.events);
        events.events[0].name = "";
        const result = eventsSchema.safeParse(events);
        expect(result.success).toBe(false);
        expect(issuePaths(result)).toContain("events.0.name");
    });

    it("an event missing its name entirely", () => {
        const events = clone(fixtures.events) as { events: Record<string, unknown>[] };
        delete events.events[1].name;
        expect(issuePaths(eventsSchema.safeParse(events))).toContain("events.1.name");
    });

    it("a stage photo without alt text", () => {
        const events = clone(fixtures.events);
        events.stagePhotos[2].alt = "   ";
        const result = eventsSchema.safeParse(events);
        expect(result.success).toBe(false);
        expect(issuePaths(result)).toContain("stagePhotos.2.alt");
    });

    it("a founder work photo without alt text", () => {
        const panels = clone(fixtures.panels);
        panels.founderWorks.konfer.alt = "";
        expect(issuePaths(panelsSchema.safeParse(panels))).toContain("founderWorks.konfer.alt");
    });

    it("a resume URL that isn't a PDF", () => {
        for (const url of [
            "https://example.com/resume.docx",
            "/resume",
            "https://x.blob.vercel-storage.com/a.pdf.png",
        ]) {
            const profile = clone(fixtures.profile);
            profile.resume.url = url;
            expect(issuePaths(profileSchema.safeParse(profile)), url).toContain("resume.url");
        }
        const ok = clone(fixtures.profile);
        ok.resume.url = "https://abc.public.blob.vercel-storage.com/resume/1729800000000.pdf";
        expect(profileSchema.safeParse(ok).success).toBe(true);
    });

    it("an image next/image isn't allowed to load", () => {
        for (const src of [
            "https://example.com/stage.jpg",
            "http://abc.public.blob.vercel-storage.com/a.jpg",
            "//example.com/a.jpg",
            "https://public.blob.vercel-storage.com.example.com/a.jpg",
        ]) {
            const events = clone(fixtures.events);
            events.stagePhotos[0].src = src;
            expect(issuePaths(eventsSchema.safeParse(events)), src).toContain("stagePhotos.0.src");
            const panels = clone(fixtures.panels);
            panels.founderWorks.konfer.image = src;
            expect(issuePaths(panelsSchema.safeParse(panels)), src).toContain("founderWorks.konfer.image");
        }
        const ok = clone(fixtures.events);
        ok.stagePhotos[0].src = "https://abc.public.blob.vercel-storage.com/photos/1729800000000.jpg";
        expect(eventsSchema.safeParse(ok).success).toBe(true);
    });

    it("'content needed' without a hint", () => {
        const panels = clone(fixtures.panels) as unknown as { offHours: { making: Record<string, unknown> } };
        panels.offHours.making = { needed: true, hint: "" };
        expect(issuePaths(panelsSchema.safeParse(panels))).toContain("offHours.making.hint");
        panels.offHours.making = { needed: true };
        expect(issuePaths(panelsSchema.safeParse(panels))).toContain("offHours.making.hint");
    });

    it("filled-in content with no details", () => {
        const panels = clone(fixtures.panels) as unknown as { offHours: { making: Record<string, unknown> } };
        panels.offHours.making = { needed: false };
        expect(issuePaths(panelsSchema.safeParse(panels))).toContain("offHours.making.details");
        panels.offHours.making = { needed: false, details: "we play on fridays" };
        expect(panelsSchema.safeParse(panels).success).toBe(true);
    });

    it("duplicate product ids", () => {
        const products = clone(fixtures.products);
        products[1].id = products[0].id;
        expect(issuePaths(sectionSchemas.products.safeParse(products))).toContain("1.id");
    });
});
