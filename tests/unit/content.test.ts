import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { fixtures } from "../fixtures/content";

const { products } = fixtures;
const { events, stagePhotos } = fixtures.events;
const { founderWorks, fallbackFilms } = fixtures.panels;
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
        for (const p of [
            ...stagePhotos,
            { src: founderWorks.konfer.image, alt: founderWorks.konfer.alt, caption: "konfer" },
        ]) {
            expect(existsSync(publicFile(p.src)), p.src).toBe(true);
            expect(p.alt.length).toBeGreaterThan(10);
            expect(p.caption).toBeTruthy();
        }
    });

    it("the stealth company has no link and no detail beyond 'in stealth'", () => {
        expect("url" in founderWorks.stealth).toBe(false);
        const next = glance.find((g) => g.label === "next");
        expect(next?.href).toBeUndefined();
        expect(next?.detail).toBe("in stealth");
    });

    it("the 'built' count matches the products list", () => {
        expect(glance.find((g) => g.label === "built")?.title).toBe(`${products.length} products`);
    });

    it("has a contact email and fallback films", () => {
        expect(profile.email).toMatch(/@/);
        expect(fallbackFilms.length).toBeGreaterThanOrEqual(4);
    });
});
