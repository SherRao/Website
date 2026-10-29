import type { AlsoLed, Film, FounderWork, Paper, Placeholder, WorkLabel } from "./types";

/** Short copy for each panel. Each panel has to fit one screen, so keep these to a sentence or two. */
export const panels = {
    dayjob: {
        n: "i",
        title: "the day job",
        text: "senior software engineer at mappedin, on the blue dot. before that: spur, near, webisoft, shopify and magnet forensics, and eleven years of freelancing that started when i was ten.",
    },
    engineer: {
        n: "ii",
        title: "the engineer",
        text: "what i build when nobody's asking: tab, a karaoke bot, a music social network, this site, and a decade of bots and hackathon projects.",
    },
    stage: {
        n: "iii",
        title: "the stage",
        text: "spurhacks 2025 went from nothing to 1,400+ people in three months: four floors of the old blackberry campus, 291 projects, $100k+ in prizes and a $350k+ budget. i directed it, and at every ceremony i was the stage and production manager, running the cues, the av and the clock.",
    },
    founder: {
        n: "iv",
        title: "the founder",
        text: "founder & ceo of konfer and founder of spurhacks. before that, i started hawkhacks and ran the laurier computing society. right now: a new company, in stealth.",
    },
    off: {
        n: "v",
        title: "off hours",
        text: "the things i do when nobody's paying me: music, films, food, and photos.",
    },
} as const;

/**
 * Organizations started, shown in the founder panel. The stealth company stays "untitled": no name, field, location,
 * link or image.
 */
export const founder: { works: FounderWork[]; stealth: WorkLabel; alsoLed: AlsoLed[] } = {
    works: [
        {
            title: "konfer",
            years: "2024 to now",
            role: "founder & ceo",
            note: "a canadian event, software, and initiatives consultancy that plans and runs hackathons, conferences, networking nights and yacht parties; the team behind spurhacks.",
            url: "https://konfer.ca",
            art: {
                kind: "photo",
                image: "/events/spur-bbq/2.jpg",
                alt: "A SPUR x Konfer sign on the lawn at the BBQ festival",
            },
        },
        {
            title: "spurhacks",
            years: "2025 to now",
            role: "founder & president",
            note: "canada's largest in-person hackathon by project submissions.",
            url: "https://spurhacks.com",
            art: { kind: "counter", to: 1400, suffix: "+", label: "1,400+ people at spurhacks 2025" },
        },
        {
            title: "hawkhacks",
            years: "2021 to 2025",
            role: "founder & president",
            note: "laurier's hackathon: 750 attendees in 2022 and 1,289 in 2024 - the 2nd-largest in-person student run hackathon",
            url: "https://hawkhacks.ca",
            art: {
                kind: "photo",
                image: "/events/hawkhacks/3.jpg",
                alt: "Hackers lining up for pizza in a university atrium at HawkHacks 2024",
            },
        },
    ],
    stealth: { title: "untitled", years: "2026", role: "founder", note: "a new company, in stealth." },
    alsoLed: [
        {
            name: "computing councils of canada",
            role: "executive & founding member",
            years: "oct 2020 to mar 2023",
            note: "one of the founding members of a new non-profit, involved in every department to make sure the infrastructure was in place and the work got done. my main areas were communications and marketing, and systems administration and development, day to day.",
        },
        { name: "laurier computing society", role: "president", years: "2020 to 2024" },
        { name: "brainstorm academy", role: "program coordinator", years: "2022 to 2023" },
    ],
};

/** Papers, shown under "also wrote" in the engineer panel. */
export const writing: Paper[] = [
    {
        title: "Modelling Celestial Motion Through Kepler's Laws and the N-Body Problem",
        short: "kepler + the n-body problem",
    },
    { title: "Milankovitch Cycles, Planetary Motion, & Orbital Elements", short: "milankovitch cycles" },
];

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
