import { describe, expect, it } from "vitest";
import { fillGlance, productById, splitProducts } from "@/content/select";
import { fixtures } from "../fixtures/content";

describe("featured products", () => {
    it("are the products marked featured, in list order", () => {
        const { featured, others } = splitProducts(fixtures.products);
        expect(featured.map((p) => p.id)).toEqual(["blue-dot", "tab", "shopify"]);
        expect(others.map((p) => p.name)).toEqual([
            "spurhacks platform",
            "spur investor platform",
            "seahorse",
            "rfq dashboard",
        ]);
    });

    it("stay featured when renamed", () => {
        const products = structuredClone(fixtures.products);
        products.find((p) => p.id === "blue-dot")!.name = "blue dot positioning";
        const { featured, others } = splitProducts(products);
        expect(featured.map((p) => p.name)).toContain("blue dot positioning");
        expect(others.map((p) => p.name)).not.toContain("blue dot positioning");
    });

    it("founder works find seahorse by id even after a rename", () => {
        const products = structuredClone(fixtures.products);
        products.find((p) => p.id === "seahorse")!.name = "seahorse health";
        expect(productById(products, fixtures.panels.founderWorks.seahorse.productId)?.name).toBe("seahorse health");
        expect(productById(products, "gone")).toBeUndefined();
    });
});

describe("at a glance", () => {
    it("fills in {products} with the number of products, so it follows the list", () => {
        const built = (products: typeof fixtures.products) =>
            fillGlance(fixtures.profile.glance, products).find((g) => g.label === "built")?.title;
        expect(built(fixtures.products)).toBe("7 products");
        expect(built(fixtures.products.slice(1))).toBe("6 products");
    });
});
