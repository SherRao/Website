import type { Product } from "./types";

/** Everything built, newest first. The engineer panel features the first three works by name; the rest show as links. */
export const products: Product[] = [
    {
        name: "tab",
        isNew: true,
        what: "a shared expense tracker for trips and events. scan a receipt, tag who got what, and it works out who owes whom in the fewest payments.",
        role: "side project",
        years: "2026",
        stack: "next.js, drizzle, postgres, tesseract.js",
        url: "https://github.com/SherRao/Tab",
    },
    {
        name: "blue dot",
        what: "indoor positioning: the part of an indoor map that knows where you are, where gps gives up.",
        role: "senior software engineer, mappedin",
        years: "mar 2026 to nov 2026",
        url: "https://www.mappedin.com",
    },
    {
        name: "spurhacks platform",
        what: "applications, ticketing, scheduling and networking for canada's largest in-person hackathon.",
        role: "product owner, konfer",
        years: "2025",
        stack: "react, typescript, go",
        url: "https://spurhacks.com",
    },
    {
        name: "spur investor platform",
        what: "an investor-ready platform that cut startup onboarding from 3+ months to a couple of weeks.",
        role: "project manager, spur",
        years: "2024 to 2025",
        stack: "react, typescript, go",
    },
    {
        name: "seahorse",
        what: "privacy-first mental health app; the mvp helped raise $750k.",
        role: "technical product lead, near",
        years: "2024",
        stack: "next.js, python, on-device rag, webllm",
    },
    {
        name: "rfq dashboard",
        what: "one full-stack app replacing 1k+ excel tables behind $100M+ in quotes.",
        role: "software engineer, webisoft",
        years: "2024",
        stack: "react, express",
    },
    {
        name: "shopify cli + partner dashboard",
        what: "1.1M+ people a day on the partner dashboard; the cli runs in 850 apps a day.",
        role: "software engineer, shopify",
        years: "2022 to 2023",
        stack: "typescript, react, rails, graphql",
        url: "https://www.shopify.com",
    },
];

export const findProduct = (name: string): Product => {
    const product = products.find((p) => p.name === name);
    if (!product) throw new Error(`Unknown product "${name}"`);
    return product;
};
