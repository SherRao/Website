import { describe, expect, it } from "vitest";
import { clampWheel, nearest, settleOn } from "@/lib/snap";

// Five panels on a 900px-tall screen, so the threshold is 18px.
const points = [0, 900, 1800, 2700, 3600];
const H = 900;

describe("snap rule", () => {
    it("finds the nearest snap point", () => {
        expect(nearest(points, 0)).toBe(0);
        expect(nearest(points, 1300)).toBe(1);
        expect(nearest(points, 1400)).toBe(2);
        expect(nearest(points, 9999)).toBe(4);
    });

    it("lets the wheel glide no further than the panels either side of home", () => {
        expect(clampWheel(points, 1, 900, 100, false)).toEqual({ home: 1, to: 1000 });
        expect(clampWheel(points, 1, 900, 3000, false)).toEqual({ home: 1, to: 1800 });
        expect(clampWheel(points, 1, 900, -3000, false)).toEqual({ home: 1, to: 0 });
    });

    it("stops the wheel at the first and last panels", () => {
        expect(clampWheel(points, 0, 0, -100, false)).toEqual({ home: 0, to: 0 });
        expect(clampWheel(points, 4, 3600, 100, false)).toEqual({ home: 4, to: 3600 });
    });

    it("recomputes home when a native scroll has left its range", () => {
        expect(clampWheel(points, 0, 2650, 100, false)).toEqual({ home: 3, to: 2750 });
    });

    it("jumps a whole panel per notch with reduced motion", () => {
        expect(clampWheel(points, 1, 900, 1, true)).toEqual({ home: 1, to: 1800 });
        expect(clampWheel(points, 1, 900, -1, true)).toEqual({ home: 1, to: 0 });
    });

    it("settles a gesture under the threshold back home", () => {
        expect(settleOn(points, 1, 910, true, H)).toBe(1);
        expect(settleOn(points, 1, 890, true, H)).toBe(1);
    });

    it("settles a gesture past the threshold on the next panel in its direction", () => {
        // One wheel notch, or an arrow key, is far nearer home than the next panel, and still moves one panel.
        expect(settleOn(points, 1, 940, true, H)).toBe(2);
        expect(settleOn(points, 1, 860, true, H)).toBe(0);
        expect(settleOn(points, 1, 1800, true, H)).toBe(2);
    });

    it("settles a jump more than one panel away on the nearest panel", () => {
        expect(settleOn(points, 0, 2970, true, H)).toBe(3);
        expect(settleOn(points, 4, 100, true, H)).toBe(0);
    });

    it("settles a scroll the browser made on its own on the nearest panel", () => {
        expect(settleOn(points, 1, 940, false, H)).toBe(1);
        expect(settleOn(points, 1, 1500, false, H)).toBe(2);
    });
});
