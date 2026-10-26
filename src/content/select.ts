import type { GlanceItem, Product } from "./types";

/** Products shown as large works in the engineer panel, and the rest (shown as links), both in list order. */
export const splitProducts = (products: Product[]) => ({
    featured: products.filter((p) => p.featured),
    others: products.filter((p) => !p.featured),
});

/** A product by its stable id, or undefined if it was removed. */
export const productById = (products: Product[], id: string) => products.find((p) => p.id === id);

/** "At a glance" items with `{products}` in a title replaced by the number of products, so it follows the list. */
export const fillGlance = (glance: GlanceItem[], products: Product[]): GlanceItem[] =>
    glance.map((g) => ({ ...g, title: g.title.replaceAll("{products}", String(products.length)) }));
