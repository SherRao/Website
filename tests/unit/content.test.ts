import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { MONTH } from "@/content/dates";
import {
    events,
    fallbackFilms,
    founder,
    glance,
    jobs,
    panelIds,
    panels,
    products,
    profile,
    shownJobs,
    stagePhotos,
} from "@/content";

const publicFile = (src: string) => path.join(__dirname, "../../public", src);

describe("content", () => {
    it("the chapter panels come in order, numbered i to v", () => {
        expect(panelIds).toEqual(["dayjob", "engineer", "stage", "founder", "off"]);
        expect(panelIds.map((id) => panels[id].n)).toEqual(["i", "ii", "iii", "iv", "v"]);
    });

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

    it("the 'now' item is the day job panel's newest job", () => {
        const now = glance.find((g) => g.label === "now");
        expect(now?.title).toBe(shownJobs()[0].org);
        expect(now?.href).toBe(shownJobs()[0].url);
    });

    it("the 'built' count matches the side projects list", () => {
        expect(glance.find((g) => g.label === "built")?.title).toBe(`${products.length} side projects`);
    });

    it("keeps job work out of the side projects", () => {
        const work = ["blue dot", "shopify cli + partner dashboard", "rfq dashboard", "seahorse", "spurhacks platform"];
        expect(products.map((p) => p.name).filter((n) => work.includes(n) || n.includes("investor"))).toEqual([]);
    });

    it("stores every job with year-month stints that end after they start, and unique ids", () => {
        expect(new Set(jobs.map((j) => j.id)).size).toBe(jobs.length);
        for (const j of jobs) {
            expect(j.stints.length, j.id).toBeGreaterThan(0);
            expect(j.line, j.id).toBeTruthy();
            for (const s of j.stints) {
                expect(s.start, j.id).toMatch(MONTH);
                if (s.end) {
                    expect(s.end, j.id).toMatch(MONTH);
                    expect(s.end >= s.start, `${j.id} ends before it starts`).toBe(true);
                }
            }
        }
    });

    it("rejects months that aren't year-month", () => {
        for (const bad of ["2022", "2022-5", "2022-13", "may 2022", "2022-05-01"]) expect(bad).not.toMatch(MONTH);
        expect("2022-05").toMatch(MONTH);
    });

    it("shows the jobs marked shown, newest first by their latest stint", () => {
        expect(shownJobs().map((j) => j.id)).toEqual([
            "mappedin",
            "spur",
            "konfer",
            "webisoft",
            "near",
            "shopify",
            "magnet-forensics",
            "freelance",
        ]);
        const all = structuredClone(jobs);
        all.find((j) => j.id === "laurier-ta")!.show = true;
        expect(shownJobs(all).map((j) => j.id)).toContain("laurier-ta");
    });

    it("has a contact email and fallback films", () => {
        expect(profile.email).toMatch(/@/);
        expect(fallbackFilms.length).toBeGreaterThanOrEqual(4);
    });
});
