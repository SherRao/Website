// The media queries the page's scripts and images share. CSS can't import these, so layout.css, works.css and
// mascot.css repeat the small-layout query; change it there too.

const NARROW = "(max-width: 960px)";
const SHORT = "(max-height: 640px)";

/** The small layout: panels stack and scroll normally, with no pinning or snapping, and rows scroll sideways. */
export const SMALL_LAYOUT = `${NARROW}, ${SHORT}`;

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * An image `sizes` value: `small` on the small layout, `large` otherwise. A `sizes` entry takes one media condition,
 * so the small layout's two queries each get their own.
 */
export const layoutSizes = (small: string, large: string) => `${NARROW} ${small}, ${SHORT} ${small}, ${large}`;
