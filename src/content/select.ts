import { latestStint } from "./dates";
import type { GlanceItem, Job, Product } from "./types";

/** Products shown as large works in the engineer panel, and the rest (shown as links), both in list order. */
export const splitProducts = (products: Product[]) => ({
    featured: products.filter((p) => p.featured),
    others: products.filter((p) => !p.featured),
});

/** "At a glance" items with `{products}` in a title replaced by the number of products, so it follows the list. */
export const fillGlance = (glance: GlanceItem[], products: Product[]): GlanceItem[] =>
    glance.map((g) => ({ ...g, title: g.title.replaceAll("{products}", String(products.length)) }));

/** The jobs shown in the day job panel, newest first (by when their latest stint started). */
export const shownJobs = (jobs: Job[]) =>
    jobs
        .filter((j) => j.show)
        .map((job) => ({ job, start: latestStint(job.stints).start }))
        .sort((a, b) => b.start.localeCompare(a.start))
        .map(({ job }) => job);
