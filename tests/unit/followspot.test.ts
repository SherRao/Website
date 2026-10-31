import { describe, expect, it } from "vitest";
import { aimAt } from "@/components/Followspot";

// At one px per drawing unit: the beam's axis runs 30 above the pivot, from the lens 40 ahead of it, 105 long.
const cover = { max: 45, minReach: 0.2 };

describe("followspot aim", () => {
    it("stays level for a point on the beam's axis, and reaches it", () => {
        const { aim, reach } = aimAt(145, -30, 1, cover);
        expect(aim).toBeCloseTo(0);
        expect(reach).toBeCloseTo(1);
    });

    it("scales with the drawing", () => {
        const { aim, reach } = aimAt(290, -60, 2, cover);
        expect(aim).toBeCloseTo(0);
        expect(reach).toBeCloseTo(1);
    });

    it("turns no further than its limit", () => {
        expect(aimAt(1, 500, 1, cover).aim).toBeCloseTo(45);
        expect(aimAt(1, -500, 1, cover).aim).toBeCloseTo(-45);
        expect(aimAt(1, 500, 1, { max: 75, minReach: 0.4 }).aim).toBeCloseTo(75);
    });

    it("keeps a short beam for a point at the lens", () => {
        expect(aimAt(40, -30, 1, cover).reach).toBe(0.2);
    });

    it("stretches past the point when asked", () => {
        expect(aimAt(145, -30, 1, { max: 75, stretch: 2, minReach: 0.4 }).reach).toBeCloseTo(2);
    });
});
