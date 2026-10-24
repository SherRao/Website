import { z } from "zod";

/**
 * The shape of every piece of site content. The admin panel validates saves with these schemas, the site validates
 * what it reads with them, and the TypeScript types in `types.ts` are inferred from them.
 */

const text = z.string().trim().min(1, "Required");

/** A site-relative path ("/events/...") or an absolute https URL (an upload in Blob storage). */
const href = z
    .string()
    .trim()
    .min(1, "Required")
    .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), "Use a /path or an https:// URL");

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
    src: href,
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
        return new URL(v, "https://x.invalid").pathname.toLowerCase().endsWith(".pdf");
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
    now: z.object({
        org: text,
        role: text,
        focus: text,
        since: text,
        until: text,
        url: z.url(),
        assumed,
    }),
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
 * Content that may not be supplied yet. While `needed` is true the site shows a "content needed" marker with the
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

export const filmSchema = z.object({
    title: text,
    year: z.number().int().min(1880),
    watched: text,
    rating: z.number().min(0).max(5),
});

export const panelsSchema = z.object({
    /** Short copy for each panel. Each panel has to fit one screen, so keep these to a sentence or two. */
    panels: z.object({
        engineer: panelCopySchema,
        stage: panelCopySchema,
        founder: panelCopySchema,
        off: panelCopySchema,
    }),
    /** Founder works. The stealth company stays "untitled": no name, field, location or link. */
    founderWorks: z.object({
        konfer: z.object({ ...workLabel, url: z.url().optional(), image: href, alt: text }),
        spur: z.object({ ...workLabel, url: z.url().optional() }),
        /** Shown with the label of the product with this id. */
        seahorse: z.object({ productId: text }),
        stealth: z.object(workLabel),
    }),
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
} as const;

export type SectionKey = keyof typeof sectionSchemas;
export const sectionKeys = Object.keys(sectionSchemas) as SectionKey[];
export type SectionData<K extends SectionKey> = z.infer<(typeof sectionSchemas)[K]>;
export type Content = { [K in SectionKey]: SectionData<K> };

export const isSectionKey = (key: string): key is SectionKey => key in sectionSchemas;
