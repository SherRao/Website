## 1. Project setup

- [x] 1.1 Scaffold a Next.js App Router project with TypeScript, Tailwind v4 (`@tailwindcss/postcss`), ESLint and Prettier on `v5`; verify `pnpm dev` serves a page and `pnpm build` passes
- [x] 1.2 Add Vitest and Playwright as dev dependencies with `test` and `test:e2e` scripts; verify a trivial test passes in each
- [x] 1.3 Restore the event photos and Antique Olive Black from commit `80cb772` into `public/` and `src/app/fonts/`, resizing photos to a 1600px long edge; verify every photo referenced in the prototype exists and each is under 600KB
- [x] 1.4 Set up fonts with `next/font` (Antique Olive local; EB Garamond, Geist, Geist Mono from Google) and the colour, grid and easing tokens from `r7.css`/`r9.css` as CSS variables in `globals.css`; verify the tokens render on a test page
- [x] 1.5 Add `.env.example` with the three Spotify variables and `STEALTH_TERMS`; verify `.env*` (except the example) is gitignored

## 2. Content

- [x] 2.1 Port `prototypes/home/content.js` into typed modules under `src/content/` (profile, products, events, story, off-hours), marking unconfirmed facts as assumed and placeholders as `{ needed: true }`; verify a Vitest check that every product, event and photo has its required fields
- [x] 2.2 Write the stealth scan script (searches `.next/` and `public/` for `STEALTH_TERMS`) and run it after `build`; verify it fails when a test term is planted and passes on a clean build

## 3. Layout

- [x] 3.1 Build the panel shell: fixed top nav, sticky full-screen panels on the grid background, zero-height snap markers, and the small-screen fallback; verify at 1440x900 that panels pin and slide over each other, and at 390x844 that they scroll normally with no horizontal scroll
- [x] 3.2 Build the cover panel (name, headline, intro, "at a glance" row with links); verify everything is visible without scrolling at 1440x900
- [x] 3.3 Build the shared work card (artwork plus museum label) and the engineer panel (blue dot, Tab, Shopify, plus compact product links); verify Tab shows "side project, 2026" and links to GitHub
- [x] 3.4 Build the stage panel mosaic (9 tiles, SpurHacks largest, hover/focus captions) and the events line; verify captions appear on hover and keyboard focus
- [x] 3.5 Build the founder panel (Konfer, SPUR, Seahorse, "untitled" stealth work); verify the stealth work shows only "untitled" and "a new company, in stealth"
- [x] 3.6 Build the off hours panel (music I listen to, music I make, films, photography, cooking) with "content needed" markers; verify placeholders render from content data alone
- [x] 3.7 Build the say hi panel (mailto, GitHub, LinkedIn, Letterboxd, education line); verify the mailto link targets nausher@sherrao.tech

## 4. Motion

- [x] 4.1 Build the spotlight component (fixed lit copy, moving mask and glow, eased follow, re-measure on resize and font load); verify lit and dim names line up after a delayed font load
- [x] 4.2 Build the reveal hook and night/aperture styles with stagger, plus panel title cues at intersection ratio > 0.6; verify every revealable item ends up visible after a full scroll
- [x] 4.3 Build the animated artworks (blue dot route, Tab 6-to-2 crossfade with a caption gap, count-ups, SPUR dots, stealth scan line); verify the Tab captions never overlap and the counters stop at their final values
- [x] 4.4 Implement reduced motion (fully lit name, no reveals, final values, end-state artworks, no smooth scroll); verify with Playwright's `reducedMotion: "reduce"` that nothing animates and all values show

## 5. Live data

- [x] 5.1 Port the Spotify now-playing route with a missing-credentials guard and 30s revalidation; verify it returns null with no env vars and parses a fixture response correctly
- [x] 5.2 Add the Letterboxd recent-films fetch and route (newest first, empty list on failure, 6h revalidation); verify with a fixture RSS feed and a simulated network failure
- [x] 5.3 Wire the music card (polls now playing while the tab is visible, idle state otherwise) and the films card (live films with content fallback); verify both states render without console errors

## 6. Metadata and checks

- [x] 6.1 Add page metadata, Open Graph tags and a share image; verify the tags in the rendered HTML
- [x] 6.2 Write the Playwright suite for the specs (panels fit at 1440x900 and 1280x720, snap settles on a panel, phone layout, keyboard focus order, one h1, image alt text, reduced motion, CLS < 0.1, no console errors); verify it passes
- [ ] 6.3 Compare against `prototypes/home/v/r9-stack.html` at 1440x900 and 390x844 and test snapping by hand in Chrome and Safari with trackpad and mouse wheel; record any differences and fix or note them

## 7. Release

- [ ] 7.1 Deploy a Vercel preview with Spotify env vars and `STEALTH_TERMS` set; verify now playing works and the stealth scan passes in CI
- [ ] 7.2 Remove `prototypes/` once the preview matches; verify the build still passes
