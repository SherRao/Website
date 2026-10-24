// Temporary: the values live in tests/fixtures/content until the site reads the data layer (removed in 8.3).
import { fixtures } from "../../tests/fixtures/content";
import { products } from "./products";

const seahorse = products.find((p) => p.id === fixtures.panels.founderWorks.seahorse.productId)!;

export const { panels, offHours, fallbackFilms } = fixtures.panels;
export const founderWorks = {
    ...fixtures.panels.founderWorks,
    seahorse: { title: seahorse.name, years: seahorse.years, role: seahorse.role, note: seahorse.what },
};
