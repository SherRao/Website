import { describe, expect, it } from "vitest";
import { displayName, fillGlance, nameWords, shownJobs, splitProducts } from "@/content/select";
import { fixtures } from "@/content/seed";

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
            fillGlance(fixtures.profile.glance, products, fixtures.jobs.jobs).find((g) => g.label === "built")?.title;
        expect(built(fixtures.products)).toBe("13 side projects");
        expect(built(fixtures.products.slice(1))).toBe("12 side projects");
    });

    const now = (jobs: typeof fixtures.jobs.jobs) =>
        fillGlance(fixtures.profile.glance, fixtures.products, jobs).find((g) => g.label === "now");

    it("takes the 'now' item's title and link from the newest shown job", () => {
        const jobs = structuredClone(fixtures.jobs.jobs);
        const newest = shownJobs(jobs)[0];
        newest.org = "somewhere new";
        newest.url = "https://somewhere.example";
        expect(now(jobs)).toMatchObject({ title: "somewhere new", href: "https://somewhere.example" });
    });

    it("leaves the 'now' item unlinked if the newest shown job has no site, and keeps its detail", () => {
        const jobs = structuredClone(fixtures.jobs.jobs);
        delete shownJobs(jobs)[0].url;
        const item = now(jobs);
        expect(item?.href).toBeUndefined();
        expect(item?.detail).toBe(fixtures.profile.glance.find((g) => g.label === "now")?.detail);
    });

    it("keeps the stored 'now' item when no job is shown", () => {
        expect(now([])?.title).toBe(fixtures.profile.glance.find((g) => g.label === "now")?.title);
    });
});

describe("names", () => {
    it("split into words on any spacing", () => {
        expect(nameWords(" nausher  rao ")).toEqual(["nausher", "rao"]);
    });

    it("are capitalized for metadata", () => {
        expect(displayName("nausher rao")).toBe("Nausher Rao");
    });
});
