import { describe, expect, it } from "vitest";
import { slugify } from "@/app/admin/_editor/slug";

describe("slugify", () => {
    it("drops accents instead of splitting the word at them", () => {
        expect(slugify("Montréal Fest")).toBe("montreal-fest");
        expect(slugify("Crème Brûlée, São Paulo")).toBe("creme-brulee-sao-paulo");
    });

    it("makes lowercase dashed ids from names", () => {
        expect(slugify("  SpurHacks 2025!  ")).toBe("spurhacks-2025");
        expect(slugify("this website")).toBe("this-website");
        expect(slugify(undefined)).toBe("");
    });
});
