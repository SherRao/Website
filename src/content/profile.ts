import type { GlanceItem, Link } from "./types";

export const profile = {
    name: "nausher rao",
    email: "nausher@sherrao.tech",
    resume: "/Resume%20-%20Nausher%20Rao.pdf",
    place: "waterloo, on",
    headline: { lead: "one person, four jobs,", emphasis: "mostly at the same time." },
    intro: "i've been programming since i was 8. today i'm a senior software engineer at mappedin, where i work on indoor positioning. outside of that, i start companies, run live events, and play in a band.",
    now: {
        org: "mappedin",
        role: "senior software engineer",
        focus: "blue dot + indoor positioning",
        since: "2026",
        url: "https://www.mappedin.com",
    },
    education: {
        school: "wilfrid laurier university",
        degree: "bsc computer science, applied mathematics option",
        years: "2019 to 2024",
    },
};

export const socials: Link[] = [
    { label: "instagram", href: "https://instagram.com/SherRao15" },
    { label: "github", href: "https://github.com/SherRao" },
    { label: "linkedin", href: "https://linkedin.com/in/nausherrao" },
    { label: "letterboxd", href: "https://letterboxd.com/SherRao" },
];

export const letterboxdUser = "SherRao";

export const glance: GlanceItem[] = [
    {
        label: "now",
        title: "mappedin",
        detail: "senior software engineer, indoor positioning & blue dot",
        href: profile.now.url,
    },
    { label: "founder", title: "konfer", detail: "the team behind spurhacks", href: "https://konfer.ca" },
    { label: "next", title: "a new company", detail: "in stealth" },
    { label: "biggest show", title: "1,400+ people", detail: "spurhacks 2025, 291 projects", href: "#stage" },
    { label: "built", title: "7 products", detail: "including tab, new in 2026", href: "#engineer" },
];
