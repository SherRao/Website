import { describe, expect, it } from "vitest";
import { linkTarget, newTab } from "@/lib/links";

describe("link target", () => {
    it("opens other sites in a new tab, without a reference back to this page", () => {
        expect(linkTarget("https://konfer.ca")).toEqual({ target: "_blank", rel: "noopener noreferrer" });
        expect(linkTarget("https://konfer.ca")).toBe(newTab);
    });

    it("keeps links within the page in this tab", () => {
        expect(linkTarget("#founder")).toEqual({});
    });
});
