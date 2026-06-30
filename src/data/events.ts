import type { Event } from "./types";

export const events: Event[] = [
    {
        name: "SpurHacks 2025",
        short: "Canada's largest in-person hackathon by project submissions.",
        meta: "Waterloo, ON · Jun 20 – Jun 22, 2025",
        description:
            "One of Canada's largest hackathons built from the ground up in 3 months — 50+ staff, 1,400+ attendees, 291 project submissions, 5M+ social media impressions, $100k+ in prizes, and a $350k+ budget. Sponsors included BMO, NDAX, Indomie, RBC, and Fantuan among others. The city and region resonated with this event, and representatives were even in attendance.",
        images: [
            "/events/spurhacks/1.png",
            "/events/spurhacks/2.png",
            "/events/spurhacks/3.png",
            "/events/spurhacks/4.png",
            "/events/spurhacks/5.png",
        ],
        url: "https://spurhacks.com",
        accent: "#ffd074",
        stats: [
            { label: "Attendees", value: "1,400+" },
            { label: "Submissions", value: "291" },
            { label: "Prize Pool", value: "$100k+" },
            { label: "Budget", value: "$350k+" },
        ],
    },
    {
        name: "HawkHacks 2024",
        short: "Second-largest in-person student-run hackathon at the time.",
        meta: "Waterloo, ON · May 17 – May 19, 2024",
        description:
            "The second-largest in-person student-run hackathon at the time — 1,289 registrants, 900 RSVPs, 35 sponsors, and $180k+ in prizes. Sponsors included Avalanche, NEAR Protocol, Fantuan, Dominos, Indomie, NordVPN, and FDM Group. This event broke records previously set at Wilfrid Laurier University by a wide margin.",
        images: [
            "/events/hawkhacks/1.png",
            "/events/hawkhacks/2.png",
            "/events/hawkhacks/3.png",
            "/events/hawkhacks/4.png",
            "/events/hawkhacks/5.png",
        ],
        url: "https://hawkhacks.ca",
        accent: "#17f1d1",
        stats: [
            { label: "Registrants", value: "1,289" },
            { label: "Sponsors", value: "35" },
            { label: "Prize Pool", value: "$180k+" },
            { label: "RSVPs", value: "900" },
        ],
    },
    {
        name: "Collision Yacht Soirée",
        short: "Largest side-event at Collision 2024 — aboard the largest yacht on Lake Ontario.",
        meta: "Toronto, ON · Jun 17, 2024",
        description:
            "The largest side-event at Collision 2024, hosted aboard the largest yacht on Lake Ontario. A curated evening of conversations between founders, investors, and operators across the Web3 ecosystem.",
        images: [
            "/events/near-yacht/1.png",
            "/events/near-yacht/2.png",
            "/events/near-yacht/3.png",
            "/events/near-yacht/4.png",
            "/events/near-yacht/5.png",
        ],
        url: "https://luma.com/8iwq9lxb",
        accent: "#a374ff",
        stats: [
            { label: "Tier", value: "Headline" },
            { label: "Venue", value: "Yacht" },
            { label: "Lake", value: "Ontario" },
            { label: "Year", value: "2024" },
        ],
    },
    {
        name: "SPUR Community BBQ Festival",
        short: "300-person networking festival with pitch comp, food, and a live band.",
        meta: "Waterloo, ON · Oct 26, 2024",
        description:
            "A 300-person networking event with a $28k budget, featuring a business pitch-competition, freshly-made food and desserts, a live band, and more — designed to give the Waterloo founder community a real festival to call its own.",
        images: [
            "/events/spur-bbq/1.png",
            "/events/spur-bbq/2.png",
            "/events/spur-bbq/3.png",
            "/events/spur-bbq/4.png",
            "/events/spur-bbq/5.png",
        ],
        url: "https://luma.com/aouu9bsq",
        accent: "#ffd074",
        stats: [
            { label: "Attendees", value: "300" },
            { label: "Budget", value: "$28k" },
            { label: "Format", value: "Festival" },
            { label: "Live Band", value: "Yes" },
        ],
    },
];
