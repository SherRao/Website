import type { GameProject, MusicTrack } from "./types";

/**
 * NOTE: This is placeholder content for the music + game design sections.
 * Swap the `cover` paths, titles, descriptions, and `todo: true` flags as real
 * tracks and game projects come online.
 */

export const music: MusicTrack[] = [
    {
        title: "side a / track 01",
        type: "lo-fi instrumental",
        year: "2024",
        cover: "/creative/music-1.svg",
        description:
            "a slow, vinyl-warm loop built around a single jazz piano sample and a half-time drum kit.",
        duration: "2:48",
        todo: true,
    },
    {
        title: "midnight in waterloo",
        type: "lo-fi · single",
        year: "2024",
        cover: "/creative/music-2.svg",
        description:
            "made in a single late-night session after a long day of shipping — soft keys, brushed drums, no vocals.",
        duration: "3:12",
        todo: true,
    },
    {
        title: "demo / 03",
        type: "ambient electronic",
        year: "2024",
        cover: "/creative/music-3.svg",
        description:
            "an unreleased sketch — long pads, a single arpeggiator, room to breathe between the notes.",
        duration: "4:21",
        todo: true,
    },
    {
        title: "pulse",
        type: "instrumental",
        year: "2025",
        cover: "/creative/music-4.svg",
        description:
            "the most recent thing i've made — a four-on-the-floor groove with a bassline that does most of the work.",
        duration: "3:46",
        todo: true,
    },
];

export const games: GameProject[] = [
    {
        title: "Dragon's Spire",
        type: "minecraft rpg plugin",
        year: "2018 → ongoing",
        cover: "/creative/game-1.svg",
        description:
            "the project that turned a 12-year-old into a software engineer — a minecraft server with custom items, mobs, quests, and a small economy. still maintained for a tiny private community.",
        stack: ["Java", "Spigot", "Paper", "MySQL"],
        todo: true,
    },
    {
        title: "Untitled Roguelite",
        type: "unity prototype",
        year: "2024 — wip",
        cover: "/creative/game-2.svg",
        description:
            "a 2d top-down roguelite prototype i pick up between sprints. procedurally-generated rooms, a single deck-building loop, no scope creep allowed.",
        stack: ["Unity", "C#", "Aseprite"],
        todo: true,
    },
    {
        title: "Konfer Quest",
        type: "browser mini",
        year: "2025",
        cover: "/creative/game-3.svg",
        description:
            "an in-house micro-game we built at konfer for a holiday campaign — pure html canvas, sprite sheets, and a single jingle that lived in everyone's head for a week.",
        stack: ["TypeScript", "Canvas API", "Howler"],
        todo: true,
    },
];
