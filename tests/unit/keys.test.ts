import { isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { Ledger } from "@/components/DayJob";
import { OffHours } from "@/components/OffHours";
import { fixtures } from "../fixtures/content";

/** Keys used more than once among the same element's children, anywhere in a tree of elements. */
const duplicateKeys = (node: ReactNode): string[] => {
    if (Array.isArray(node)) {
        const keys = node.filter(isValidElement).map((el) => el.key);
        const repeated = keys.filter((key, i) => key !== null && keys.indexOf(key) !== i) as string[];
        return [...repeated, ...node.flatMap(duplicateKeys)];
    }
    if (!isValidElement(node)) return [];
    return duplicateKeys((node.props as { children?: ReactNode }).children);
};

describe("render-only lists of edited content", () => {
    it("key jobs' stints uniquely even when two start in the same month", () => {
        const job = structuredClone(fixtures.jobs.jobs[0]);
        job.stints = [
            { role: "engineer", start: "2024-05", end: "2024-06" },
            { role: "lead", start: "2024-05", end: "2024-08" },
        ];
        expect(duplicateKeys(Ledger({ jobs: [job] }))).toEqual([]);
    });

    it("key repeated films and cooking prompts uniquely", () => {
        const film = { title: "heat", year: 1995, watched: "may 2", rating: 5 };
        const offHours = structuredClone(fixtures.panels.offHours);
        offHours.cooking = { needed: true, hint: "soon", prompts: ["pasta", "pasta"] };
        expect(duplicateKeys(OffHours({ films: [film, film], offHours }))).toEqual([]);
    });
});
