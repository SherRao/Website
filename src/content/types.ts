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
