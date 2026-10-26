"use client";

import { useEffect } from "react";

/** Drift speed, in px per second. */
const SPEED = 24;
/** How long a strip waits after the visitor lets go before it drifts again, in ms. */
const RESUME = 7500;
/** How long a strip waits after it first comes into view, so its reveal plays first, in ms. */
const START = 2500;

/**
 * On small screens the work rows and the stage photos are sideways strips. While one is in view it drifts slowly
 * on its own, and loops: a copy of its items follows the originals, and once the copy has slid into the originals'
 * place the strip jumps back by one set, which looks the same. Touching, wheeling or focusing a strip hands it to
 * the visitor; it drifts again 7.5s after they're done. Snapping is off while it drifts, or it would pull back to
 * the nearest item every frame. Never runs with reduced motion. Renders nothing.
 */
export const Drift = () => {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const small = window.matchMedia("(max-width: 960px), (max-height: 640px)");
        let stop = () => {};
        const sync = () => {
            stop();
            const strips = small.matches ? [...document.querySelectorAll<HTMLElement>(".row, .mosaic")] : [];
            const stops = strips.map(drift);
            stop = () => stops.forEach((s) => s());
        };
        sync();
        small.addEventListener("change", sync);
        return () => {
            small.removeEventListener("change", sync);
            stop();
        };
    }, []);

    return null;
};

/** The copy is decoration: hidden from screen readers, skipped by Tab, and showing every piece's final state. */
const copyOf = (item: HTMLElement) => {
    const copy = item.cloneNode(true) as HTMLElement;
    copy.setAttribute("aria-hidden", "true");
    copy.dataset.copy = "";
    if (copy.tabIndex >= 0) copy.tabIndex = -1;
    copy.querySelectorAll<HTMLElement>("a, [tabindex]").forEach((el) => (el.tabIndex = -1));
    [copy, ...copy.querySelectorAll<HTMLElement>(".rv")].forEach(
        (el) => el.classList.contains("rv") && el.classList.add("is-in"),
    );
    copy.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        el.textContent = `${el.dataset.prefix}${Number(el.dataset.count).toLocaleString("en-US")}${el.dataset.suffix}`;
    });
    return copy;
};

/** Wires one strip. Returns its cleanup. */
const drift = (strip: HTMLElement) => {
    const items = [...strip.children] as HTMLElement[];
    let copies: HTMLElement[] = [];
    let raf = 0,
        last = 0,
        pos = 0,
        period = 0,
        visible = false,
        seen = false,
        drifting = false,
        holding = false,
        heldUntil = 0,
        ours = -1;

    const measure = () => {
        period = copies.length ? copies[0].offsetLeft - items[0].offsetLeft : 0;
    };
    const begin = () => {
        if (!copies.length) {
            if (strip.scrollWidth <= strip.clientWidth) return false;
            copies = items.map(copyOf);
            strip.append(...copies);
            measure();
        }
        if (period <= 0) return false;
        // The visitor may have left it partway into the copy; the same view one set back is in the originals.
        pos = strip.scrollLeft % period;
        strip.classList.add("is-drifting");
        drifting = true;
        return true;
    };
    const hold = () => {
        drifting = false;
        heldUntil = performance.now() + RESUME;
    };

    const tick = (t: number) => {
        raf = 0;
        if (!visible || document.hidden) {
            last = 0;
            return;
        }
        const dt = last ? Math.min(64, t - last) : 0;
        last = t;
        if (!drifting && !holding && t >= heldUntil && !begin()) return;
        if (drifting) {
            pos += (SPEED * dt) / 1000;
            if (pos >= period) pos -= period;
            strip.scrollLeft = pos;
            ours = strip.scrollLeft;
        }
        raf = requestAnimationFrame(tick);
    };
    const kick = () => {
        if (!raf) raf = requestAnimationFrame(tick);
    };

    // Touch, pen and mouse: hold while pressed. Snapping comes back with the first scroll the visitor makes, so a
    // swipe still lands on an item but a plain tap doesn't snap the strip back to the item behind it.
    const onDown = () => {
        holding = true;
        hold();
    };
    const onUp = () => {
        if (!holding) return;
        holding = false;
        hold();
        kick();
    };
    // Trackpads, momentum after a swipe, and keyboard scrolling all keep pushing the restart back.
    const onWheel = () => {
        hold();
        kick();
    };
    // The scroll event from the drift's last frame can land after a press has stopped it; that one isn't the visitor.
    const onScroll = () => {
        if (drifting || Math.abs(strip.scrollLeft - ours) < 1) return;
        strip.classList.remove("is-drifting");
        hold();
    };
    // Keyboard focus holds the strip until focus leaves it. A tap also focuses a photo, so only :focus-visible counts.
    let focused = false;
    const onFocusIn = (e: FocusEvent) => {
        if (!(e.target as Element).matches(":focus-visible")) return;
        focused = holding = true;
        strip.classList.remove("is-drifting");
        hold();
    };
    const onFocusOut = (e: FocusEvent) => {
        if (!focused || strip.contains(e.relatedTarget as Node)) return;
        focused = holding = false;
        hold();
        kick();
    };
    const onVisibility = () => !document.hidden && kick();

    const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !seen) {
            seen = true;
            heldUntil = performance.now() + START;
        }
        if (visible) kick();
    });
    io.observe(strip);
    const ro = new ResizeObserver(measure);
    ro.observe(strip);

    strip.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    strip.addEventListener("wheel", onWheel, { passive: true });
    strip.addEventListener("scroll", onScroll, { passive: true });
    strip.addEventListener("focusin", onFocusIn);
    strip.addEventListener("focusout", onFocusOut);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        strip.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        strip.removeEventListener("wheel", onWheel);
        strip.removeEventListener("scroll", onScroll);
        strip.removeEventListener("focusin", onFocusIn);
        strip.removeEventListener("focusout", onFocusOut);
        document.removeEventListener("visibilitychange", onVisibility);
        strip.classList.remove("is-drifting");
        copies.forEach((c) => c.remove());
    };
};
