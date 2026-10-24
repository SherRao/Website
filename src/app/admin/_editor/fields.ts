import type { SectionKey } from "@/content/schema";

/**
 * What each section's editor shows. Keys and nesting follow src/content/schema.ts; the schema decides what's valid,
 * this only decides how it's edited.
 */
export type Field =
    | {
          kind: "text";
          key: string;
          label: string;
          optional?: boolean;
          multiline?: boolean;
          hint?: string;
          type?: "url" | "email";
      }
    /** An id that's filled in from another field (the name) if left blank. */
    | { kind: "slug"; key: string; label: string; from: string; hint?: string }
    | { kind: "number"; key: string; label: string; step?: number; hint?: string }
    | { kind: "checkbox"; key: string; label: string; optional?: boolean; hint?: string }
    | { kind: "select"; key: string; label: string; options: { value: number | string; label: string }[] }
    | { kind: "group"; key: string; label: string; fields: Field[] }
    | { kind: "list"; key: string; label: string; item: string; fields: Field[]; summary: string; empty: () => object }
    | { kind: "strings"; key: string; label: string; item: string }
    | { kind: "placeholder"; key: string; label: string; extra?: Field[] }
    | { kind: "upload"; key: string; label: string; upload: "resume" | "photo"; hint?: string }
    | { kind: "productRef"; key: string; label: string; hint?: string };

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
        key: "now",
        label: "Current job",
        fields: [
            { kind: "text", key: "org", label: "Organization" },
            { kind: "text", key: "role", label: "Role" },
            { kind: "text", key: "focus", label: "Focus" },
            { kind: "text", key: "since", label: "Since" },
            { kind: "text", key: "until", label: "Until" },
            { kind: "text", key: "url", label: "Link", type: "url" },
            assumed,
        ],
    },
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
        empty: () => ({ label: "", href: "" }),
    },
    {
        kind: "list",
        key: "glance",
        label: "At a glance",
        item: "glance item",
        summary: "label",
        fields: [
            { kind: "text", key: "label", label: "Label" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "text", key: "detail", label: "Detail" },
            { kind: "text", key: "href", label: "Link", optional: true, hint: "A URL, or #engineer, #stage, ..." },
            assumed,
        ],
        empty: () => ({ label: "", title: "", detail: "" }),
    },
];

const products: Field[] = [
    {
        kind: "list",
        key: "",
        label: "Products",
        item: "product",
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
                kind: "checkbox",
                key: "featured",
                label: "Featured",
                hint: "Shown as a large work in the engineer panel; otherwise a link under “also built”.",
            },
            { kind: "checkbox", key: "isNew", label: "New", optional: true },
            assumed,
        ],
        empty: () => ({ id: "", name: "", what: "", role: "", years: "", featured: false }),
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
                empty: () => ({ value: "", label: "" }),
            },
            assumed,
        ],
        empty: () => ({ id: "", name: "", date: "", place: "", url: "", stats: [{ value: "", label: "" }] }),
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
        empty: () => ({ src: "", alt: "", caption: "", span: { cols: 2, rows: 1 } }),
    },
];

const panels: Field[] = [
    {
        kind: "group",
        key: "panels",
        label: "Panel copy",
        fields: [
            panelCopy("engineer", "The engineer"),
            panelCopy("stage", "The stage"),
            panelCopy("founder", "The founder"),
            panelCopy("off", "Off hours"),
        ],
    },
    {
        kind: "group",
        key: "founderWorks",
        label: "Founder works",
        fields: [
            {
                kind: "group",
                key: "konfer",
                label: "Konfer",
                fields: [
                    ...workLabel,
                    optionalUrl(),
                    { kind: "upload", key: "image", label: "Photo", upload: "photo" },
                    { kind: "text", key: "alt", label: "Photo alt text" },
                    assumed,
                ],
            },
            { kind: "group", key: "spur", label: "Spur", fields: [...workLabel, optionalUrl(), assumed] },
            {
                kind: "group",
                key: "seahorse",
                label: "Product work",
                fields: [
                    {
                        kind: "productRef",
                        key: "productId",
                        label: "Product",
                        hint: "Shows this product's name, years, role and description.",
                    },
                ],
            },
            {
                kind: "group",
                key: "stealth",
                label: "Stealth company",
                fields: [...workLabel, assumed],
            },
        ],
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
        empty: () => ({ title: "", year: new Date().getFullYear(), watched: "", rating: 0 }),
    },
];

export const SECTIONS: Record<SectionKey, { title: string; description: string; fields: Field[] }> = {
    profile: {
        title: "Profile",
        description: "Name, headline, intro, current job, socials, “at a glance”, the resume and the page metadata.",
        fields: profile,
    },
    products: { title: "Products", description: "Everything built, and which ones are featured.", fields: products },
    events: { title: "Events", description: "Events, their stats, and the stage photo mosaic.", fields: events },
    panels: {
        title: "Panels",
        description: "Panel copy, founder works, off-hours cards and the fallback films.",
        fields: panels,
    },
};
