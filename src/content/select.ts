import { latestStint } from "./dates";
import type { GlanceItem, Job, Product } from "./types";

/** Products shown as large works in the engineer panel, and the rest (shown as links), both in list order. */
export const splitProducts = (products: Product[]) => ({
    featured: products.filter((p) => p.featured),
    others: products.filter((p) => !p.featured),
});

/** The jobs shown in the day job panel, newest first (by when their latest stint started). */
export const shownJobs = (jobs: Job[]) =>
    jobs
        .filter((j) => j.show)
        .map((job) => ({ job, start: latestStint(job.stints).start }))
        .sort((a, b) => b.start.localeCompare(a.start))
        .map(({ job }) => job);

/**
 * The "at a glance" items as the page shows them. `{products}` in a title becomes the number of products, and the
 * item labelled "now" takes its title and link from the newest shown job, so both follow their lists.
 */
export const fillGlance = (glance: GlanceItem[], products: Product[], jobs: Job[]): GlanceItem[] => {
    const [dayJob] = shownJobs(jobs);
    return glance.map((g) =>
        g.label === "now" && dayJob
            ? { ...g, title: dayJob.org, href: dayJob.url }
            : { ...g, title: g.title.replaceAll("{products}", String(products.length)) },
    );
};

/** A name's words, for the cover's and share image's stacked lines. */
export const nameWords = (name: string) => name.trim().split(/\s+/);

/** A name the way metadata writes it: the site's lowercase "nausher rao" as "Nausher Rao". */
export const displayName = (name: string) =>
    nameWords(name)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
