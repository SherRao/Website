# Tasks

## 1. Setup

- [x] 1.1 Add `lenis` (^1.3) with `pnpm add lenis`. `node_modules/next/dist/docs` is missing in this checkout, so run `pnpm install` and find the Next 16 docs as AGENTS.md requires. Read the client component and CSS import guides before writing code. Verify that `pnpm exec tsc --noEmit` passes.
- [x] 1.2 Check the installed Lenis 1.3 API against design.md:
    - whether `virtualScroll` can adjust or veto deltas (used to clamp the target), or `targetScroll` has to be corrected from the `scroll` event
    - `scrollTo` with `lock`, `duration`, `easing` and `onComplete`
    - which nested-scroll option keeps horizontal input on `.row` / `.mosaic` (`allowNestedScroll`, a horizontal-only prevent attribute, or `data-lenis-prevent`)

    Record the findings as a note under this task.

    > **Findings (lenis 1.3.27):**
    >
    > - `virtualScroll(data)` runs before Lenis reads `data`, so it can both adjust (mutate `data.deltaY`) and veto (return `false`). A veto skips Lenis's `preventDefault`, so the hook must call `event.preventDefault()` itself or the browser scrolls natively. A delta mutated to `0` is treated as an unknown gesture and also falls through to native, so a fully clamped delta is vetoed rather than zeroed. Correcting `targetScroll` from the `scroll` event is not needed.
    > - `scrollTo(target, { lock, duration, easing, onComplete, force })` all exist. `lock` sets `isLocked` on start; while locked, wheel input is `preventDefault`ed and ignored, and further `scrollTo` calls are dropped unless `force: true`. Lock clears on completion (`reset()`). A programmatic `scrollTo` animates from `animatedScroll`, so it takes over a running glide without a jump. If the target equals `targetScroll`, `onComplete` fires immediately.
    > - With `respectReducedMotion` (default `true`), programmatic `scrollTo` becomes `immediate` and wheel input uses `lerp: 1`.
    > - Nested scroll: `allowNestedScroll: true` hands a gesture to a nested scroller only along the gesture's dominant axis (`hasNestedScroll` checks `overflow-x`/`scrollLeft` for horizontal-dominant deltas, `overflow-y`/`scrollTop` for vertical ones). Vertical deltas over a `.row` / `.mosaic` strip still smooth the page; horizontal ones go to the strip (`overscroll-behavior-x: contain` keeps them there at the ends). Pure-horizontal deltas (`deltaY === 0`) are never touched by Lenis at all. `data-lenis-prevent-horizontal` also exists as a fallback. Chosen: `allowNestedScroll: true`.

## 2. Remove the existing page scroll code

- [x] 2.1 In `src/styles/layout.css`, remove:
    - `html { scroll-snap-type; scroll-behavior }`
    - `scroll-snap-align` and `scroll-snap-stop` from `.snap` (keep `height: 0`)
    - the small-screen `html { scroll-snap-type: none }`
    - the `prefers-reduced-motion` `scroll-behavior: auto` block

    Keep the small-screen `.snap { display: none }`, and rewrite the panels comment so it describes JS snap points. Verify with `grep -n "scroll-snap\|scroll-behavior" src/styles/layout.css` that nothing is left, while `works.css`'s strip snap stays.

- [x] 2.2 Update the `SnapPoint` and `Panel` comments in `src/components/Panel.tsx` so they say the markers are the snap rule's points.

## 3. Lenis and the snap rule

- [x] 3.1 Add `src/components/SmoothScroll.tsx` (client, renders nothing). It creates Lenis on `window` (`autoRaf`, `syncTouch: false`, low `lerp`, default `respectReducedMotion`), imports `lenis/dist/lenis.css`, and destroys Lenis on unmount. Mount it in `src/app/page.tsx` next to `<PageMotion />`. Verify the wheel glides on the small layout at 1440x600, and touch emulation scrolls natively.
- [x] 3.2 Measure the snap points from the rendered `.snap` markers (`getClientRects().length > 0`). Re-measure on window resize and on a body `ResizeObserver`, and re-derive `home` from the nearest point after each measure. Verify there are 7 points at 1440x900, and 0 at 390x844 and 1440x600.
- [x] 3.3 Build the settle step:
    - start it when input or scrolling has been idle for about 120ms
    - under the threshold (about 2% of the viewport), go back to `home`
    - more than one panel away, go to the nearest point
    - otherwise go to `home` plus the direction
    - ease with `lenis.scrollTo(..., { lock: true })` and set `home` on completion

    Verify that one wheel notch, Page Down and the down arrow each land on the next panel at 1440x900.

- [x] 3.4 Clamp the target of Lenis-driven input to `[snap[home-1], snap[home+1]]`, using the hook found in 1.2. Verify that a hard wheel spin (for example a 3000px delta) and a long trackpad-style burst of wheel events move exactly one panel.
- [x] 3.5 Add a delegated click handler for `a[href^="#"]` that eases to the target with the snap ease and sets `home`. Verify that `#hi` and the nav name (`#top`) land fully in place at 1440x900.
- [x] 3.6 Keep horizontal input on the `.row` / `.mosaic` strips with the option chosen in 1.2. Verify at 390x844 that a sideways wheel over a strip changes its `scrollLeft` but not `scrollY`, and that `Drift.tsx` still holds and resumes the strip.
- [ ] 3.7 Tune `lerp`, `wheelMultiplier`, the snap ease (start around 0.8s, ease-out) and the idle debounce by hand, on both the Windows PC and the MacBook, toward a heavier, cinematic feel without lag. Record the final values and the reasoning in a comment next to them.

## 4. Tests

- [x] 4.1 `tests/e2e/quality.spec.ts`: replace "wheel scrolling settles on a snap point" with tests that:
    - one notch lands on the next panel
    - a hard spin moves exactly one panel
    - Page Down lands on the next panel
    - a scrollbar-style jump (`scrollTo` partway through a later transition) settles on the nearest panel

    Every one must rest on a snap point within 2px.

- [x] 4.2 `tests/e2e/motion.spec.ts`: replace the reduced-motion `scrollBehavior` assertion with "one wheel notch lands on the next panel straight away" (within about 300ms, with no intermediate frames). Add a 390x844 test that a sideways wheel over a strip scrolls the strip, not the page.
- [x] 4.3 `tests/e2e/layout.spec.ts`:
    - replace the phone `scrollSnapType` assertion with "a scroll stopped partway through a panel stays where it is"
    - add a 1440x600 test that the wheel can rest partway through a panel
    - add a resize test from 1440x600 to 1440x900 that snapping starts without a reload
    - add a test that clicking "say hi" lands `#hi` fully in place

## 5. Integration checks

- [x] 5.1 Verify the sticky panels, cue-lit titles, reveals, count-ups and the nav name fade still work with Lenis, using the existing `layout.spec.ts` and `motion.spec.ts`.
- [x] 5.2 Verify that `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm test:e2e` and `pnpm build` pass.
