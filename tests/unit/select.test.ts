import { describe, expect, it } from "vitest";
import { fillGlance, shownJobs, splitProducts } from "@/content/select";
import { fixtures } from "../fixtures/content";

describe("featured products", () => {
    it("are the side projects marked featured, in list order", () => {
        const { featured, others } = splitProducts(fixtures.products);
        expect(featured.map((p) => p.id)).toEqual(["tab", "kabo", "muspace", "this-website"]);
        expect(others.map((p) => p.name)).toEqual([
            "sherbot",
            "homestock",
            "chaterest",
            "spacestagram",
            "localify",
            "maerienette",
            "julia",
            "buddybot",
            "freegamenotifier",
        ]);
    });

    it("stay featured when renamed", () => {
        const products = structuredClone(fixtures.products);
        products.find((p) => p.id === "tab")!.name = "tab, the expense tracker";
        const { featured, others } = splitProducts(products);
        expect(featured.map((p) => p.name)).toContain("tab, the expense tracker");
        expect(others.map((p) => p.name)).not.toContain("tab, the expense tracker");
    });
});

describe("shown jobs", () => {
    it("are the jobs marked shown, newest first by their latest stint", () => {
        expect(shownJobs(fixtures.jobs.jobs).map((j) => j.id)).toEqual([
            "mappedin",
            "spur",
            "konfer",
            "webisoft",
            "near",
            "shopify",
            "magnet-forensics",
            "freelance",
        ]);
    });

    it("leave out hidden jobs, and bring them back when shown", () => {
        const jobs = structuredClone(fixtures.jobs.jobs);
        expect(shownJobs(jobs).map((j) => j.id)).not.toContain("laurier-ta");
        jobs.find((j) => j.id === "laurier-ta")!.show = true;
        expect(shownJobs(jobs).map((j) => j.id)).toContain("laurier-ta");
    });
});

describe("at a glance", () => {
    it("fills in {products} with the number of side projects, so it follows the list", () => {
        const built = (products: typeof fixtures.products) =>
            fillGlance(fixtures.profile.glance, products).find((g) => g.label === "built")?.title;
        expect(built(fixtures.products)).toBe("13 side projects");
        expect(built(fixtures.products.slice(1))).toBe("12 side projects");
    });
});
