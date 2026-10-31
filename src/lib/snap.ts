// The snap rule: where the page may go and where it comes to rest, given the snap points (each panel's resting
// scroll position, top to bottom) and `home`, the index of the panel in place. Pure, so SmoothScroll.tsx only
// has to feed it Lenis's numbers and carry out its answers.

/** A movement smaller than this share of the screen is an accident, and settles back where it started. */
export const THRESHOLD = 0.02;

/** The index of the snap point closest to `y`. */
export const nearest = (points: number[], y: number) =>
    points.reduce((best, p, i) => (Math.abs(p - y) < Math.abs(points[best] - y) ? i : best), 0);

const clampIndex = (points: number[], i: number) => Math.max(0, Math.min(points.length - 1, i));

/**
 * Where a wheel or trackpad delta may take the page's target: no further than the panels either side of home,
 * so one gesture moves at most one panel. If the target has already left that range (a native scroll moved the
 * page), home is out of date and is recomputed from it. With reduced motion there is no glide to watch, so any
 * delta goes straight to the next panel in its direction.
 */
export const clampWheel = (points: number[], home: number, from: number, deltaY: number, reduced: boolean) => {
    if (from < points[clampIndex(points, home - 1)] - 1 || from > points[clampIndex(points, home + 1)] + 1)
        home = nearest(points, from);
    const lo = points[clampIndex(points, home - 1)];
    const hi = points[clampIndex(points, home + 1)];
    const to = reduced ? (deltaY > 0 ? hi : lo) : Math.max(lo, Math.min(hi, from + deltaY));
    return { home, to };
};

/**
 * The panel to rest on once input stops, with the page headed for `aim`.
 * - A gesture (`byDirection`) under the threshold settles back home; otherwise it lands on the next panel in its
 *   direction, or on the nearest one if it went more than the threshold past that (a scrollbar drag, Home, End).
 * - A scroll the browser made on its own lands on the nearest panel, so what it scrolled to stays in view.
 */
export const settleOn = (points: number[], home: number, aim: number, byDirection: boolean, viewport: number) => {
    if (!byDirection) return nearest(points, aim);
    const slack = THRESHOLD * viewport;
    const moved = aim - points[home];
    if (Math.abs(moved) < slack) return home;
    const next = clampIndex(points, home + Math.sign(moved));
    const past = moved > 0 ? aim - points[next] : points[next] - aim;
    return past > slack ? nearest(points, aim) : next;
};
