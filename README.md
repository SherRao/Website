# Website v4 — Multi-Variant Redesign

Three full design directions for [`nausher rao`](https://sherrao.tech)'s portfolio, all in one Next.js app so you can A/B them side-by-side and pick the vibe before we polish a final.

## Quickstart

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

Optional: copy `.env.example` to `.env.local` and fill in the Spotify
credentials if you want the live "now playing" chip to work in dev. The
Letterboxd `/api/movies/watched` route works without any setup.

## Routes

| URL          | Variant     | Vibe                                                              |
| ------------ | ----------- | ----------------------------------------------------------------- |
| `/`          | picker      | three-card grid that links to each variant.                       |
| `/editorial` | "Aurora"    | refined / immersive / motion-rich (Poppr.be + Madeinevolve).      |
| `/brutalist` | "Terminal"  | sharp / mono / dense (Webisoft + Chkstepan).                      |
| `/studio`    | "Studio"    | playful / mixed-media / loud (Oryzo + a touch of Poppr).          |

## Sections (each variant covers all six)

1. **Hero** — name + roles + the angle for the variant
2. **Builder** — software, ai products, project management, game design (the
   "passionate technical" side: Konfer, SpurHacks, HawkHacks, SPUR, this site,
   plus experience at NEAR / SPUR / Konfer)
3. **Connector** — community, leadership, live production (the "passionate
   people" side: SpurHacks 2025, HawkHacks 2024, Collision Yacht Soirée, SPUR
   BBQ Festival)
4. **Creative / Hobbies** — music + game design (placeholder content for now)
5. **Contact** — email + socials
6. **Footer** — name lock-up, NowPlaying chip, source link

## Where to edit content

All copy and data is centralized so you edit once and every variant updates.

- [`src/data/profile.ts`](src/data/profile.ts) — name, roles, bio, tagline
- [`src/data/projects.ts`](src/data/projects.ts) — Konfer, SpurHacks, HawkHacks, SPUR, this site
- [`src/data/events.ts`](src/data/events.ts) — full event records with stats + image arrays
- [`src/data/experiences.ts`](src/data/experiences.ts) — NEAR / SPUR / Konfer roles
- [`src/data/education.ts`](src/data/education.ts) — Wilfrid Laurier
- [`src/data/pillars.ts`](src/data/pillars.ts) — the four "builder" + four "connector" pillars
- [`src/data/creative.ts`](src/data/creative.ts) — **placeholder** music + game projects (TODO)
- [`src/data/socials.ts`](src/data/socials.ts) — GitHub / LinkedIn / Twitter / Discord

## Where to edit visuals

- [`src/app/globals.css`](src/app/globals.css) — color tokens (`--background`,
  `--foreground`, `--perlwinkle`, `--warm`, `--teal`, `--bone`, `--ink`) and
  per-variant body overrides (`body[data-variant="..."]`).
- [`src/app/layout.tsx`](src/app/layout.tsx) — Antique Olive (heading) + Outfit
  (body) + JetBrains Mono fonts wired through CSS variables.
- [`src/components/shared/`](src/components/shared/) — `LenisProvider`,
  `NowPlaying` (3 visual treatments: chip / minimal / sticker),
  `RotatingCreeper`, `SocialMediaIcons`, `Button`, `BackgroundBlob`,
  `VariantNav`, `ScrollingMarquee`.
- [`src/components/{editorial,brutalist,studio}/`](src/components/) —
  variant-specific helper components.
- [`src/sections/{editorial,brutalist,studio}/`](src/sections/) — the actual
  Hero / Builder / Connector / Creative / Contact / Footer per variant.

## TODOs before launch

The plan was to ship the structure with **placeholder creative content**, all
clearly marked. To turn the Creative / Hobbies sections real:

- [ ] Replace the four `music[]` entries in
  [`src/data/creative.ts`](src/data/creative.ts) with real tracks. Each entry
  has a `cover`, `title`, `type`, `year`, `description`, `duration`, and a
  `todo: true` flag — drop the flag and swap in real assets in
  `public/creative/music-*.svg` (or use `.png`/`.jpg`).
- [ ] Replace the three `games[]` entries the same way. Drop the flag.
- [ ] Optional: provide real cover art under `public/creative/` to replace the
  generated SVG placeholders.
- [ ] Optional: wire a real `Resume - Nausher Rao.pdf` (currently the same one
  copied from the old site lives in `public/`).
- [ ] Optional: tighten meta / OG images per variant if you ship more than one.

## Stack

- Next.js 16 (App Router) + React 19 + Tailwind CSS v4
- [Motion](https://motion.dev) for animations, [Lenis](https://lenis.darkroom.engineering/)
  for smooth scroll, [React Three Fiber](https://r3f.docs.pmnd.rs/) + Drei for
  the rotating Creeper FBX
- TypeScript everywhere, ESLint + Prettier (with `prettier-plugin-tailwindcss`)
- Vercel Speed Insights wired in `layout.tsx`

## API routes

- `GET /api/spotify/now-playing` — live Spotify "now playing" track. Requires
  `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` / `SPOTIFY_REFRESH_TOKEN`. Returns
  `null` (and the UI shows "not playing") when env is missing.
- `GET /api/movies/watched` — pulls the latest watched films from
  `letterboxd.com/SherRao/rss/`, parses them with `fast-xml-parser`, returns
  them sorted by score desc. No auth required.

## Notes / small caveats

- Lenis intercepts plain `window.scrollTo`, so route changes use `useLenis().scrollTo(0)`
  in [`src/components/shared/LenisProvider.tsx`](src/components/shared/LenisProvider.tsx)
  to reset position when navigating between variants.
- `body[data-variant]` is set by each variant's `VariantBody` component on
  mount and intentionally **not cleared on unmount**, since cleanup runs after
  the next variant's mount in App Router transitions.
- The Creeper FBX texture is referenced internally as
  `3-35356_minecraft-creeper-head-png-transparent-png.png` — that file is a
  symlinked copy of `creeper.png` so the texture loads.

---

When you've picked a winner, the easiest migration path is to lift the
chosen `src/sections/<variant>/`, the variant-specific
`src/components/<variant>/`, and the shared layer back into the main repo,
swap in the existing site's hero/footer entry points, and ship.
