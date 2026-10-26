import { describe, expect, it } from "vitest";
import { latestStint, monthLabel, stintLabel, stintShort, yearRange } from "@/content/dates";

describe("job dates", () => {
    it("label a month", () => {
        expect(monthLabel("2022-05")).toBe("may 2022");
        expect(monthLabel("2011-12")).toBe("dec 2011");
    });

    it("give a single stint's years", () => {
        expect(yearRange([{ role: "freelance", start: "2011-08", end: "2022-07" }])).toBe("2011 to 2022");
        expect(stintLabel({ role: "freelance", start: "2011-08", end: "2022-07" })).toBe("aug 2011 to jul 2022");
    });

    it("span every stint of a job, in any order", () => {
        const shopify = [
            { role: "software engineer", start: "2023-01", end: "2023-04" },
            { role: "software engineer", start: "2022-05", end: "2022-08" },
        ];
        expect(yearRange(shopify)).toBe("2022 to 2023");
        expect(latestStint(shopify).start).toBe("2023-01");
    });

    it("run an ongoing stint to now", () => {
        expect(yearRange([{ role: "founder & ceo", start: "2024-07" }])).toBe("2024 to now");
        expect(stintLabel({ role: "founder & ceo", start: "2024-07" })).toBe("jul 2024 to now");
    });

    it("show a range within one year as that year", () => {
        expect(yearRange([{ role: "software engineer", start: "2021-09", end: "2021-12" }])).toBe("2021");
    });

    it("label a stint short, dropping a repeated year", () => {
        expect(stintShort({ role: "software engineer", start: "2022-05", end: "2022-08" })).toBe("may to aug 2022");
        expect(stintShort({ role: "software developer", start: "2011-08", end: "2022-07" })).toBe(
            "aug 2011 to jul 2022",
        );
        expect(stintShort({ role: "founder & ceo", start: "2024-07" })).toBe("jul 2024 to now");
    });
});
