import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Stars } from "@/components/OffHours";

const render = (rating: number) => renderToStaticMarkup(createElement(Stars, { rating }));

describe("film stars", () => {
    it("reads a rating out as a whole image", () => {
        const html = render(3.5);
        expect(html).toContain('role="img"');
        expect(html).toContain('aria-label="3.5 out of 5 stars"');
        expect(html).toContain("★★★½");
    });

    it("says nothing about an unrated film", () => {
        expect(render(0)).toBe("");
    });
});
