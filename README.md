<div align="center">

# nausher rao

**one person, four jobs, _mostly at the same time._**

The source for my personal website: engineer, founder, event runner, and band member.

[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

[GitHub](https://github.com/SherRao) · [LinkedIn](https://linkedin.com/in/nausherrao) · [Instagram](https://instagram.com/SherRao15) · [Letterboxd](https://letterboxd.com/SherRao)

</div>

---

## ✨ Features

- **Snap-scrolling panels** for each part of my life: work, products, events, and off hours.
- **Now playing**: a live Spotify card showing what I'm listening to.
- **Recently watched**: films pulled from my Letterboxd feed.
- **Generated Open Graph image** for nice link previews.
- **Stealth scan**: the build fails if any private company details leak into the output.

## 🚀 Getting started

Requires Node.js and [pnpm](https://pnpm.io).

```bash
pnpm install
cp .env.example .env.local   # optional, see below
pnpm dev                     # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `SPOTIFY_CLIENT_ID` | Spotify app client ID (optional) |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret (optional) |
| `SPOTIFY_REFRESH_TOKEN` | Token used to read "now playing" (optional) |
| `STEALTH_TERMS` | Comma-separated words that must never ship. Never commit real values. |

Without the Spotify keys, the music card shows "not listening right now".

## 🧰 Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Build for production, then run the stealth scan |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run end-to-end tests (Playwright) |

## 🗂️ Project structure

```
src/
├── app/         # Routes, layout, API routes, fonts, OG image
├── components/  # Panels, nav, cards, and motion
├── content/     # Site copy and data (profile, products, events)
├── lib/         # Spotify and Letterboxd clients
└── styles/      # Layout, motion, and work styles
scripts/         # Build-time checks (stealth scan)
tests/           # Unit and e2e tests
openspec/        # Specs and change proposals
```

Most text on the site lives in `src/content/`, so copy edits rarely need component changes.

## 🤝 Contributing

Commits follow [Conventional Commits](https://www.conventionalcommits.org) (checked by commitlint). Code is formatted with Prettier.

## 🚢 Releasing

`live` is production (Vercel deploys it). Don't push to it directly.

1. Merge PRs into `main`. [release-please](https://github.com/googleapis/release-please) keeps a release PR open with the next version and changelog.
2. When you're ready to ship, merge the release PR. This tags the release and merges it into `live`, which deploys.

`feat:` commits bump the minor version, `fix:` bumps the patch, and `feat!:` or `BREAKING CHANGE` bumps the major.

---

<div align="center">
<sub>made in waterloo, on 🍁</sub>
</div>
