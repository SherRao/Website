import type { Product } from "@/content/types";

/**
 * Everything built. Featured products show as large works in the engineer panel, in this order; the rest show as
 * links under "also built", in this order.
 */
export const products: Product[] = [
    {
        id: "blue-dot",
        name: "blue dot",
        what: "indoor positioning: the part of an indoor map that knows where you are, where gps gives up.",
        role: "senior software engineer, mappedin",
        years: "mar 2026 to nov 2026",
        url: "https://www.mappedin.com",
        featured: true,
        // The Mappedin start date is not confirmed yet.
        assumed: true,
    },
    {
        id: "tab",
        name: "tab",
        isNew: true,
        what: "a shared expense tracker for trips and events. scan a receipt, tag who got what, and it works out who owes whom in the fewest payments.",
        role: "side project",
        years: "2026",
        stack: "next.js, drizzle, postgres, tesseract.js",
        url: "https://github.com/SherRao/Tab",
        featured: true,
    },
    {
        id: "spurhacks-platform",
        name: "spurhacks platform",
        what: "applications, ticketing, scheduling and networking for canada's largest in-person hackathon.",
        role: "product owner, konfer",
        years: "2025",
        stack: "react, typescript, go",
        url: "https://spurhacks.com",
        featured: false,
    },
    {
        id: "spur-investor-platform",
        name: "spur investor platform",
        what: "an investor-ready platform that cut startup onboarding from 3+ months to a couple of weeks.",
        role: "project manager, spur",
        years: "2024 to 2025",
        stack: "react, typescript, go",
        featured: false,
    },
    {
        id: "seahorse",
        name: "seahorse",
        what: "privacy-first mental health app; the mvp helped raise $750k.",
        role: "technical product lead, near",
        years: "2024",
        stack: "next.js, python, on-device rag, webllm",
        featured: false,
    },
    {
        id: "rfq-dashboard",
        name: "rfq dashboard",
        what: "one full-stack app replacing 1k+ excel tables behind $100M+ in quotes.",
        role: "software engineer, webisoft",
        years: "2024",
        stack: "react, express",
        featured: false,
    },
    {
        id: "shopify",
        name: "shopify cli + partner dashboard",
        what: "1.1M+ people a day on the partner dashboard; the cli runs in 850 apps a day.",
        role: "software engineer, shopify",
        years: "2022 to 2023",
        stack: "typescript, react, rails, graphql",
        url: "https://www.shopify.com",
        featured: true,
    },
];
