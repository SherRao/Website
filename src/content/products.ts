import type { Product } from "./types";

/**
 * Side projects, in order. The engineer panel features four works by name; the rest show as "also built" links.
 * Work done for an employer lives with its job instead.
 */
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
        name: "kabo",
        what: "a karaoke discord bot that scores your pitch and lyrics live.",
        role: "hackathon project",
        years: "2021",
        stack: "javascript, python",
        url: "https://github.com/SherRao/Kabo",
        tag: "hack the north 2020++",
    },
    {
        name: "muspace",
        what: "a social platform built around sharing music and finding people who listen like you.",
        role: "side project",
        years: "2021",
        stack: "javascript",
        url: "https://github.com/SherRao/MuSpace",
    },
    {
        name: "this website",
        what: "a museum in seven panels, with its own content admin. you're standing in it.",
        role: "side project",
        years: "2026",
        stack: "next.js, drizzle, postgres",
        url: "https://github.com/SherRao/Website",
    },
    {
        name: "sherbot",
        what: "a modular discord bot framework: commands, events and timed tasks, with the boilerplate done.",
        role: "side project",
        years: "2021",
        stack: "javascript",
        url: "https://github.com/SherRao/SherBot",
    },
    {
        name: "homestock",
        what: "a simple home inventory system for the elderly.",
        role: "hackathon project",
        years: "2020",
        stack: "java",
        url: "https://github.com/SherRao/HomeStock",
        tag: "winner, openhacks 2020",
    },
    {
        name: "chaterest",
        what: "a bot that moderates discussions and measures what people are interested in.",
        role: "hackathon project",
        years: "2021",
        stack: "javascript",
        url: "https://github.com/SherRao/Chaterest",
        tag: "ru hacks 2021",
    },
    {
        name: "spacestagram",
        what: "image sharing from the final frontier, built for shopify's frontend intern challenge.",
        role: "side project",
        years: "2022",
        stack: "react, firebase",
        url: "https://github.com/SherRao/Spacestagram",
    },
    {
        name: "localify",
        what: "an android app that helps newcomers find their way around their new city.",
        role: "side project",
        years: "2022",
        stack: "java, android, google maps",
        url: "https://github.com/SherRao/Localify",
    },
    {
        name: "maerienette",
        what: "a game in libgdx, from ærsenus studios.",
        role: "side project",
        years: "2020",
        stack: "java, libgdx, box2d",
        url: "https://github.com/SherRao/Maerienette",
    },
    {
        name: "julia",
        what: "a parallel programming final project, in c.",
        role: "course project",
        years: "2023",
        stack: "c",
        url: "https://github.com/SherRao/Julia",
    },
    {
        name: "buddybot",
        what: "a discord bot that shuffles people into voice channels.",
        role: "side project",
        years: "2021",
        stack: "javascript",
        url: "https://github.com/SherRao/BuddyBot",
    },
    {
        name: "freegamenotifier",
        what: "a discord bot that posts free games and discounts.",
        role: "side project",
        years: "2020",
        stack: "java",
        url: "https://github.com/SherRao/FreeGameNotifier",
    },
];

export const findProduct = (name: string): Product => {
    const product = products.find((p) => p.name === name);
    if (!product) throw new Error(`Unknown product "${name}"`);
    return product;
};
