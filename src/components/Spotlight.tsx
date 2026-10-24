"use client";

import { useEffect, useRef } from "react";

type SpotlightProps = { name: React.ReactNode; children: React.ReactNode };

/**
 * The cover panel. A soft light chases the cursor over the name: a lit copy of the name sits exactly over the
 * dim one, and only its mask moves. Position is re-measured on resize and whenever a web font finishes loading,
 * because a late font load shifted the name in testing. Touch screens have no cursor to chase, so there the light
 * runs a followspot cue once: it picks up the name off its left edge, overshoots the end, and settles on its mark.
 */
export const Spotlight = ({ name, children }: SpotlightProps) => {
    const heroRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;
        const spot = hero.querySelector<HTMLElement>(".spot")!;
        const base = hero.querySelector<HTMLElement>(".name--base")!;
        const lit = hero.querySelector<HTMLElement>(".name--lit")!;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const touch = window.matchMedia("(hover: none)").matches;

        let raf = 0,
            last = 0,
            hovering = false,
            started = false,
            r = 270,
            litX = 0,
            litY = 0,
            lag = 110,
            ends = { left: 0, right: 0 };
        let home = { x: 0, y: 0 },
            target = { x: 0, y: 0 },
            pos = { x: 0, y: 0 };

        const apply = () => {
            spot.style.transform = `translate3d(${pos.x - r}px, ${pos.y - r}px, 0)`;
            lit.style.setProperty("--sx", `${pos.x - litX}px`);
            lit.style.setProperty("--sy", `${pos.y - litY}px`);
        };
        const layout = () => {
            const hr = hero.getBoundingClientRect(),
                br = base.getBoundingClientRect();
            const cs = getComputedStyle(lit),
                pl = parseFloat(cs.paddingLeft),
                pt = parseFloat(cs.paddingTop);
            litX = br.left - hr.left - pl;
            litY = br.top - hr.top - pt;
            lit.style.left = `${litX}px`;
            lit.style.top = `${litY}px`;
            lit.style.width = `${br.width + pl * 2}px`;
            r = spot.offsetWidth / 2;
            const w = Math.max(...[...base.children].map((s) => s.getBoundingClientRect().width));
            home = { x: br.left - hr.left + w * 0.45, y: br.top - hr.top + br.height * 0.5 };
            ends = { left: br.left - hr.left, right: br.left - hr.left + w };
            if (!hovering) target = { ...home };
            if (!started) pos = { ...target };
            apply();
        };
        const tick = (t: number) => {
            const dt = last ? Math.min(64, t - last) : 16;
            last = t;
            const k = 1 - Math.exp(-dt / lag);
            pos = { x: pos.x + (target.x - pos.x) * k, y: pos.y + (target.y - pos.y) * k };
            apply();
            if (Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.3) raf = requestAnimationFrame(tick);
            else {
                raf = 0;
                last = 0;
            }
        };
        const kick = () => {
            if (!raf) raf = requestAnimationFrame(tick);
        };
        const onMove = (e: PointerEvent) => {
            const hr = hero.getBoundingClientRect();
            target = { x: e.clientX - hr.left, y: e.clientY - hr.top };
            hovering = true;
            lag = 110;
            kick();
        };
        const onLeave = () => {
            hovering = false;
            target = { ...home };
            kick();
        };

        const ro = new ResizeObserver(layout);
        ro.observe(hero);
        document.fonts.ready.then(layout);
        document.fonts.addEventListener("loadingdone", layout);
        if (reduced) {
            hero.classList.add("is-rm");
            return () => {
                ro.disconnect();
                document.fonts.removeEventListener("loadingdone", layout);
            };
        }
        hero.addEventListener("pointermove", onMove);
        hero.addEventListener("pointerleave", onLeave);
        // The cue waits for the loader's curtain (lifts 1.5s to 2.2s) so the sweep plays in view.
        const cues: ReturnType<typeof setTimeout>[] = [];
        const at = (ms: number, fn: () => void) => cues.push(setTimeout(fn, ms));
        const t0 = touch && document.querySelector(".loader") ? 1700 : 250;
        at(t0, () => {
            if (touch) {
                pos = { x: ends.left - r * 0.6, y: home.y + r * 0.15 };
                target = { x: ends.right + r * 0.35, y: home.y - r * 0.1 };
                lag = 300;
                kick();
            }
            hero.classList.add("is-lit");
            started = true;
        });
        if (touch)
            at(t0 + 950, () => {
                if (hovering) return;
                target = { ...home };
                lag = 420;
                kick();
                at(1600, () => (lag = 110));
            });

        return () => {
            cues.forEach(clearTimeout);
            cancelAnimationFrame(raf);
            ro.disconnect();
            document.fonts.removeEventListener("loadingdone", layout);
            hero.removeEventListener("pointermove", onMove);
            hero.removeEventListener("pointerleave", onLeave);
        };
    }, []);

    return (
        <section ref={heroRef} className="panel hero" id="top">
            <div className="spot" aria-hidden="true" />
            <p className="name name--lit display" aria-hidden="true">
                {name}
            </p>
            <h1 className="name name--base display">{name}</h1>
            {children}
        </section>
    );
};
