"use client";

import { useEffect, useRef } from "react";
import { aimAt, Followspot, pivotOn, setAim } from "./Followspot";

/** The most the resting lamp leans toward the pointer, in degrees, reached near the panel's edges. */
const MAX_LEAN = 8;

/**
 * The say hi panel's followspot. It rests lighting the email, and swings over to light whichever of the panel's
 * links is hovered or focused, then back once none is. While it rests, it leans a few degrees toward the mouse,
 * so it notices the pointer without leaving the email to chase it. Never moves with reduced motion.
 */
export const DoorSpot = () => {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = ref.current;
        const door = svg?.closest<HTMLElement>(".door");
        if (!svg || !door || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const links = [...door.querySelectorAll<HTMLAnchorElement>("a")];
        const mail = door.querySelector<HTMLElement>(".door-mail")!;

        let lit: HTMLAnchorElement | null = null,
            raf = 0,
            last = 0,
            lean = 0,
            want = 0;

        /**
         * Aims the lamp's beam through the link's middle, no more than 75° either way, and stretches it to twice the
         * link's distance: the beam fades out along its length, so the link sits in its bright half, as the email
         * does at rest.
         */
        const aim = (a: HTMLAnchorElement) => {
            const ar = a.getBoundingClientRect(),
                p = pivotOn(svg);
            const dx = ar.left + ar.width / 2 - p.x,
                dy = ar.top + ar.height / 2 - p.y;
            setAim(svg, aimAt(dx, dy, p.unit, { max: 75, stretch: 2, minReach: 0.4 }));
        };
        const light = (a: HTMLAnchorElement | null) => {
            if (a === lit) return;
            lit = a;
            if (a) {
                want = 0;
                kick();
                aim(a);
            } else {
                svg.style.removeProperty("--aim");
                svg.style.removeProperty("--reach");
            }
        };

        // The lean eases after the pointer, lagging it by about a quarter second.
        const tick = (t: number) => {
            const dt = last ? Math.min(64, t - last) : 16;
            last = t;
            lean += (want - lean) * (1 - Math.exp(-dt / 250));
            if (Math.abs(want - lean) > 0.01) {
                svg.style.setProperty("--lean", `${lean.toFixed(3)}deg`);
                raf = requestAnimationFrame(tick);
            } else {
                lean = want;
                if (lean) svg.style.setProperty("--lean", `${lean}deg`);
                else svg.style.removeProperty("--lean");
                raf = last = 0;
            }
        };
        const kick = () => {
            if (!raf) raf = requestAnimationFrame(tick);
        };
        /**
         * The lean goes by how far the pointer is from the email, across the beam: the way a turn would move the
         * beam's far end. The distance counts in halves of the panel, so the lean grows evenly over the whole screen,
         * reaching its most near the edges. Measured as an angle from the stand instead, it maxed out halfway across,
         * because the stand sits low and left, near the screen's bottom edge.
         */
        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse" || lit) return;
            const dr = door.getBoundingClientRect(),
                mr = mail.getBoundingClientRect();
            const nx = (e.clientX - (mr.left + mr.width / 2)) / (dr.width / 2),
                ny = (e.clientY - (mr.top + mr.height / 2)) / (dr.height / 2);
            const rest = (parseFloat(getComputedStyle(svg).getPropertyValue("--rest")) * Math.PI) / 180;
            // Turning the lamp clockwise by a little moves its beam's end this way on screen.
            const across = -nx * Math.sin(rest) + ny * Math.cos(rest);
            want = MAX_LEAN * Math.max(-1, Math.min(1, across));
            kick();
        };
        const onLeave = () => {
            want = 0;
            kick();
        };
        const onOver = (e: Event) => {
            const a = (e.target as Element).closest?.("a");
            if (a && links.includes(a)) light(a);
        };
        const onOut = (e: Event) => {
            const next = (e as PointerEvent | FocusEvent).relatedTarget as Element | null;
            const a = next?.closest?.("a");
            light(a && links.includes(a) ? a : (links.find((l) => l === document.activeElement) ?? null));
        };

        door.addEventListener("pointermove", onMove);
        door.addEventListener("pointerleave", onLeave);
        door.addEventListener("pointerover", onOver);
        door.addEventListener("pointerout", onOut);
        door.addEventListener("focusin", onOver);
        door.addEventListener("focusout", onOut);
        return () => {
            cancelAnimationFrame(raf);
            door.removeEventListener("pointermove", onMove);
            door.removeEventListener("pointerleave", onLeave);
            door.removeEventListener("pointerover", onOver);
            door.removeEventListener("pointerout", onOut);
            door.removeEventListener("focusin", onOver);
            door.removeEventListener("focusout", onOut);
        };
    }, []);

    return <Followspot ref={ref} mood="hi" className="door-spot" />;
};
