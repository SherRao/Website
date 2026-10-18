## Context

The `v5` branch is empty apart from OpenSpec and design skills. The chosen design is a working prototype: `prototypes/home/v/r9-stack.html`, built from `r9.js`, `r9.css`, `r7.css`, `shared.js` and `content.js`. v4 (commit `80cb772`) was Next.js 16 + React 19 + Tailwind v4 + Motion on Vercel, and it has the Spotify and Letterboxd routes and the event photos. See proposal.md for motivation and the specs for required behaviour.

## Goals / Non-Goals

**Goals:**
- Rebuild the Stack prototype faithfully as a statically rendered page with small client-side pieces.
- Keep the techniques that survived testing in the prototypes, and avoid the ones that broke (listed under Decisions).
- Make content edits a one-file job.

**Non-Goals:**
- Project detail pages, a blog, or a CMS.
- Recreating v4's 3D models, loading screen or masonry gallery.
- Filling the content gaps (band, photography, cooking). The site ships with marked placeholders until that content arrives.

## Decisions

**Framework: Next.js App Router, server-rendered by default.** The page is a server component that reads the content module. Only the pieces that need the browser become client components: the spotlight, the reveal observer, animated artworks, the count-ups, and the now-playing card. *Alternative:* a plain static HTML port of the prototype. That would be faster to ship, but it loses typed content, `next/image`, `next/font` and the API routes in one place.

**Panels: CSS `position: sticky` stacked in normal flow, with snap points on markers between panels.** In the prototype, putting `scroll-snap-align` on the sticky panels themselves made every scroll snap back to the first panel, because a pinned panel reports its current position as its snap point. Zero-height markers after each panel, plus the cover, carry the snap points instead (`scroll-snap-type: y mandatory`, `scroll-snap-stop: always`). Pinning and snapping turn off in a media query below 961x641. *Alternative:* a JS scroll-hijack library such as fullPage or GSAP ScrollTrigger. That's heavier, fights native scrolling and accessibility, and isn't needed.

**Spotlight: a fixed lit copy of the name revealed by a moving CSS mask.** A copy of the name sits exactly over the dim one. Only its `mask-image` position (CSS variables) and a separate glow layer move. The first prototype moved the copy inside a moving layer, and the two names drifted apart in some compositing setups. The copy also needs padding so tall letters aren't clipped by the mask. Position is re-measured on resize and on `document.fonts` `loadingdone`. A late font load had shifted the name by 21px.

**Reveals and cues: one shared IntersectionObserver hook plus CSS classes**, with no animation library. Reveals use `filter` (night lighting) and `clip-path: circle()` (aperture) transitions. Panel titles light up on intersection ratio > 0.6 rather than a middle-of-screen band, because pinned titles never reach the middle. *Alternative:* the Motion library. It isn't needed for one-way reveals, so it's left out to keep the bundle small. It can be added later if richer interactive motion arrives.

**Artworks: inline SVG components.** The blue dot uses SVG `animateMotion` and a `pathLength="1"` stroke draw. The Tab crossfade keyframes leave a gap so the two captions are never visible at once (an issue found in testing). Reduced motion renders each artwork's end state.

**Content: `src/content/` typed modules** (profile, products, events, story, off-hours), ported from `prototypes/home/content.js`. Unconfirmed facts carry an `assumed: true` field or comment. Placeholders are typed as `{ needed: true }` so components show the "content needed" marker.

**Live data: route handlers.** `/api/spotify/now-playing` is ported from v4, with a missing-credentials guard and `revalidate: 30`. The client card polls every 30s while the tab is visible. Letterboxd is fetched on the server at build/ISR time (`revalidate: 21600`) and passed to the films card. `/api/letterboxd/recent` is also exposed, sorted by watched date (v4 sorted by score), with fallback to content films.

**Assets: photos re-exported from v4 history** at 1600px long edge, served with `next/image` (AVIF/WebP, explicit sizes). Images inside reveals load eagerly. In the prototype, lazy loading skipped images hidden by `clip-path`. Fonts use `next/font`: Antique Olive locally, and EB Garamond, Geist and Geist Mono from Google.

**Stealth check: a build-time scan driven by an environment variable.** A script searches `.next/` and `public/` for terms listed in a `STEALTH_TERMS` env var (set locally and in CI secrets) and fails the build on any match. The terms themselves are never committed.

**Testing:**
- Vitest for content-shape checks and the Letterboxd/Spotify parsers, with fixtures.
- Playwright for the behaviour specs: panels fit at 1440x900 and 1280x720, snap settles on a panel, the phone layout has no horizontal scroll, reduced motion shows final values, every `.rv` ends up visible, and there are no console errors.

## Risks / Trade-offs

- [Scroll snap with sticky panels behaves differently across browsers and trackpads] → Snap points live on non-sticky markers. Test manually in Safari and Chrome with trackpad and mouse wheel; fall back to `proximity` if mandatory snapping feels too strong.
- [Panels must fit one screen as content grows] → A Playwright check fails if any panel overflows at 1280x720. Short windows already fall back to normal scrolling.
- [Scroll-driven CSS isn't universal] → Nothing essential depends on it. The layout works with IntersectionObserver alone.
- [Spotify refresh token expiry] → The endpoint returns null and the card shows its idle state, so the page never breaks.
- [Placeholders visible at launch] → Placeholders are marked and stealth-safe. The content gaps are listed in Open Questions.

## Migration Plan

1. Build on `v5` with the prototype as the visual reference.
2. Deploy a Vercel preview and check it against the specs.
3. Merge `v5` into `main` to replace the cleared v4 site. Rollback means redeploying the last v4 deployment in Vercel.
4. Delete `prototypes/` once the preview matches.

## Open Questions

- Band name, instrument and recordings; photography; cooking. These fill placeholders only and change no specs.
- Mappedin start date (currently assumed 2025).
- Whether Tab gets a live app URL later (it currently links to GitHub).
- Professional photo for the share image (Instagram profile picture, to be supplied).
