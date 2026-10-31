import { describe, expect, it } from "vitest";
import {
    eventsSchema,
    isSectionKey,
    jobsSchema,
    panelsSchema,
    profileSchema,
    sectionKeys,
    sectionSchemas,
} from "@/content/schema";
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
        panels.founder.works[0].art = { kind: "photo", image: "/events/spur-bbq/2.jpg", alt: "" };
        expect(issuePaths(panelsSchema.safeParse(panels))).toContain("founder.works.0.art.alt");
    });

    it("a stint month that isn't year-month", () => {
        for (const start of ["2022", "2022-5", "2022-13", "may 2022", "2022-05-01"]) {
            const jobs = clone(fixtures.jobs);
            jobs.jobs[0].stints[0].start = start;
            expect(issuePaths(jobsSchema.safeParse(jobs)), start).toContain("jobs.0.stints.0.start");
        }
    });

    it("a stint that ends before it starts", () => {
        const jobs = clone(fixtures.jobs);
        jobs.jobs[0].stints[0] = { role: "engineer", start: "2024-05", end: "2024-04" };
        expect(issuePaths(jobsSchema.safeParse(jobs))).toContain("jobs.0.stints.0.end");
        jobs.jobs[0].stints[0].end = "2024-05";
        expect(jobsSchema.safeParse(jobs).success).toBe(true);
    });

    it("a job with no stints", () => {
        const jobs = clone(fixtures.jobs);
        jobs.jobs[2].stints = [];
        expect(issuePaths(jobsSchema.safeParse(jobs))).toContain("jobs.2.stints");
    });

    it("duplicate job ids", () => {
        const jobs = clone(fixtures.jobs);
        jobs.jobs[1].id = jobs.jobs[0].id;
        expect(issuePaths(jobsSchema.safeParse(jobs))).toContain("jobs.1.id");
    });

    it("a resume URL that isn't a PDF", () => {
        for (const url of [
            "https://example.com/resume.docx",
            "/resume",
            "https://x.blob.vercel-storage.com/a.pdf.png",
            // Another host: /resume redirects here, so these would be open redirects.
            "//evil.example/cv.pdf",
            "/\\evil.example/cv.pdf",
            "/\t/evil.example/cv.pdf",
            "http://example.com/cv.pdf",
            "https:evil.example/cv.pdf",
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
            "/\\example.com/a.jpg",
            "https://public.blob.vercel-storage.com.example.com/a.jpg",
        ]) {
            const events = clone(fixtures.events);
            events.stagePhotos[0].src = src;
            expect(issuePaths(eventsSchema.safeParse(events)), src).toContain("stagePhotos.0.src");
            const panels = clone(fixtures.panels);
            panels.founder.works[0].art = { kind: "photo", image: src, alt: "A sign on a lawn" };
            expect(issuePaths(panelsSchema.safeParse(panels)), src).toContain("founder.works.0.art.image");
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

    it("links that aren't http or https, which would become script or data URLs on the page", () => {
        for (const url of ["javascript:alert(1)", "data:text/html,<script>alert(1)</script>", "ftp://x.com/a"]) {
            const products = clone(fixtures.products);
            products[0].url = url;
            expect(issuePaths(sectionSchemas.products.safeParse(products)), url).toContain("0.url");
            const panels = clone(fixtures.panels);
            panels.founder.alsoLed[0].url = url;
            expect(issuePaths(panelsSchema.safeParse(panels)), url).toContain("founder.alsoLed.0.url");
        }
        const products = clone(fixtures.products);
        products[0].url = "https://example.com";
        expect(sectionSchemas.products.safeParse(products).success).toBe(true);
    });
});

describe("isSectionKey", () => {
    it("accepts every section key", () => {
        for (const key of sectionKeys) expect(isSectionKey(key), key).toBe(true);
    });

    it("rejects names every object inherits", () => {
        for (const key of ["constructor", "toString", "__proto__", "hasOwnProperty", "valueOf"]) {
            expect(isSectionKey(key), key).toBe(false);
        }
    });
});
