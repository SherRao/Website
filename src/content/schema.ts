import { z } from "zod";
import { MONTH } from "./dates";

/**
 * The shape of every piece of site content. The admin panel validates saves with these schemas, the site validates
 * what it reads with them, and the TypeScript types in `types.ts` are inferred from them.
 */

const text = z.string().trim().min(1, "Required");

const BASE = "https://x.invalid";

/**
 * A path on this site. Resolved the way a browser would, so "//host", "/\host" and "/<tab>/host" (all read as
 * another host) are rejected.
 */
const isSitePath = (v: string) => {
    if (!v.startsWith("/")) return false;
    try {
        return new URL(v, BASE).origin === BASE;
    } catch {
        return false;
    }
};

/** A site-relative path ("/events/...") or an absolute https URL (an upload in Blob storage). */
const href = z
    .string()
    .trim()
    .min(1, "Required")
    .refine(
        (v) => (v.startsWith("/") ? isSitePath(v) : /^https:\/\//i.test(v) && URL.canParse(v)),
        "Use a /path or an https:// URL",
    );

/** Hosts next/image may load from: keep in step with `images.remotePatterns` in next.config.ts. */
const isImageHost = (host: string) => host.endsWith(".public.blob.vercel-storage.com");

/** An image for next/image: a site-relative path or an upload in Blob storage. Any other host would fail to render. */
const imageSrc = z
    .string()
    .trim()
    .min(1, "Required")
    .refine((v) => {
        if (v.startsWith("/")) return isSitePath(v);
        try {
            const url = new URL(v);
            return url.protocol === "https:" && isImageHost(url.hostname);
        } catch {
            return false;
        }
    }, "Use a /path or an uploaded image. Images from other sites can't be shown.");

/** In-page anchors ("#stage") are allowed too. */
const linkHref = z
    .string()
    .trim()
    .min(1, "Required")
    .refine((v) => v.startsWith("/") || v.startsWith("#") || /^(https?:|mailto:)/.test(v), "Use a link, /path or #id");

/** Marks a fact (a role, a date, a number) that hasn't been confirmed yet. */
const assumed = z.boolean().optional();

export const linkSchema = z.object({ label: text, href: linkHref });

export const statSchema = z.object({ value: text, label: text, assumed });

export const photoSchema = z.object({
    src: imageSrc,
    alt: text.describe("Describe the photo for people who can't see it"),
    caption: text,
    /** Mosaic size: columns and rows the tile spans. */
    span: z.object({
        cols: z.union([z.literal(2), z.literal(4)]),
        rows: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    }),
});

export const glanceItemSchema = z.object({
    label: text,
    title: text,
    detail: text,
    href: linkHref.optional(),
    assumed,
});

const pdfUrl = href.refine((v) => {
    try {
        return new URL(v, BASE).pathname.toLowerCase().endsWith(".pdf");
    } catch {
        return false;
    }
}, "The resume must be a .pdf");

export const profileSchema = z.object({
    /** Page title, description and canonical URL, shared by the metadata and the share image. */
    site: z.object({ url: z.url(), title: text, description: text }),
    name: text,
    email: z.email(),
    resume: z.object({ url: pdfUrl }),
    place: text,
    headline: z.object({ lead: text, emphasis: text }),
    intro: text,
    education: z.object({ school: text, degree: text, years: text, assumed }),
    letterboxdUser: text,
    socials: z.array(linkSchema),
    glance: z.array(glanceItemSchema),
});

export const productSchema = z.object({
    /** Stable id. Other content refers to a product by this, so renaming the product doesn't break anything. */
    id: z
        .string()
        .trim()
        .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes"),
    name: text,
    what: text,
    role: text,
    years: text,
    stack: z.string().trim().optional(),
    url: z.url().optional(),
    isNew: z.boolean().optional(),
    /** A short note shown on its "also built" link, like "winner, openhacks 2020". */
    tag: z.string().trim().optional(),
    /** Shown as a large work in the engineer panel instead of a link under "also built". */
    featured: z.boolean(),
    assumed,
});

export const productsSchema = z.array(productSchema).superRefine((list, ctx) => {
    const seen = new Set<string>();
    list.forEach((p, i) => {
        if (seen.has(p.id)) ctx.addIssue({ code: "custom", message: "Ids must be unique", path: [i, "id"] });
        seen.add(p.id);
    });
});

export const liveEventSchema = z.object({
    id: z
        .string()
        .trim()
        .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes"),
    name: text,
    date: text,
    place: text,
    url: z.url(),
    stats: z.array(statSchema).min(1, "Add at least one stat"),
    assumed,
});

export const eventsSchema = z.object({
    events: z.array(liveEventSchema),
    /** The stage mosaic, in reading order. */
    stagePhotos: z.array(photoSchema),
});

const panelCopySchema = z.object({ n: text, title: text, text });

const workLabel = { title: text, years: text, role: text, note: text, assumed };

/**
 * Content that may not be supplied yet. While `needed` is true the site shows a "coming soon" marker with the
 * hint instead of inventing text; once it's false the site shows the details.
 */
const placeholderSchema = <T extends z.ZodRawShape>(extra: T) =>
    z.discriminatedUnion("needed", [
        z.object({ needed: z.literal(true), hint: text, ...extra }),
        z.object({
            needed: z.literal(false),
            hint: z.string().optional(),
            details: text,
            url: z.url().optional(),
            ...extra,
        }),
    ]);

/** What a founder work shows above its label: a photo or a number. With neither, a blank frame. */
const founderArtSchema = z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("photo"), image: imageSrc, alt: text.describe("Describe the photo") }),
    z.object({
        kind: z.literal("counter"),
        to: z.number().int().min(0),
        prefix: z.string().trim().optional(),
        suffix: z.string().trim().optional(),
        /** What a screen reader says for the counter, e.g. "1,400+ people". */
        label: text,
    }),
]);

const founderWorkSchema = z.object({ ...workLabel, url: z.url().optional(), art: founderArtSchema.optional() });

const month = z.string().trim().regex(MONTH, "Write it as year-month, like 2022-05");

export const stintSchema = z
    .object({ role: text, start: month, end: month.optional() })
    .refine((s) => !s.end || s.end >= s.start, { message: "Ends before it starts", path: ["end"] });

export const jobSchema = z.object({
    id: z
        .string()
        .trim()
        .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes"),
    org: text,
    url: z.url().optional(),
    place: z.string().trim().optional(),
    /** One sentence about the work. */
    line: text,
    /** An in-page anchor ("#founder") where the full story lives. */
    link: z
        .string()
        .trim()
        .regex(/^#[a-z0-9-]+$/, "An in-page anchor, like #founder")
        .optional(),
    stints: z.array(stintSchema).min(1, "Add at least one stint"),
    /** Shown in the day job panel. Hidden jobs are kept, just not shown. */
    show: z.boolean(),
    assumed,
});

export const jobsSchema = z.object({
    jobs: z.array(jobSchema).superRefine((list, ctx) => {
        const seen = new Set<string>();
        list.forEach((j, i) => {
            if (seen.has(j.id)) ctx.addIssue({ code: "custom", message: "Ids must be unique", path: [i, "id"] });
            seen.add(j.id);
        });
    }),
});

export const filmSchema = z.object({
    title: text,
    year: z.number().int().min(1880),
    watched: text,
    rating: z.number().min(0).max(5),
});

/** The chapter panels' ids, in page order. The page, the nav and the snap points all follow this order. */
export const panelIds = ["dayjob", "engineer", "stage", "founder", "off"] as const;
export type PanelId = (typeof panelIds)[number];

export const panelsSchema = z.object({
    /** Short copy for each panel. Each panel has to fit one screen, so keep these to a sentence or two. */
    panels: z.object(
        Object.fromEntries(panelIds.map((id) => [id, panelCopySchema])) as Record<PanelId, typeof panelCopySchema>,
    ),
    /** Organizations started, shown in the founder panel. */
    founder: z.object({
        works: z.array(founderWorkSchema),
        /** The stealth company stays "untitled": no name, field, location, link or image. */
        stealth: z.object(workLabel),
        /** Organizations led but not founded, shown as compact items. */
        alsoLed: z.array(
            z.object({
                name: text,
                role: text,
                years: text,
                url: z.url().optional(),
                /** Shown as its hover text. */
                note: z.string().trim().optional(),
                assumed,
            }),
        ),
    }),
    /** Papers, shown under "papers written" in the engineer panel. */
    writing: z.array(
        z.object({
            title: text,
            /** The shorter title shown on the page. The full title is its hover text and follows it in its accessible name. */
            short: text,
            year: z.number().int().min(1900).optional(),
            url: z.url().optional(),
        }),
    ),
    offHours: z.object({
        listening: z.object({ hint: text }),
        making: placeholderSchema({}),
        photography: placeholderSchema({}),
        cooking: placeholderSchema({ prompts: z.array(text) }),
    }),
    /** Shown when the live Letterboxd feed can't be reached. */
    fallbackFilms: z.array(filmSchema),
});

export const sectionSchemas = {
    profile: profileSchema,
    products: productsSchema,
    events: eventsSchema,
    panels: panelsSchema,
    jobs: jobsSchema,
} as const;

export type SectionKey = keyof typeof sectionSchemas;
export const sectionKeys = Object.keys(sectionSchemas) as SectionKey[];
export type SectionData<K extends SectionKey> = z.infer<(typeof sectionSchemas)[K]>;
export type Content = { [K in SectionKey]: SectionData<K> };

/** Own keys only: `in` would also accept names every object inherits, like "constructor" or "toString". */
export const isSectionKey = (key: string): key is SectionKey => Object.hasOwn(sectionSchemas, key);
