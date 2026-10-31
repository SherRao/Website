import type { z } from "zod";
import type {
    eventsSchema,
    filmSchema,
    glanceItemSchema,
    jobSchema,
    jobsSchema,
    linkSchema,
    liveEventSchema,
    panelsSchema,
    photoSchema,
    productSchema,
    profileSchema,
    statSchema,
    stintSchema,
} from "./schema";

export type { Content, PanelId, SectionData, SectionKey } from "./schema";

export type Link = z.infer<typeof linkSchema>;
export type Product = z.infer<typeof productSchema>;
export type Stat = z.infer<typeof statSchema>;
export type LiveEvent = z.infer<typeof liveEventSchema>;
export type Photo = z.infer<typeof photoSchema>;
export type GlanceItem = z.infer<typeof glanceItemSchema>;
export type Film = z.infer<typeof filmSchema>;

export type Profile = z.infer<typeof profileSchema>;
export type Events = z.infer<typeof eventsSchema>;
export type Panels = z.infer<typeof panelsSchema>;
export type Jobs = z.infer<typeof jobsSchema>;
export type Job = z.infer<typeof jobSchema>;
export type Stint = z.infer<typeof stintSchema>;
export type FounderWork = Panels["founder"]["works"][number];

/** Content that may not be supplied yet: a hint and a "coming soon" marker, or the details once they exist. */
export type Placeholder = Panels["offHours"]["making"];
