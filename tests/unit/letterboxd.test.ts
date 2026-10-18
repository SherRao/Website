import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getRecentFilms, parseLetterboxd } from "@/lib/letterboxd";

const xml = readFileSync(path.join(__dirname, "fixtures/letterboxd.xml"), "utf8");

describe("parseLetterboxd", () => {
    it("reads films with title, year, watched date and rating", () => {
        const films = parseLetterboxd(xml);
        expect(films.length).toBeGreaterThan(0);
        for (const f of films) {
            expect(f.title).toBeTruthy();
            expect(f.year).toBeGreaterThan(1880);
            expect(f.watched).toMatch(/^[a-z]{3} \d{1,2}$/);
            expect(f.rating).toBeGreaterThanOrEqual(0);
        }
    });

    it("sorts newest watched first", () => {
        const sorted = parseLetterboxd(`<rss><channel>
            <item><letterboxd:filmTitle>Old</letterboxd:filmTitle><letterboxd:filmYear>2001</letterboxd:filmYear><letterboxd:watchedDate>2026-01-02</letterboxd:watchedDate><letterboxd:memberRating>3</letterboxd:memberRating></item>
            <item><letterboxd:filmTitle>New</letterboxd:filmTitle><letterboxd:filmYear>2002</letterboxd:filmYear><letterboxd:watchedDate>2026-09-18</letterboxd:watchedDate><letterboxd:memberRating>4.5</letterboxd:memberRating></item>
        </channel></rss>`);
        expect(sorted.map((f) => f.title)).toEqual(["new", "old"]);
        expect(sorted[0]).toEqual({ title: "new", year: 2002, watched: "sep 18", rating: 4.5 });
    });

    it("handles a feed with one film or none", () => {
        expect(parseLetterboxd("<rss><channel></channel></rss>")).toEqual([]);
        expect(parseLetterboxd("<rss><channel><item><letterboxd:filmTitle>Solo</letterboxd:filmTitle><letterboxd:filmYear>2018</letterboxd:filmYear><letterboxd:watchedDate>2026-03-04</letterboxd:watchedDate></item></channel></rss>")).toHaveLength(1);
    });
});

describe("getRecentFilms", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("returns an empty list when letterboxd can't be reached", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
        expect(await getRecentFilms("SherRao")).toEqual([]);
    });

    it("returns an empty list on an error status", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 503 })));
        expect(await getRecentFilms("SherRao")).toEqual([]);
    });
});
