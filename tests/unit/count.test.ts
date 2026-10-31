import { describe, expect, it } from "vitest";
import { countText } from "@/components/artworks";

describe("count-up text", () => {
    it("keeps the prefix and suffix around the number, with thousands separators", () => {
        expect(countText("", 1100000, "+")).toBe("1,100,000+");
        expect(countText("$", 350000, "k+")).toBe("$350,000k+");
    });

    it("starts from zero", () => {
        expect(countText("", 0, "+")).toBe("0+");
    });
});
