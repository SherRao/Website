"use client";

import { useEffect } from "react";
import { REDUCED_MOTION, SMALL_LAYOUT } from "@/lib/media";
import { showCount } from "./artworks";

/**
 * Wires the page's scroll-driven effects. Renders nothing.
 * - Chapter titles light up when their panel is more than 60% in view.
 * - Works and photos (.rv) light up and open the first time they're seen; count-ups start at the same moment.
 * With reduced motion every title is lit and everything else is already in its final state.
 */
export const PageMotion = () => {
    useEffect(() => {
        const reduced = window.matchMedia(REDUCED_MOTION).matches;
        const root = document.documentElement;

        // Pinned panels stay "in view" underneath the one covering them, so only the last panel that is
        // mostly in view (the one on top) lights its title. On small screens panels don't pin and are taller
        // than the screen, so a title lights while its own heading is in view instead.
        const panels = [...document.querySelectorAll<HTMLElement>(".panel.chapter")];
        const heads = panels.map((p) => p.querySelector<HTMLElement>(".chapter-head")!);
        if (reduced) {
            heads.forEach((h) => h.classList.add("is-on"));
            return;
        }
        const small = window.matchMedia(SMALL_LAYOUT);
        const ratios = new Map<Element, number>();
        const seen = new Map<Element, boolean>();
        const relight = () => {
            const top = panels.filter((p) => (ratios.get(p) ?? 0) > 0.6).at(-1);
            panels.forEach((p, i) =>
                heads[i].classList.toggle("is-on", small.matches ? seen.get(heads[i]) === true : p === top),
            );
        };
        const cues = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) =>
                    e.target.classList.contains("chapter-head")
                        ? seen.set(e.target, e.isIntersecting)
                        : ratios.set(e.target, e.intersectionRatio),
                );
                relight();
            },
            { threshold: [0, 0.6, 1] },
        );
        panels.forEach((p) => cues.observe(p));
        heads.forEach((h) => cues.observe(h));
        small.addEventListener("change", relight);

        root.classList.add("motion");
        // Rewind the finished values so they can play when revealed.
        document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => showCount(el, 0));

        const countUp = (el: HTMLElement) => {
            const to = Number(el.dataset.count),
                t0 = performance.now();
            const step = (t: number) => {
                const p = Math.min(1, (t - t0) / 1600);
                showCount(el, Math.round(to * (1 - Math.pow(1 - p, 3))));
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        // Works and photos reveal a row at a time, when the row comes into view. Watching each one alone fails on
        // small screens, where rows scroll sideways: a closed reveal is only a dot at its center, so a card peeking
        // in from the edge has nothing on screen and never counts as seen. Their --d stagger still plays.
        const groups = new Map<Element, HTMLElement[]>();
        document.querySelectorAll<HTMLElement>(".rv").forEach((el) => {
            const row = el.closest(".row, .mosaic") ?? el;
            groups.set(row, [...(groups.get(row) ?? []), el]);
        });
        const reveal = (el: HTMLElement) => {
            el.classList.add("is-in");
            el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
        };
        const reveals = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (!e.isIntersecting) return;
                    reveals.unobserve(e.target);
                    groups.get(e.target)?.forEach(reveal);
                }),
            { rootMargin: "0px 0px -12% 0px" },
        );
        groups.forEach((_, row) => reveals.observe(row));

        return () => {
            cues.disconnect();
            small.removeEventListener("change", relight);
            reveals.disconnect();
            root.classList.remove("motion");
        };
    }, []);

    return null;
};
