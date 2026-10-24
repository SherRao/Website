// Temporary: the values live in tests/fixtures/content until the site reads the data layer (removed in 8.3).
import { fixtures } from "../../tests/fixtures/content";
import type { Product } from "./types";

export const products: Product[] = fixtures.products;

export const findProduct = (name: string): Product => {
    const product = products.find((p) => p.name === name);
    if (!product) throw new Error(`Unknown product "${name}"`);
    return product;
};
