import type { Project } from "./types";

export const projects: Project[] = [
    {
        name: "Konfer",
        tag: "AI Platform",
        year: "2024",
        role: "Founder, CEO, Engineering",
        accent: "#a374ff",
        image: "/favicon.png",
        url: "https://konfer.ca",
        description:
            "AI products for sales and customer experience teams — built and shipped from a Toronto founding team.",
        stack: ["Next.js", "TypeScript", "Postgres", "OpenAI"],
    },
    {
        name: "SpurHacks",
        tag: "Hackathon",
        year: "2025",
        role: "Director",
        accent: "#ffd074",
        image: "/events/spurhacks/2.png",
        url: "https://spurhacks.com",
        description:
            "Canada's largest in-person hackathon by project submissions — 1,400+ attendees, 291 submissions, $100k+ in prizes.",
        stack: ["Live Production", "$350k Budget", "50+ Staff"],
    },
    {
        name: "HawkHacks",
        tag: "Hackathon",
        year: "2024",
        role: "Director",
        accent: "#17f1d1",
        image: "/events/hawkhacks/2.png",
        url: "https://hawkhacks.ca",
        description:
            "Second-largest in-person student-run hackathon at the time — 1,289 registrants, 35 sponsors, $180k+ in prizes.",
        stack: ["Live Production", "Sponsorships", "Logistics"],
    },
    {
        name: "SPUR Community",
        tag: "Community",
        year: "2023",
        role: "Co-Founder",
        accent: "#ffd074",
        image: "/events/spur-bbq/2.png",
        url: "https://spur.community",
        description:
            "A founder community in Waterloo running networking events, pitch competitions, and BBQ festivals for 300+ builders.",
        stack: ["Operations", "Branding", "Events"],
    },
    {
        name: "This Website",
        tag: "Portfolio",
        year: "2026",
        role: "Designer & Engineer",
        accent: "#a374ff",
        image: "/naush.png",
        url: "https://github.com/SherRao",
        description:
            "The site you're looking at. Built with Next.js, Tailwind, Motion, and a healthy obsession with type and motion details.",
        stack: ["Next.js", "Tailwind v4", "Motion", "R3F"],
    },
];
