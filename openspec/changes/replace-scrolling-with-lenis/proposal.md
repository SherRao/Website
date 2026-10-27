# Proposal

## Why

Page scrolling feels different on each machine. On a Windows PC with a mouse wheel, each notch is a discrete jump, and `scroll-snap-type: y mandatory` snaps it straight to the next panel, so the page feels quick and abrupt. On a MacBook trackpad, macOS momentum makes the same page feel gentle. Lenis smooths wheel and trackpad input the same way everywhere, so the page gets one deliberate, cinematic feel on every machine. Lenis doesn't support CSS scroll snap, so panel snapping has to move into JavaScript at the same time.

## What Changes

- **Lenis drives page scrolling** for mouse and trackpad on every screen size, with a heavier, cinematic glide. Touch keeps native scrolling.
- **Panel snapping moves from CSS to a custom snap rule** on top of Lenis. One gesture (a wheel spin, a trackpad fling, a scrolling key press) moves the page at most one panel, then it settles with its own quicker ease. Jumps the visitor aims directly (scrollbar drags, Home/End, nav links) settle on the nearest panel instead. This replaces `scroll-snap-stop: always`. Lenis's `lenis/snap` add-on is not used, because it would let a fling skip panels.
- **Snapping is always on, and the layout decides where the snap points are.** The rule snaps to whichever `.snap` markers are rendered. The small layout already hides them, so it scrolls smoothly without snapping. JavaScript has no breakpoint of its own; `layout.css` stays the single owner of the 961px / 641px breakpoint.
- **Nav links (`#top`, `#hi`) glide with Lenis** and land on a panel.
- **Reduced motion is handled by Lenis.** Its `respectReducedMotion` default turns smoothing off and makes programmatic scrolls instant, so the snap rule simply jumps.
- **The existing page-scrolling CSS is removed:**
    - `html { scroll-snap-type; scroll-behavior }`
    - the small-screen `scroll-snap-type: none` override
    - the reduced-motion `scroll-behavior: auto` block
    - `scroll-snap-align` and `scroll-snap-stop` on `.snap`

    The zero-height `.snap` markers stay, as the snap rule's points.

- **Kept on purpose:** the sideways work and photo strips on the small layout (`.row`, `.mosaic`). Their horizontal CSS snapping and `Drift.tsx` drive a nested horizontal scroller, not the page, and Lenis never controls them. Also kept: the nav name's `animation-timeline: scroll(root)` fade and the IntersectionObservers in `PageMotion.tsx`. All of these read the real scroll position, which Lenis still updates.

Out of scope: smoothing touch scrolling, snapping on the small layout, and changing panel structure or motion other than scrolling.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `home-layout`: "Scrolling snaps to panels" becomes one gesture at most one panel for wheel, trackpad and scrolling keys. Scrollbar drags, Home/End and nav links settle on the nearest panel. "Small screens scroll normally" becomes smoothed but not pinned or snapped.
- `motion`: a new "Smooth page scrolling" requirement. "Reduced motion" now says that page scrolling follows input directly and in-page jumps are instant.

## Impact

- Dependencies: adds `lenis` (^1.3) as a runtime dependency.
- Code:
    - a new client component that owns Lenis and the snap rule, mounted in `src/app/page.tsx` next to `PageMotion`
    - `src/styles/layout.css` (remove the page snap and smooth-scroll CSS, add the Lenis base styles)
    - `src/components/Panel.tsx` (update the `SnapPoint` comment)
    - `.row` / `.mosaic` strips (a nested-scroll opt-out if needed)
- Tests: `tests/e2e/quality.spec.ts` (wheel snap test), `tests/e2e/motion.spec.ts` (the reduced-motion `scrollBehavior` assertion), `tests/e2e/layout.spec.ts` (the phone `scrollSnapType` assertion and a nav-link landing test).
