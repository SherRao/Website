import { latestStint } from "./dates";
import type { Job } from "./types";

/** Every job, from the resume and LinkedIn. Hidden jobs are kept but not shown in the day job panel. */
export const jobs: Job[] = [
    {
        id: "mappedin",
        org: "mappedin",
        url: "https://www.mappedin.com",
        place: "waterloo, on",
        line: "owned blue dot and indoor positioning as its sole engineer and pm, on maps used by MLB, USTA (US Open), University of Texas, Simon Property Group, Hudson Yards, Cadillac Fairview, AT&T Stadium, and airports like PIT, MIA, LAX, YYC, and KEF",
        // assumed: the Mappedin start date is not confirmed yet.
        stints: [{ role: "senior software engineer", start: "2026-03", end: "2026-11" }],
        show: true,
    },
    {
        id: "spur",
        org: "spur innovation center",
        place: "waterloo, on",
        line: "managed $1M+ in startup funding across 15 ventures; 12 of 15 hit their q1 okrs while running one of the largest in-person hackathons in Canada",
        stints: [{ role: "project manager", start: "2024-09", end: "2025-10" }],
        show: true,
    },
    {
        id: "konfer",
        org: "konfer",
        url: "https://konfer.ca",
        place: "waterloo, on",
        line: "a canadian event, software, and initiatives consultancy that plans and runs hackathons, conferences, networking nights and yacht parties.",
        link: "#founder",
        stints: [{ role: "founder & ceo", start: "2024-07" }],
        show: true,
    },
    {
        id: "webisoft",
        org: "webisoft",
        place: "montreal, qc",
        line: "replaced 1k+ excel tables behind $100M+ in RFQs with one web app.",
        stints: [{ role: "software engineer", start: "2024-07", end: "2024-10" }],
        show: true,
    },
    {
        id: "near",
        org: "near protocol",
        place: "toronto, on",
        line: "took seahorse, a privacy-first mental health app, from concept to an mvp that helped raise $750k.",
        stints: [{ role: "director of technical product & growth", start: "2024-05", end: "2024-09" }],
        show: true,
    },
    {
        id: "shopify",
        org: "shopify",
        url: "https://www.shopify.com",
        place: "toronto, on",
        line: "the shopify cli, run by 850 apps a day, and the partner dashboard, used by 1.1M+ people a day.",
        stints: [
            { role: "software engineer", start: "2022-05", end: "2022-08" },
            { role: "software engineer", start: "2023-01", end: "2023-04" },
        ],
        show: true,
    },
    {
        id: "magnet-forensics",
        org: "magnet forensics",
        place: "waterloo, on",
        line: "jenkins pipelines and an internal build dashboard for 100+ engineers.",
        stints: [{ role: "software engineer", start: "2021-09", end: "2021-12" }],
        show: true,
    },
    {
        id: "laurier-ta",
        org: "wilfrid laurier university",
        place: "waterloo, on",
        line: "taught python, data structures and microprocessors.",
        stints: [{ role: "computer science teaching assistant", start: "2020-09", end: "2023-12" }],
        show: false,
    },
    {
        id: "brainstorm-academy",
        org: "brainstorm academy",
        place: "burlington, on",
        line: "wrote and taught intro programming and game development courses for middle-school students.",
        stints: [{ role: "computer science program coordinator & tutor", start: "2022-01", end: "2023-12" }],
        show: false,
    },
    {
        id: "grand-cinnamon",
        org: "grand cinnamon banquet & convention",
        place: "markham, on",
        line: "ran sound and lights for banquets and conventions.",
        stints: [{ role: "audio visual technician", start: "2019-01", end: "2019-03" }],
        show: false,
    },
    {
        id: "freelance",
        org: "freelance",
        line: "about 80 clients, mostly plugins for game servers of 750 to 50k players. i started at ten.",
        stints: [{ role: "software developer", start: "2011-08", end: "2022-07" }],
        show: true,
    },
];

/** The jobs shown in the day job panel, newest first (by when their latest stint started). */
export const shownJobs = (list: Job[] = jobs) =>
    list
        .filter((j) => j.show)
        .map((job) => ({ job, start: latestStint(job.stints).start }))
        .sort((a, b) => b.start.localeCompare(a.start))
        .map(({ job }) => job);
