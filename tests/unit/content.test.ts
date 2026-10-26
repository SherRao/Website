import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { fillGlance } from "@/content/select";
import { fixtures } from "../fixtures/content";

const { products } = fixtures;
const { events, stagePhotos } = fixtures.events;
const { founder, fallbackFilms } = fixtures.panels;
const { glance, ...profile } = fixtures.profile;

const publicFile = (src: string) => path.join(__dirname, "../../public", src);

describe("content fixtures", () => {
    it("every product has a name, description, role and years", () => {
        for (const p of products) {
            expect(p.name, JSON.stringify(p)).toBeTruthy();
            expect(p.what).toBeTruthy();
            expect(p.role).toBeTruthy();
            expect(p.years).toBeTruthy();
        }
    });

    it("every event has a name, date, link and at least one stat", () => {
        for (const e of events) {
            expect(e.name && e.date && e.url).toBeTruthy();
            expect(e.stats.length).toBeGreaterThan(0);
        }
    });

    it("every photo exists in public/ and has alt text and a caption", () => {
        const founderPhotos = founder.works.flatMap((w) =>
            w.art?.kind === "photo" ? [{ src: w.art.image, alt: w.art.alt, caption: w.title }] : [],
        );
        expect(founderPhotos.length).toBeGreaterThan(0);
        for (const p of [...stagePhotos, ...founderPhotos]) {
            expect(existsSync(publicFile(p.src)), p.src).toBe(true);
            expect(p.alt.length).toBeGreaterThan(10);
            expect(p.caption).toBeTruthy();
        }
    });

    it("the stealth company has no link and no detail beyond 'in stealth'", () => {
        expect("url" in founder.stealth).toBe(false);
        expect("art" in founder.stealth).toBe(false);
        const next = glance.find((g) => g.label === "next");
        expect(next?.href).toBeUndefined();
        expect(next?.detail).toBe("in stealth");
    });

    it("the 'built' count matches the side projects list", () => {
        expect(fillGlance(glance, products).find((g) => g.label === "built")?.title).toBe(
            `${products.length} side projects`,
        );
    });

    it("keeps job work out of the side projects", () => {
        const work = [
            "blue-dot",
            "shopify",
            "rfq-dashboard",
            "seahorse",
            "spur-investor-platform",
            "spurhacks-platform",
        ];
        expect(products.map((p) => p.id).filter((id) => work.includes(id))).toEqual([]);
    });

    it("every job has at least one stint and a line", () => {
        for (const j of fixtures.jobs.jobs) {
            expect(j.stints.length, j.id).toBeGreaterThan(0);
            expect(j.line).toBeTruthy();
        }
    });

    it("has a contact email and fallback films", () => {
        expect(profile.email).toMatch(/@/);
        expect(fallbackFilms.length).toBeGreaterThanOrEqual(4);
    });
});
