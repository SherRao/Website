## Why

The v5 branch has no site: v4 was cleared to start over, and a new direction was chosen after nine rounds of prototypes ("Stack", in `prototypes/home/v/r9-stack.html`). v4 described one job title at a time; v5 needs to show an engineer, founder, stage manager and bandmate as one person, get to the important information fast, and feel crafted without being noisy.

## What Changes

- New Next.js app on the `v5` branch that rebuilds the chosen "Stack" prototype as a production site.
- The home page is a sequence of full-screen panels on a dark, gridded "night gallery" background. Each panel pins in place and the next slides over it, with scroll snapping to each panel. Phones and short windows fall back to normal scrolling.
- Six panels: cover (spotlight name, headline, intro, "at a glance" facts), the engineer (gallery works with museum labels), the stage (event photo mosaic), the founder (companies, including an unnamed stealth company), off hours (music, films, photography, cooking), and say hi.
- Motion: a cursor followspot on the name, works and photos that light up and open through a circle as they arrive, chapter titles that light up when their panel lands, animated artworks and count-ups. All of it has a reduced-motion fallback.
- Live data: Spotify "now playing" and recent Letterboxd films, ported from the v4 API routes (commit `80cb772`).
- All copy and data in one typed content module, so content gaps (band, photography, cooking) can be filled without touching components.

## Capabilities

### New Capabilities
- `home-layout`: the panel structure of the home page, its sections and their content, scroll pinning and snapping, navigation, and the small-screen fallback.
- `motion`: the spotlight, reveal effects, cue-lit titles, animated artworks, count-ups, and reduced-motion behaviour.
- `live-data`: the Spotify now-playing and Letterboxd recent-films endpoints and how the page shows them, including their empty and failure states.
- `site-content`: the typed content source, placeholder handling for missing content, and the rule that the stealth company is never named or described.

### Modified Capabilities
- None. There are no existing specs.

## Impact

- New app code under `src/` with `package.json`, Next.js, Tailwind v4 and Motion. Dependencies and versions are re-chosen, not copied from v4.
- Assets: event photos and the Antique Olive font restored from v4 history (`80cb772`), with photos resized for the web.
- Environment: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and `SPOTIFY_REFRESH_TOKEN` are needed for now-playing. The page must still work without them.
- `prototypes/` stays as the reference until the new home page matches it, then gets removed.
- Deployment target is unchanged from v4 (Vercel).
