import type { Film, Placeholder } from "./types";

/** Short copy for each panel. Each panel has to fit one screen, so keep these to a sentence or two. */
export const panels = {
    engineer: {
        n: "i",
        title: "the engineer",
        text: "senior software engineer at mappedin, on the blue dot. before that: shopify, webisoft and magnet forensics. on the side, i build things like tab.",
    },
    stage: {
        n: "ii",
        title: "the stage",
        text: "SpurHacks 2025 went from nothing to 1,400+ people in three months: four floors of the old BlackBerry campus, 291 projects, $100k+ in prizes and a $350k+ budget. I directed it, and at every ceremony I was the stage and production manager, running the cues, the AV and the clock.",
    },
    founder: {
        n: "iii",
        title: "the founder",
        text: "founder & ceo of konfer, the team behind spurhacks. before that, pm at spur innovation center and technical product at near. right now: a new company, in stealth.",
    },
    off: {
        n: "iv",
        title: "off hours",
        text: "the things i do when nobody's paying me: music, films, food, and photos.",
    },
} as const;

export type PanelId = keyof typeof panels;

/** Founder works. The stealth company stays "untitled": no name, field, location or link. */
export const founderWorks = {
    konfer: {
        title: "konfer",
        years: "2024 to now",
        role: "founder & ceo",
        note: "the team behind spurhacks, and the platform that ran it.",
        url: "https://konfer.ca",
        image: "/events/spur-bbq/2.jpg",
        alt: "A SPUR x Konfer sign on the lawn at the BBQ festival",
    },
    spur: {
        title: "spur innovation center",
        years: "2024 to 2025",
        role: "project manager",
        note: "$1M+ invested; 12 of 15 startups hit their q1 okrs.",
    },
    seahorse: {
        title: "seahorse",
        years: "2024",
        role: "technical product lead, near",
        note: "privacy-first mental health app; the mvp helped raise $750k.",
    },
    stealth: { title: "untitled", years: "2026", role: "founder", note: "a new company, in stealth." },
};

export const offHours: {
    listening: { hint: string };
    making: Placeholder;
    photography: Placeholder;
    cooking: Placeholder & { prompts: string[] };
} = {
    listening: { hint: "live from spotify: what's playing now." },
    making: { needed: true, hint: "the band, what i play, and a couple of recordings." },
    photography: { needed: true, hint: "pictures i've taken and pictures i love." },
    cooking: {
        needed: true,
        hint: "what i've been cooking lately, and the one dish i'd make for you.",
        prompts: ["a recipe", "a photo", "a go-to dish"],
    },
};

/** Shown when the live Letterboxd feed can't be reached. Real entries from letterboxd.com/SherRao. */
export const fallbackFilms: Film[] = [
    { title: "resident evil", year: 2026, watched: "sep 18", rating: 3 },
    { title: "the odyssey", year: 2026, watched: "aug 3", rating: 4.5 },
    { title: "dunkirk", year: 2017, watched: "aug 1", rating: 4.5 },
    { title: "a house of dynamite", year: 2025, watched: "aug 1", rating: 4 },
];
