"use client";

import { useEffect } from "react";

/**
 * Wires the page's scroll-driven effects. Renders nothing.
 * - Chapter titles light up when their panel is more than 60% in view.
 * - Works and photos (.rv) light up and open the first time they're seen; count-ups, dots and the
 *   blue dot's walk start at the same moment.
 * With reduced motion every title is lit and everything else is already in its final state.
 */
export const PageMotion = () => {
    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
        const small = window.matchMedia("(max-width: 960px), (max-height: 640px)");
        const ratios = new Map<Element, number>();
        const seen = new Map<Element, boolean>();
        const relight = () => {
            const top = panels.filter((p) => (ratios.get(p) ?? 0) > 0.6).at(-1);
            panels.forEach((p, i) => heads[i].classList.toggle("is-on", small.matches ? seen.get(heads[i]) === true : p === top));
        };
        const cues = new IntersectionObserver((entries) => {
            entries.forEach((e) => (e.target.classList.contains("chapter-head") ? seen.set(e.target, e.isIntersecting) : ratios.set(e.target, e.intersectionRatio)));
            relight();
        }, { threshold: [0, 0.6, 1] });
        panels.forEach((p) => cues.observe(p));
        heads.forEach((h) => cues.observe(h));
        small.addEventListener("change", relight);

        root.classList.add("motion");
        // Rewind the finished values so they can play when revealed.
        document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => { el.textContent = `${el.dataset.prefix}0${el.dataset.suffix}`; });
        document.querySelectorAll<HTMLElement>("[data-dots]").forEach((box) => {
            box.querySelectorAll("i").forEach((d) => d.classList.remove("on"));
            const cap = box.parentElement?.querySelector<HTMLElement>("[data-dots-cap]");
            if (cap) cap.textContent = `0/${cap.dataset.dotsCap}`;
        });

        const timers: number[] = [];
        const countUp = (el: HTMLElement) => {
            const to = Number(el.dataset.count), t0 = performance.now();
            const step = (t: number) => {
                const p = Math.min(1, (t - t0) / 1600);
                el.textContent = `${el.dataset.prefix}${Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString("en-US")}${el.dataset.suffix}`;
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };
        const fillDots = (box: HTMLElement) => {
            const cap = box.parentElement?.querySelector<HTMLElement>("[data-dots-cap]");
            [...box.querySelectorAll("i")].slice(0, Number(box.dataset.dots)).forEach((d, i) => {
                timers.push(window.setTimeout(() => { d.classList.add("on"); if (cap) cap.textContent = `${i + 1}/${cap.dataset.dotsCap}`; }, 200 + i * 110));
            });
        };

        const reveals = new IntersectionObserver((entries) => entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target as HTMLElement;
            el.classList.add("is-in");
            reveals.unobserve(el);
            el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
            el.querySelectorAll<HTMLElement>("[data-dots]").forEach(fillDots);
            el.querySelectorAll<SVGAnimationElement>("animate, animateMotion").forEach((a) => a.beginElement());
        }), { rootMargin: "0px 0px -12% 0px" });
        document.querySelectorAll(".rv").forEach((el) => reveals.observe(el));

        return () => {
            cues.disconnect();
            small.removeEventListener("change", relight);
            reveals.disconnect();
            timers.forEach(clearTimeout);
            root.classList.remove("motion");
        };
    }, []);

    return null;
};
