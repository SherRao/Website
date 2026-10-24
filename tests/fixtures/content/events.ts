import type { Events } from "@/content/types";

export const events: Events = {
    events: [
        {
            id: "spurhacks",
            name: "spurhacks 2025",
            date: "jun 20 to 22, 2025",
            place: "blackberry campus, waterloo",
            url: "https://spurhacks.com",
            stats: [
                { value: "1,400+", label: "attendees" },
                { value: "291", label: "projects" },
                { value: "$100k+", label: "in prizes" },
            ],
        },
        // The organizer role at HawkHacks, Collision and the BBQ is not confirmed yet.
        {
            id: "hawkhacks",
            name: "hawkhacks 2024",
            date: "may 17 to 19, 2024",
            place: "wilfrid laurier university, waterloo",
            url: "https://hawkhacks.ca",
            stats: [
                { value: "1,289", label: "registrants" },
                { value: "35", label: "sponsors" },
            ],
            assumed: true,
        },
        {
            id: "yacht",
            name: "collision yacht soirée",
            date: "jun 17, 2024",
            place: "lake ontario, toronto",
            url: "https://luma.com/8iwq9lxb",
            stats: [{ value: "#1", label: "side event at collision" }],
            assumed: true,
        },
        {
            id: "bbq",
            name: "spur community bbq festival",
            date: "oct 26, 2024",
            place: "waterloo",
            url: "https://luma.com/aouu9bsq",
            stats: [{ value: "300", label: "people" }],
            assumed: true,
        },
    ],
    /** The stage mosaic, in reading order. The 8-column grid packs these densely; SpurHacks leads. */
    stagePhotos: [
        {
            src: "/events/spurhacks/2.jpg",
            alt: "The SpurHacks 2025 audience under violet stage light",
            caption: "spurhacks 2025",
            span: { cols: 4, rows: 3 },
        },
        {
            src: "/events/spurhacks/6.jpg",
            alt: "Camera and stage crew filming at SpurHacks 2025",
            caption: "spurhacks 2025, camera + stage crew",
            span: { cols: 2, rows: 2 },
        },
        {
            src: "/events/near-yacht/3.jpg",
            alt: "Guests crowded on the deck of the Collision yacht party",
            caption: "collision yacht soirée 2024",
            span: { cols: 2, rows: 2 },
        },
        {
            src: "/events/hawkhacks/2.jpg",
            alt: "A packed auditorium at HawkHacks 2024",
            caption: "hawkhacks 2024",
            span: { cols: 2, rows: 1 },
        },
        {
            src: "/events/spur-bbq/4.jpg",
            alt: "Friends at a table at the SPUR BBQ festival",
            caption: "spur bbq festival 2024",
            span: { cols: 2, rows: 1 },
        },
        {
            src: "/events/spurhacks/4.jpg",
            alt: "Attendees arriving under balloons at SpurHacks 2025",
            caption: "spurhacks 2025, doors open",
            span: { cols: 2, rows: 1 },
        },
        {
            src: "/events/hawkhacks/4.jpg",
            alt: "Hackers working in a lecture hall at HawkHacks 2024",
            caption: "hawkhacks 2024",
            span: { cols: 2, rows: 1 },
        },
        {
            src: "/events/spur-bbq/3.jpg",
            alt: "An audience watching pitches at the SPUR BBQ festival",
            caption: "spur bbq festival 2024, pitches",
            span: { cols: 2, rows: 1 },
        },
        {
            src: "/events/near-yacht/1.jpg",
            alt: "The Toronto skyline at night from the yacht",
            caption: "toronto from the yacht",
            span: { cols: 2, rows: 1 },
        },
    ],
};
