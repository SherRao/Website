# Design

## Context

Today the page scrolls natively, and three pieces of CSS shape it:

- `html { scroll-snap-type: y mandatory; scroll-behavior: smooth }` in `layout.css`
- zero-height `.snap` markers (`scroll-snap-align: start; scroll-snap-stop: always`). They sit before and between the sticky panels, because a pinned panel reports a moving snap position.
- small-screen and reduced-motion overrides that turn those off

With a Windows mouse wheel, each notch is a finished scroll, so mandatory snap jumps a whole panel per notch. On a Mac trackpad, OS momentum hides this.

Everything else that reacts to scrolling reads the real scroll position and is unaffected:

- the sticky panels
- `PageMotion.tsx` (IntersectionObservers for cue-lit titles and reveals)
- the nav name's `animation-timeline: scroll(root)` fade
- `Drift.tsx` and the CSS `scroll-snap-type: x` on the small layout's sideways `.row` / `.mosaic` strips, which are nested horizontal scrollers

Lenis 1.3 wraps native scrolling: it intercepts wheel input and eases `window` scroll each frame. Its README states it does not support CSS scroll-snap, `respectReducedMotion` defaults to `true` (lerp forced to 1, programmatic scrolls instant), and it offers `anchors`, `prevent`, `allowNestedScroll` and `data-lenis-prevent` for nested scrollers.

## Goals / Non-Goals

**Goals:**

- One smooth, heavier scroll feel for mouse and trackpad on every OS and screen size.
- Keep "rest on exactly one panel" on the large layout, with at most one panel per gesture.
- Remove the page-level scroll CSS that Lenis replaces, so there is one owner of page scrolling.
- Leave the sideways strips, reveals, cue-lit titles and nav fade working as they do now.

**Non-Goals:**

- Smoothing touch (`syncTouch` stays off).
- Snapping on the small layout.
- Replacing the sideways strips' horizontal CSS snap or `Drift.tsx`. They scroll an element, not the page.

## Decisions

### 1. One client component owns Lenis and the snap rule

A new `src/components/SmoothScroll.tsx` ("use client", renders nothing, effect-only, like `PageMotion` and `Drift`) creates the single Lenis instance on `window`, wires the snap rule, and destroys both on unmount. It is mounted in `src/app/page.tsx` next to `<PageMotion />`, because the snap markers belong to the home page. Lenis's base stylesheet (`lenis/dist/lenis.css`) is imported there.

Options:

- `autoRaf: true`, since nothing else needs Lenis's frame
- `syncTouch: false`
- a low `lerp` for the heavier glide (starting near `0.06`, tuned by hand)
- `respectReducedMotion` left at its default
- `anchors` left off, because nav links go through the snap ease (Decision 4)

Alternatives: `lenis/react`'s `<ReactLenis root>` adds a context provider that nothing here consumes, and it hides the instance the snap rule needs. Mounting in `layout.tsx` would run Lenis on routes without panels; the site has one page, so the page is the honest owner.

### 2. A custom snap rule instead of `lenis/snap`

`lenis/snap` finds the nearest point, so a fling can skip panels. The user chose "stop at each panel", so the rule is written by hand:

```
 home = index of the panel in place (nearest snap point on load)

 wheel/trackpad input (Lenis)          native scroll (keys, scrollbar)
        |                                       |
 clamp Lenis's target to                        |
 [snap[home-1], snap[home+1]]                   |
        |                                       |
        +------ input/scroll idle ~120ms -------+
                          |
            moved < threshold?  --> back to home
            moved > 1 panel?    --> nearest (scrollbar, Home/End)
            otherwise           --> home + direction
                          |
          lenis.scrollTo(point, { duration, easing, lock: true })
                          |
                     onComplete: home = point
```

- **Direction-aware, not nearest.** A single wheel notch (~100px) or arrow key (~40px) must advance a panel, as mandatory snap does today. "Nearest" would pull it back, and the page could never move a panel by arrows.
- **Threshold.** Movements below about 2% of the viewport height count as accidental and settle back on `home`.
- **Clamp only Lenis-driven input.** Wheel and trackpad deltas pass through Lenis, so they can be clamped as they arrive. Use the `virtualScroll` hook if 1.3 lets it adjust or veto deltas; otherwise correct `targetScroll` from the `scroll` event. Confirm which in task 1.2. Native scrolls (keys, scrollbar) can't be clamped. Keys move less than one viewport, so the direction-aware settle covers them. Scrollbar drags and Home/End are deliberate jumps and settle on the nearest panel.
- **`lock: true` during the snap ease.** This ignores the trackpad momentum tail and extra wheel notches while the page settles. That is what makes a hard fling stop at one panel.
- **Settle starts when input goes idle, not when the glide ends.** Otherwise the heavy glide has to finish before the snap ease starts, which adds a second of lag. `scrollTo` takes over from the current position, so the hand-off is continuous.

### 3. Snap points come from the rendered markers; no JS breakpoint

The rule measures the `.snap` markers that render a box (`getClientRects().length > 0`), as `rect.top + scrollY`. On the small layout `layout.css` hides them (`display: none`), so the list is empty and the rule does nothing. Lenis still smooths, and the page can rest anywhere. Markers are re-measured on window resize and on a `ResizeObserver` of `<body>` (fonts and images change heights). Crossing the breakpoint therefore turns snapping on or off without a reload, and the 961/641 breakpoint stays only in CSS.

Alternative: `matchMedia` in JS, which duplicates the breakpoint and was rejected in exploration.

### 4. Nav links go through the snap rule

A delegated click handler for `a[href^="#"]` calls `lenis.scrollTo(target, snap ease)` and sets `home` to the target's snap index. `#top` (the cover) and `#hi` each sit directly after a snap marker, so they land on a panel. Lenis's `anchors` option was considered, but it would use the glide settings and then fight the snap rule's settle.

### 5. Reduced motion is Lenis's default

`respectReducedMotion` forces `lerp: 1` and makes `scrollTo` instant, so the snap rule needs no branch: it jumps. `PageMotion` and `Drift` keep their own reduced-motion checks for non-scroll motion.

### 6. Removed CSS

From `layout.css`:

- `html { scroll-snap-type; scroll-behavior }`
- the small-screen `html { scroll-snap-type: none }`
- the `prefers-reduced-motion` `scroll-behavior: auto` block
- `scroll-snap-align` and `scroll-snap-stop` on `.snap`

The `.snap` rule keeps `height: 0`, and the small-screen `.snap { display: none }` stays, because it is now the switch for Decision 3. The `layout.css` panels comment and the `SnapPoint` comment in `Panel.tsx` are rewritten to describe JS snap points. The `.row` / `.mosaic` horizontal snap in `works.css` stays (see Non-Goals).

### 7. Sideways strips keep horizontal input

The small layout now runs Lenis too, so sideways trackpad swipes and shift-wheel over `.row` / `.mosaic` must still reach the strip. In order of preference:

1. `allowNestedScroll: true`, if it passes horizontal deltas to the strip while vertical ones still smooth the page
2. `data-lenis-prevent-horizontal` (or the 1.3 equivalent) on the strips
3. `data-lenis-prevent` on the strips, which also drops vertical smoothing over them

Task 1.2 checks which one works.

## Risks / Trade-offs

- [Trackpads lose native macOS momentum and feel floatier] → Tune `lerp` / `wheelMultiplier` on both the PC and the MacBook before finishing, and keep the snap ease separate from the glide.
- [Glide plus settle feels laggy with a heavy lerp] → Settle on input idle (Decision 2), and keep the snap ease short (start near 0.8s, ease-out), tuned by hand.
- [The `lock: true` snap ignores a deliberate second gesture during the ease] → Keep the ease short. If it feels unresponsive, release the lock in the last ~20% of the ease.
- [Native keyboard scrolling animates before the settle, so there are two motions] → Accept for now, and check in the browser. If it looks poor, intercept the scrolling keys and call the snap rule directly.
- [Snap points measured before fonts or images settle] → Re-measure on body resize, and re-derive `home` from the nearest point after each measure.
- [Lenis's 1.3 API details (`virtualScroll`, nested-scroll attributes) differ from the README summary] → Task 1.2 checks them against the installed package before the rule is built.
- [The existing wheel test's 1200ms waits no longer fit] → The tests are rewritten around the new scenarios rather than adjusting timeouts.

## Migration Plan

This is a single PR. Rollback is reverting it, which restores the CSS snap. There is no data or URL change.

## Open Questions

- Final `lerp`, `wheelMultiplier`, snap ease duration and idle debounce. These are tuned by hand on the PC and the MacBook.
- Whether intercepting the scrolling keys (Decision 2 risk) is needed, which depends on how the native key scroll plus settle looks.
