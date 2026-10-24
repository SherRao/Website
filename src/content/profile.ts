import { products } from "./products";
import type { GlanceItem, Link } from "./types";

/** Page title, description and canonical URL, shared by the metadata and the share image. */
export const site = {
    url: "https://sherrao.tech",
    title: "Nausher Rao: engineer, founder, stage manager",
    description:
        "Nausher Rao: senior software engineer at Mappedin, founder of Konfer, and stage manager of SpurHacks, Canada's largest in-person hackathon by project submissions.",
};

export const profile = {
    name: "nausher rao",
    email: "nausher@sherrao.tech",
    place: "waterloo, on",
    headline: { lead: "one person, four jobs,", emphasis: "mostly at the same time." },
    intro: "i've been programming since i was 8. today i'm a senior software engineer at mappedin, where i work on indoor positioning. outside of that, i start companies, run live events, and play in a band.",
    now: {
        org: "mappedin",
        role: "senior software engineer",
        focus: "blue dot + indoor positioning",
        since: "mar 2026",
        until: "nov 2026",
        url: "https://www.mappedin.com",
    },
    education: {
        school: "wilfrid laurier university",
        degree: "bsc computer science, applied mathematics option",
        years: "2019 to 2024",
    },
};

export const letterboxdUser = "SherRao";

export const socials: Link[] = [
    { label: "instagram", href: "https://instagram.com/SherRao15" },
    { label: "github", href: "https://github.com/SherRao" },
    { label: "linkedin", href: "https://linkedin.com/in/nausherrao" },
    { label: "letterboxd", href: `https://letterboxd.com/${letterboxdUser}` },
];

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
    { label: "built", title: `${products.length} products`, detail: "including tab, new in 2026", href: "#engineer" },
];
