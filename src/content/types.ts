/** Content that hasn't been supplied yet. Components show a "content needed" marker instead of inventing text. */
export type Placeholder = { needed: true; hint: string };

export type Link = { label: string; href: string };

export type Product = {
    name: string;
    what: string;
    role: string;
    years: string;
    stack?: string;
    url?: string;
    isNew?: boolean;
    /** A short note shown on its "also built" link, like "winner, openhacks 2020". */
    tag?: string;
};

export type Stat = { value: string; label: string };

export type LiveEvent = {
    id: string;
    name: string;
    date: string;
    place: string;
    url: string;
    stats: Stat[];
};

export type Photo = {
    src: string;
    alt: string;
    caption: string;
    /** Mosaic size: columns and rows the tile spans. */
    span: { cols: 2 | 4; rows: 1 | 2 | 3 };
};

export type GlanceItem = { label: string; title: string; detail: string; href?: string };

export type Film = { title: string; year: number; watched: string; rating: number };

/** One stretch of a job. Months are "YYYY-MM"; a stint with no end is ongoing. */
export type Stint = { role: string; start: string; end?: string };

export type Job = {
    id: string;
    org: string;
    url?: string;
    place?: string;
    /** One sentence about the work. */
    line: string;
    /** What it shipped, like "blue dot". */
    shipped?: string;
    /** An in-page anchor ("#founder") where the full story lives. The name links here instead of to `url`. */
    link?: string;
    stints: Stint[];
    /** Shown in the day job panel. Hidden jobs are kept, just not shown. */
    show: boolean;
};

/** A museum label for a gallery work. */
export type WorkLabel = { title: string; years: string; role: string; note: string };

/** What a founder work shows above its label: a photo or a number. With neither, a blank frame. */
export type FounderArt =
    | { kind: "photo"; image: string; alt: string }
    | { kind: "counter"; to: number; prefix?: string; suffix?: string; label: string };

export type FounderWork = WorkLabel & { url?: string; art?: FounderArt };

/** An organization led but not founded. */
export type AlsoLed = { name: string; role: string; years: string; url?: string };

/** A paper. `short` shows on the page; the full `title` is its hover text and accessible name. */
export type Paper = { title: string; short: string; year?: number; url?: string };
