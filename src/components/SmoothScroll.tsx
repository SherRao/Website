"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

// Tuned for a heavy, cinematic glide that still lands quickly: a low lerp for the glide, a short ease-out settle so
// landing never lags behind it, and an idle wait just longer than the gap between wheel notches in one spin.
/** How far the page glides toward the wheel's target each frame (0 to 1). Lower is heavier. */
const LERP = 0.06;
/** Scales every wheel and trackpad delta. */
const WHEEL = 1;
/** How long input has to stop before the page settles on a panel, in ms. */
const IDLE = 120;
/** How long the settle onto a panel takes, in s. Shorter than the glide, so landing never drags. */
const SNAP_DURATION = 0.8;
/** Settle ease: ease-out, so it picks up a moving glide at speed and slows into place. */
const snapEasing = (t: number) => 1 - Math.pow(1 - t, 4);
/** A movement smaller than this share of the screen is an accident, and settles back where it started. */
const THRESHOLD = 0.02;
/** Keys that scroll the page. */
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", " ", "Home", "End"]);

/**
 * Smooths the page's mouse and trackpad scrolling with Lenis and snaps it to panels. Renders nothing.
 * - Snap points are the .snap markers that render a box. The small layout hides them, so there the page glides
 *   but rests anywhere; crossing the breakpoint turns snapping on and off with no breakpoint here.
 * - One gesture moves at most one panel: wheel input is clamped to the panels either side of the one in place
 *   (`home`), and once input stops the page settles on the next panel in the gesture's direction.
 * - Native scrolls (keys, scrollbar) can't be clamped. Ones under a panel settle by direction, like the wheel;
 *   bigger jumps (scrollbar drags, Home, End) settle on the nearest panel. So do scrolls the browser makes on its
 *   own (focus, find in page, scrollIntoView), so what it scrolled to stays in view.
 * - In-page links ease to their panel with the settle ease.
 * - Touch scrolls natively. With reduced motion nothing is smoothed: the wheel scrolls natively or jumps a panel,
 *   and every settle and link jumps.
 */
export const SmoothScroll = () => {
    useEffect(() => {
        let markers: HTMLElement[] = [];
        let points: number[] = [];
        let home = -1;
        let settling = false;
        let touching = false;
        /** Whether the visitor has scrolled (wheel, touch, keys) since the last settle. */
        let steered = false;
        let idle = 0;

        const nearest = (y: number) =>
            points.reduce((best, p, i) => (Math.abs(p - y) < Math.abs(points[best] - y) ? i : best), 0);
        const clampIndex = (i: number) => Math.max(0, Math.min(points.length - 1, i));

        const lenis: Lenis = new Lenis({
            autoRaf: true,
            syncTouch: false,
            lerp: LERP,
            wheelMultiplier: WHEEL,
            // A sideways swipe over a .row or .mosaic strip scrolls the strip; vertical ones still move the page.
            allowNestedScroll: true,
            virtualScroll: (data) => {
                const { deltaY, event } = data;
                if (event.type.startsWith("touch") || event.ctrlKey) return true;
                steered = true;
                if (!settling) wait();
                // Lenis's slowest smoothing (lerp 1) still eases over a few frames, so with reduced motion the wheel
                // skips it: the browser scrolls where there are no panels, and the jump below handles the rest.
                const reduced = lenis.prefersReducedMotion;
                // Only the small layout has sideways strips, and it has no panels. On the large layout a mostly
                // sideways gesture still moves the page by its vertical part, so it is clamped like any other.
                if (!points.length || deltaY === 0) return !reduced;
                if (settling) return true;
                // Keep the wheel's target between the panels either side of home. If a native scroll has already
                // left that range, home is out of date.
                const from = lenis.targetScroll;
                if (from < points[clampIndex(home - 1)] - 1 || from > points[clampIndex(home + 1)] + 1)
                    home = nearest(from);
                const lo = points[clampIndex(home - 1)];
                const hi = points[clampIndex(home + 1)];
                // Reduced motion has no glide to watch, so the first notch goes all the way, with nothing in between.
                const to = reduced ? (deltaY > 0 ? hi : lo) : Math.max(lo, Math.min(hi, from + deltaY));
                if (Math.abs(to - from) >= 0.5 && !reduced) {
                    data.deltaY = to - from;
                    return true;
                }
                if (Math.abs(to - from) >= 0.5) lenis.scrollTo(to, { immediate: true, force: true });
                // A veto skips Lenis's preventDefault, and the browser would scroll natively instead.
                if (event.cancelable) event.preventDefault();
                return false;
            },
        });

        /** Puts the page on a panel: back home, one panel on in the gesture's direction, or the nearest one. */
        const settle = () => {
            idle = 0;
            if (!points.length || touching || settling) return;
            const byDirection = steered;
            steered = false;
            if (home < 0) home = nearest(lenis.targetScroll);
            const aim = lenis.targetScroll;
            const moved = aim - points[home];
            const next = clampIndex(home + Math.sign(moved));
            let to = home;
            if (!byDirection) to = nearest(aim);
            else if (Math.abs(moved) >= THRESHOLD * window.innerHeight) {
                const past = moved > 0 ? aim - points[next] : points[next] - aim;
                to = past > THRESHOLD * window.innerHeight ? nearest(aim) : next;
            }
            ease(to);
        };
        const ease = (to: number) => {
            if (Math.abs(window.scrollY - points[to]) < 1 && Math.abs(lenis.targetScroll - points[to]) < 1) {
                home = to;
                return;
            }
            settling = true;
            // Lenis skips a scrollTo to where the wheel is already headed, leaving the slow tail of the glide.
            lenis.targetScroll = lenis.animatedScroll;
            lenis.scrollTo(points[to], {
                duration: SNAP_DURATION,
                easing: snapEasing,
                lock: true,
                force: true,
                onComplete: () => {
                    home = to;
                    settling = false;
                },
            });
        };
        /** Restarts the wait for input to stop. */
        const wait = () => {
            clearTimeout(idle);
            idle = window.setTimeout(settle, IDLE);
        };

        const measure = () => {
            // Lenis re-reads the page's size 250ms after a resize; until then its limit (and every scrollTo it
            // clamps) would still be the old one. Refresh it now without touching a running glide.
            lenis.dimensions.resize();
            markers = [...document.querySelectorAll<HTMLElement>(".snap")].filter((m) => m.getClientRects().length > 0);
            points = markers.map((m) => Math.min(lenis.limit, m.getBoundingClientRect().top + window.scrollY));
            if (!points.length) {
                home = -1;
                return;
            }
            if (idle || settling || touching) return;
            // Layout moved under the page (a resize, fonts, images): put it back on the nearest panel.
            home = nearest(window.scrollY);
            ease(home);
        };
        let frame = 0;
        const remeasure = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(measure);
        };

        /** Drops a running settle, so the visitor's own scroll isn't fought or blocked by its lock. */
        const takeOver = () => {
            // stop() and start() each drop the running ease and the lock (Lenis keeps reset() private).
            lenis.stop();
            lenis.start();
            settling = false;
        };

        // Native scrolls (keys, scrollbar, touch) restart the wait. Lenis's own glide and settle don't.
        const onScroll = () => {
            // A native scroll mid-settle (a scrollbar drag, a key) is the visitor taking over; Lenis would otherwise
            // drag the page back every frame until the ease ends.
            if (settling && Math.abs(window.scrollY - lenis.animatedScroll) > 2) takeOver();
            if (lenis.isScrolling !== "smooth" && !settling) wait();
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (SCROLL_KEYS.has(e.key)) steered = true;
        };
        const onTouchStart = () => {
            touching = true;
            steered = true;
            // While a settle holds its lock, Lenis cancels every touchmove, so the finger couldn't scroll.
            if (settling) takeOver();
            clearTimeout(idle);
        };
        const onTouchEnd = (e: TouchEvent) => {
            touching = e.touches.length > 0;
            if (!touching) wait();
        };

        const onClick = (e: MouseEvent) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
            const target = link && document.getElementById(decodeURIComponent(link.hash.slice(1)));
            if (!link || !target) return;
            e.preventDefault();
            const oldURL = location.href;
            history.pushState(null, "", link.hash);
            dispatchEvent(new HashChangeEvent("hashchange", { oldURL, newURL: location.href }));
            // Stand in for the browser's own anchor jump, which moves the keyboard's starting point to the target.
            // A section isn't focusable until it has a tabindex; -1 keeps it out of the Tab order.
            if (target.tabIndex < 0) target.tabIndex = -1;
            target.focus({ preventScroll: true });
            clearTimeout(idle);
            idle = 0;
            // Each linked section sits right after a marker; a pinned panel's own position moves, so aim at that.
            const at = markers.indexOf(target.previousElementSibling as HTMLElement);
            if (at >= 0) {
                ease(at);
                return;
            }
            lenis.scrollTo(target, { duration: SNAP_DURATION, easing: snapEasing });
        };

        measure();
        const ro = new ResizeObserver(remeasure);
        ro.observe(document.body);
        window.addEventListener("resize", remeasure);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        window.addEventListener("touchcancel", onTouchEnd, { passive: true });
        document.addEventListener("click", onClick);

        return () => {
            clearTimeout(idle);
            cancelAnimationFrame(frame);
            ro.disconnect();
            window.removeEventListener("resize", remeasure);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchEnd);
            document.removeEventListener("click", onClick);
            lenis.destroy();
        };
    }, []);

    return null;
};
