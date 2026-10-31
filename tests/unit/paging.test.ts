import { describe, expect, it } from "vitest";
import { pageNumber, PER_PAGE } from "@/app/admin/[section]/revisions/paging";

describe("the revisions page number", () => {
    it("reads whole page numbers, and starts at 1", () => {
        expect(pageNumber(undefined)).toBe(1);
        expect(pageNumber("3")).toBe(3);
        expect(pageNumber("2.7")).toBe(2);
        for (const bad of ["0", "-4", "abc", "", "-Infinity", "NaN"]) expect(pageNumber(bad), bad).toBe(1);
    });

    it("keeps huge pages to an offset the database can take", () => {
        for (const huge of ["Infinity", "1e20", "99999999999999999999"]) {
            const page = pageNumber(huge);
            expect(Number.isSafeInteger((page - 1) * PER_PAGE), huge).toBe(true);
            expect(page, huge).toBeGreaterThan(1_000_000);
        }
    });
});
