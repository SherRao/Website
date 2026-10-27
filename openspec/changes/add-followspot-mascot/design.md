# Design

## Context

`prototypes/mascot/index.html` draws the followspot as an SVG string (`spot.render(mood)`), using shared `face()` and `zz()` helpers. It has a rotating `.aim` group around the stand's pivot at (55, 100) in a `0 0 200 170` viewBox, a beam polygon from the lens, and per-mood rest angles. Its "live" mode aimed the light with its own pointer listener.

On the site, the cover's spotlight is owned by `Spotlight.tsx`. A single `pos` (hero-relative px) eases toward a target on each animation frame (`tick` → `apply`). The target is the pointer, the touch cue (a sweep after the loader lifts) or `home`, the name's centre, when the pointer leaves. `layout()` re-measures on resize and on font load. With reduced motion, Spotlight adds `.is-rm` and returns before wiring any of this. `PageMotion` adds `html.motion` unless reduced motion is on, and `motion.css` only animates under that class. `ListeningCard.tsx` is a client component that polls Spotify and derives `playing`.

## Goals / Non-Goals

**Goals:**
- One component draws the followspot in any of its four moods, usable from server and client components.
- The cover's followspot moves in exact step with the existing light, with no second source of pointer state.
- It works without JavaScript and with reduced motion: a static, correct pose.

**Non-Goals:**
- The prototype's standby and blown lamp moods, the nav, the loader and a 404 page.
- Animating the bow when the say hi panel arrives (see Open Questions).
- Changing how the spotlight itself moves or looks.

## Decisions

### 1. A `Followspot` component with a `mood` prop, ported from the prototype
`src/components/Followspot.tsx` exports `Followspot({ mood, className })` with `mood: "cue" | "listening" | "sleep" | "bow"`. It renders the prototype's followspot SVG as JSX, using only the parts these moods need: eyes (dot, happy, closed), mouth (smile, w, none), headphones and "z"s. The SVG is `aria-hidden="true"` with `focusable="false"`. It carries `data-mood` for tests and styling, uses `stroke="currentColor"`, and colours its beam gradient with `style={{ stopColor: "var(--gel)" }}`. The gradient's id comes from `useId()`, which works in both server and client components, so three followspots on one page don't share an id. It has no state and no effects.

*Alternatives:* inline the SVG in each place (three copies of the drawing), or an `<img>` of a static SVG file (it can't use `currentColor`, CSS variables or per-mood parts).

### 2. Spotlight aims the cover's followspot from the light's own position
Spotlight renders the cover's followspot and, in `apply()`, sets two custom properties on it from `pos`:
- `--aim`: the angle from the stand's pivot to the light, measured from the direction it faces, clamped to ±45°.
- `--reach`: the distance from the lens to the light, divided by the beam's drawn length, so the beam's end lands on the light.

`layout()` already runs on resize and font load, and it also measures the pivot, lens and beam length in hero-relative px. `apply()` stays arithmetic only, with no layout reads per frame. Because aiming happens inside the existing frame loop, it follows the pointer, the touch cue and the return to `home` with the same easing, and it stops when the light stops.

*Alternative rejected:* the prototype's own pointer listener on the followspot. It would aim at the raw pointer, not the lagging light, would miss the touch cue and the leave-return, and would duplicate Spotlight's measuring.

### 3. Facing and placement on the cover: positioned against the name's box
The followspot sits inside the `<h1 class="name name--base">`, after the name's spans, absolutely positioned in `em` so it scales with the name. It's `aria-hidden`, so the heading's accessible name doesn't change, and the lit copy doesn't get one.
- **Large screens:** `left: 100%` plus a gap, near the bottom of the name, mirrored with `scale: -1 1` so it faces left toward the name. For `left: 100%` to mean "right of the name", `.name--base` gets `width: max-content` on large screens too (the small layout already has it). Spotlight's `layout()` already measures the name's spans rather than the h1, so the lit copy stays aligned. The existing "lit and dim names line up" test guards this.
- **Small screens:** left of "rao" (`left: 0`, bottom row), unmirrored, facing right.

CSS sets the facing direction as a custom property, `--facing: -1` (left) or `1` (right), in the same breakpoint as the placement. `layout()` reads it with `getComputedStyle`. JavaScript has no breakpoint of its own, the same rule `SmoothScroll.tsx` follows.

*Alternatives:* absolute coordinates in the hero (they break when the name's size changes), or a grid column for it (that would change the cover's layout and the spotlight's `home`).

### 4. Music card and say hi panel
- `ListeningCard` renders `<Followspot mood={playing ? "listening" : "sleep"} />` in the card's top-right corner, about 56px tall. A failed or null response already leaves `playing` null, so that state is asleep for free. The card's `aria-live` line stays the only announcement.
- `page.tsx` renders `<Followspot mood="bow" />` above the say hi heading, about 96px tall. The say hi panel is centred, so it adds height. Its small-screen `min-height: 70dvh` still fits.

### 5. One stylesheet, motion only under `.motion`
`src/styles/mascot.css` (imported in `globals.css`) holds stroke defaults, mood poses (rest angles as `--rest` per `data-mood`), the three placements and the beam. Blinking, the snoozing "z" drift and the transitions between moods are written under `.motion` only. So reduced motion and no-JS get the still pose, matching how `motion.css` works. The cover's aim is driven by frames, so it has no CSS transition. With reduced motion, Spotlight returns early and never sets `--aim`, so the followspot keeps `--rest` (facing the name). Only transform and opacity animate.

## Risks / Trade-offs

- [Making `.name--base` `max-content` on large screens could shift the name] → The name is already left-aligned (`align-items: flex-start`). Check the cover screenshots and the existing alignment and "fits one screen" tests at every listed size.
- [The followspot overlaps the glance or headline at short heights] → It's sized in `em` from the name, which already shrinks with `24vh`. Add a layout test that its box doesn't intersect the name's spans, the headline, the intro or the glance at each test viewport.
- [A beam across the dim name tints the letters] → It's layered below `.name--lit` and the beam stays at low opacity. Review this on the screenshots.
- [Mirroring flips the face] → The face is symmetric; only the headphones aren't, and the cover never wears them.

## Migration Plan

This only adds things; rollback is reverting the change. When it's built, delete `prototypes/mascot/` (it's untracked, so it's deleted only with Nausher's go-ahead).

## Open Questions

- Should the followspot bow as the say hi panel lands (tilting from cue to bow once), rather than already bowing? It would need a small observer in `PageMotion`. Left out until the static version has been seen.
