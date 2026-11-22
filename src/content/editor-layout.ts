import type { SectionLayout as ContractSectionLayout, Empty, LayoutField, UploadRules } from "@/lib/admin-contract";
import { UPLOADS, type UploadKind } from "@/lib/upload-rules";
import type { SectionKey } from "./schema";

/**
 * What each section's editor shows. Keys and nesting follow src/content/schema.ts; the schema decides what's valid,
 * this only decides how it's edited. It's the contract's layout type (src/lib/admin-contract.ts): plain data, served
 * to the admin app in the manifest.
 */
export type Field = LayoutField<UploadKind>;
export type SectionLayout = ContractSectionLayout<UploadKind>;
export type { Empty, UploadRules };

const uploadRules = (kind: UploadKind): UploadRules => {
    const { types, accept, maxBytes, prefix, extensions, wrongType } = UPLOADS[kind];
    return { types: [...types], accept, maxBytes, prefix, extensions: { ...extensions }, wrongType };
};

/** The upload kinds an upload field can name, taken from the upload route's own rules so the two can't disagree. */
export const UPLOAD_KINDS: Record<UploadKind, UploadRules> = {
    resume: uploadRules("resume"),
    photo: uploadRules("photo"),
};

const assumed: Field = {
    kind: "checkbox",
    key: "assumed",
    label: "Assumed (not confirmed yet)",
    optional: true,
};

const optionalUrl = (label = "Link"): Field => ({ kind: "text", key: "url", label, optional: true, type: "url" });

const panelCopy = (key: string, label: string): Field => ({
    kind: "group",
    key,
    label,
    fields: [
        { kind: "text", key: "n", label: "Numeral" },
        { kind: "text", key: "title", label: "Title" },
        { kind: "text", key: "text", label: "Text", multiline: true, hint: "Keep it to a sentence or two." },
    ],
});

const workLabel: Field[] = [
    { kind: "text", key: "title", label: "Title" },
    { kind: "text", key: "years", label: "Years" },
    { kind: "text", key: "role", label: "Role" },
    { kind: "text", key: "note", label: "Note", multiline: true },
];

const counterFields: Field[] = [
    { kind: "number", key: "to", label: "Number", hint: "Counts up to this, like 1400." },
    { kind: "text", key: "prefix", label: "Before the number", optional: true },
    { kind: "text", key: "suffix", label: "After the number", optional: true },
    {
        kind: "text",
        key: "label",
        label: "Read aloud as",
        hint: "What a screen reader says, like “1,400+ people”.",
    },
];

const month = (key: string, label: string, optional = false): Field => ({
    kind: "text",
    key,
    label,
    optional,
    hint: optional ? "Year-month, like 2024-09. Leave blank if it's ongoing." : "Year-month, like 2022-05.",
});

const jobs: Field[] = [
    {
        kind: "list",
        key: "jobs",
        label: "Jobs",
        item: "job",
        summary: "org",
        fields: [
            { kind: "text", key: "org", label: "Organization" },
            { kind: "slug", key: "id", label: "Id", from: "org", hint: "Made from the organization if left blank." },
            { kind: "text", key: "line", label: "One line about the work", multiline: true },
            optionalUrl(),
            {
                kind: "text",
                key: "link",
                label: "Story on this page",
                optional: true,
                hint: "An anchor like #founder. The name links here instead of to the site.",
            },
            { kind: "text", key: "place", label: "Place", optional: true },
            {
                kind: "list",
                key: "stints",
                label: "Stints",
                item: "stint",
                summary: "start",
                fields: [
                    { kind: "text", key: "role", label: "Role" },
                    month("start", "Started"),
                    month("end", "Ended", true),
                ],
                empty: { role: "", start: "" },
            },
            {
                kind: "checkbox",
                key: "show",
                label: "Shown in the day job panel",
                hint: "Hidden jobs are kept here, just not shown.",
            },
            assumed,
        ],
        empty: { id: "", org: "", line: "", stints: [{ role: "", start: "" }], show: true },
    },
];

const profile: Field[] = [
    {
        kind: "group",
        key: "site",
        label: "Site metadata",
        fields: [
            { kind: "text", key: "url", label: "Site URL", type: "url" },
            { kind: "text", key: "title", label: "Page title" },
            { kind: "text", key: "description", label: "Description", multiline: true },
        ],
    },
    { kind: "text", key: "name", label: "Name" },
    { kind: "text", key: "email", label: "Email", type: "email" },
    { kind: "text", key: "place", label: "Place" },
    {
        kind: "group",
        key: "resume",
        label: "Resume",
        fields: [
            {
                kind: "upload",
                key: "url",
                label: "Resume PDF",
                upload: "resume",
                hint: "/resume and /resume.pdf send visitors here. Upload a PDF, then save.",
            },
        ],
    },
    {
        kind: "group",
        key: "headline",
        label: "Headline",
        fields: [
            { kind: "text", key: "lead", label: "Lead" },
            { kind: "text", key: "emphasis", label: "Emphasis (italic)" },
        ],
    },
    { kind: "text", key: "intro", label: "Intro", multiline: true },
    {
        kind: "group",
        key: "education",
        label: "Education",
        fields: [
            { kind: "text", key: "school", label: "School" },
            { kind: "text", key: "degree", label: "Degree" },
            { kind: "text", key: "years", label: "Years" },
            assumed,
        ],
    },
    { kind: "text", key: "letterboxdUser", label: "Letterboxd username" },
    {
        kind: "list",
        key: "socials",
        label: "Socials",
        item: "social link",
        summary: "label",
        fields: [
            { kind: "text", key: "label", label: "Label" },
            { kind: "text", key: "href", label: "Link", type: "url" },
        ],
        empty: { label: "", href: "" },
    },
    {
        kind: "list",
        key: "glance",
        label: "At a glance",
        item: "glance item",
        summary: "label",
        fields: [
            {
                kind: "text",
                key: "label",
                label: "Label",
                hint: "An item labelled “now” takes its title and link from the newest job shown in the day job panel.",
            },
            { kind: "text", key: "title", label: "Title", hint: "Write {products} for the number of side projects." },
            { kind: "text", key: "detail", label: "Detail" },
            { kind: "text", key: "href", label: "Link", optional: true, hint: "A URL, or #engineer, #stage, ..." },
            assumed,
        ],
        empty: { label: "", title: "", detail: "" },
    },
];

const products: Field[] = [
    {
        kind: "list",
        key: "",
        label: "Side projects",
        item: "side project",
        summary: "name",
        fields: [
            { kind: "text", key: "name", label: "Name" },
            {
                kind: "slug",
                key: "id",
                label: "Id",
                from: "name",
                hint: "Lowercase, with dashes. Made from the name if left blank. Other content refers to this.",
            },
            { kind: "text", key: "what", label: "Description", multiline: true },
            { kind: "text", key: "role", label: "Role" },
            { kind: "text", key: "years", label: "Years" },
            { kind: "text", key: "stack", label: "Stack", optional: true },
            optionalUrl(),
            {
                kind: "text",
                key: "tag",
                label: "Tag",
                optional: true,
                hint: "A short note on its “also built” link, like “winner, openhacks 2020”.",
            },
            {
                kind: "checkbox",
                key: "featured",
                label: "Featured",
                hint: "Shown as a large work in the engineer panel; otherwise a link under “also built”.",
            },
            { kind: "checkbox", key: "isNew", label: "New", optional: true },
            assumed,
        ],
        empty: { id: "", name: "", what: "", role: "", years: "", featured: false },
    },
];

const events: Field[] = [
    {
        kind: "list",
        key: "events",
        label: "Events",
        item: "event",
        summary: "name",
        fields: [
            { kind: "text", key: "name", label: "Name" },
            { kind: "slug", key: "id", label: "Id", from: "name", hint: "Made from the name if left blank." },
            { kind: "text", key: "date", label: "Date" },
            { kind: "text", key: "place", label: "Place" },
            { kind: "text", key: "url", label: "Link", type: "url" },
            {
                kind: "list",
                key: "stats",
                label: "Stats",
                item: "stat",
                summary: "label",
                fields: [
                    { kind: "text", key: "value", label: "Value" },
                    { kind: "text", key: "label", label: "Label" },
                    assumed,
                ],
                empty: { value: "", label: "" },
            },
            assumed,
        ],
        empty: { id: "", name: "", date: "", place: "", url: "", stats: [{ value: "", label: "" }] },
    },
    {
        kind: "list",
        key: "stagePhotos",
        label: "Stage photos",
        item: "photo",
        summary: "caption",
        fields: [
            { kind: "upload", key: "src", label: "Photo", upload: "photo" },
            { kind: "text", key: "alt", label: "Alt text", hint: "Describe the photo for people who can't see it." },
            { kind: "text", key: "caption", label: "Caption" },
            {
                kind: "group",
                key: "span",
                label: "Size in the mosaic",
                fields: [
                    {
                        kind: "select",
                        key: "cols",
                        label: "Columns",
                        options: [
                            { value: 2, label: "2 (small)" },
                            { value: 4, label: "4 (large)" },
                        ],
                    },
                    {
                        kind: "select",
                        key: "rows",
                        label: "Rows",
                        options: [
                            { value: 1, label: "1" },
                            { value: 2, label: "2" },
                            { value: 3, label: "3" },
                        ],
                    },
                ],
            },
        ],
        empty: { src: "", alt: "", caption: "", span: { cols: 2, rows: 1 } },
    },
];

/** `year` is what a new fallback film starts with: the year the layout is read in. */
const panels = (year: number): Field[] => [
    {
        kind: "group",
        key: "panels",
        label: "Panel copy",
        fields: [
            panelCopy("dayjob", "The day job"),
            panelCopy("engineer", "The engineer"),
            panelCopy("stage", "The stage"),
            panelCopy("founder", "The founder"),
            panelCopy("off", "Off hours"),
        ],
    },
    {
        kind: "group",
        key: "founder",
        label: "Founder panel",
        fields: [
            {
                kind: "list",
                key: "works",
                label: "Organizations started",
                item: "organization",
                summary: "title",
                fields: [
                    ...workLabel,
                    optionalUrl(),
                    {
                        kind: "variant",
                        key: "art",
                        label: "Art",
                        optional: { label: "Nothing (a blank frame)" },
                        options: [
                            {
                                value: "photo",
                                label: "A photo",
                                fields: [
                                    { kind: "upload", key: "image", label: "Photo", upload: "photo" },
                                    { kind: "text", key: "alt", label: "Photo alt text" },
                                ],
                                empty: { image: "", alt: "" },
                            },
                            {
                                value: "counter",
                                label: "A number that counts up",
                                fields: counterFields,
                                empty: { to: 0, label: "" },
                            },
                        ],
                    },
                    assumed,
                ],
                empty: { title: "", years: "", role: "", note: "" },
            },
            {
                kind: "group",
                key: "stealth",
                label: "Stealth company",
                fields: [...workLabel, assumed],
            },
            {
                kind: "list",
                key: "alsoLed",
                label: "Also led",
                item: "organization",
                summary: "name",
                fields: [
                    { kind: "text", key: "name", label: "Name" },
                    { kind: "text", key: "role", label: "Role" },
                    { kind: "text", key: "years", label: "Years" },
                    optionalUrl(),
                    { kind: "text", key: "note", label: "Note (hover text)", optional: true, multiline: true },
                    assumed,
                ],
                empty: { name: "", role: "", years: "" },
            },
        ],
    },
    {
        kind: "list",
        key: "writing",
        label: "Papers (“papers written”)",
        item: "paper",
        summary: "short",
        fields: [
            { kind: "text", key: "title", label: "Full title" },
            {
                kind: "text",
                key: "short",
                label: "Short title",
                hint: "Shown on the page. The full title shows on hover.",
            },
            { kind: "number", key: "year", label: "Year", optional: true },
            optionalUrl(),
        ],
        empty: { title: "", short: "" },
    },
    {
        kind: "group",
        key: "offHours",
        label: "Off hours",
        fields: [
            {
                kind: "group",
                key: "listening",
                label: "Music I listen to",
                fields: [{ kind: "text", key: "hint", label: "Shown when nothing is playing" }],
            },
            { kind: "placeholder", key: "making", label: "Music I make (the band)" },
            { kind: "placeholder", key: "photography", label: "Photography" },
            {
                kind: "placeholder",
                key: "cooking",
                label: "Cooking",
                extra: [{ kind: "strings", key: "prompts", label: "Prompts", item: "prompt" }],
            },
        ],
    },
    {
        kind: "list",
        key: "fallbackFilms",
        label: "Fallback films",
        item: "film",
        summary: "title",
        fields: [
            { kind: "text", key: "title", label: "Title" },
            { kind: "number", key: "year", label: "Year" },
            { kind: "text", key: "watched", label: "Watched", hint: "Like “sep 18”." },
            { kind: "number", key: "rating", label: "Rating", step: 0.5, hint: "0 to 5." },
        ],
        empty: { title: "", year, watched: "", rating: 0 },
    },
];

/** Each section's title and description: what the admin's navigation and page titles show. */
export const SECTIONS: Record<SectionKey, { title: string; description: string }> = {
    profile: {
        title: "Profile",
        description: "Name, headline, intro, current job, socials, “at a glance”, the resume and the page metadata.",
    },
    products: {
        title: "Side projects",
        description: "What's built on the side, which ones are featured, and their tags.",
    },
    events: { title: "Events", description: "Events, their stats, and the stage photo mosaic." },
    panels: {
        title: "Panels",
        description: "Panel copy, the founder panel, papers, off-hours cards and the fallback films.",
    },
    jobs: {
        title: "Jobs",
        description: "The day job panel: every job, its stints, and which ones are shown.",
    },
};

/**
 * Every section's editing layout. Built when it's read, so defaults that depend on the date (a new fallback film's
 * year) are current; read it at request time, not once at startup or in a prerendered page.
 */
export const editorLayout = (now = new Date()): Record<SectionKey, SectionLayout> => {
    const fields: Record<SectionKey, Field[]> = {
        profile,
        products,
        events,
        panels: panels(now.getFullYear()),
        jobs,
    };
    return Object.fromEntries(
        Object.entries(SECTIONS).map(([key, info]) => [key, { ...info, fields: fields[key as SectionKey] }]),
    ) as Record<SectionKey, SectionLayout>;
};
