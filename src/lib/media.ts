// The media queries the page's scripts and images share. CSS can't import these, so layout.css, works.css and
// mascot.css repeat the small-layout query; change it there too.

const NARROW = "(max-width: 960px)";
const SHORT = "(max-height: 640px)";

/** The small layout: panels stack and scroll normally, with no pinning or snapping, and rows scroll sideways. */
export const SMALL_LAYOUT = `${NARROW}, ${SHORT}`;

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Runs an effect's `setup` with the visitor's reduced-motion preference, and again whenever they change it, after
 * undoing the previous run with the cleanup it returned. Returns the cleanup for the whole effect.
 */
export const withReducedMotion = (setup: (reduced: boolean) => () => void) => {
    const query = window.matchMedia(REDUCED_MOTION);
    let cleanup = setup(query.matches);
    const onChange = () => {
        cleanup();
        cleanup = setup(query.matches);
    };
    query.addEventListener("change", onChange);
    return () => {
        query.removeEventListener("change", onChange);
        cleanup();
    };
};

/**
 * An image `sizes` value: `small` on the small layout, `large` otherwise. A `sizes` entry takes one media condition,
 * so the small layout's two queries each get their own.
 */
export const layoutSizes = (small: string, large: string) => `${NARROW} ${small}, ${SHORT} ${small}, ${large}`;
