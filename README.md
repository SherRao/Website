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
| `CONTENT_SOURCE` | Where content comes from: `fixtures` (default, no database) or `db` |
| `DATABASE_URL` | Neon Postgres connection string (needed when `CONTENT_SOURCE=db`, and for `db:migrate` and `db:seed`) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token, for resume and photo uploads from the admin panel |
| `AUTH_SECRET` | Secret that signs admin sessions (`npx auth secret` makes one) |
| `AUTH_GITHUB_ID` | GitHub OAuth app client ID, for admin sign-in |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |
| `ADMIN_GITHUB_ID` | The numeric GitHub user id allowed into the admin panel |
| `SPOTIFY_CLIENT_ID` | Spotify app client ID (optional) |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret (optional) |
| `SPOTIFY_REFRESH_TOKEN` | Token used to read "now playing" (optional) |
| `STEALTH_TERMS` | Comma-separated words that must never ship. Never commit real values. |

Without the Spotify keys, the music card shows "not listening right now". Without any of the others, the site runs on the fixture content and the admin panel can't be signed into.

## 📝 Content

Site content (copy, roles, products, events, photos, links and the resume) lives in a Neon Postgres database, one JSON document per section: `profile`, `products`, `events` and `panels`. It's edited from the admin panel at `/admin`, and edits are live on the next page load, with no deploy.

- **Schema.** `src/content/schema.ts` defines every section with zod. Saves are checked against it, reads are checked against it, and the TypeScript types in `src/content/types.ts` come from it.
- **Reads.** `src/content/index.ts` has one getter per section (`getProfile()`, `getProducts()`, ...). Each is cached with `'use cache'` and tagged `content:<section>`, so the page stays static until a save expires the tag. If a read fails, the last good cached content keeps serving.
- **History.** Every save records the section's previous version in `content_revisions`, and any revision can be restored.
- **Files.** The resume and uploaded photos live in Vercel Blob. `/resume` and `/resume.pdf` redirect to the current resume.
- **Fixtures.** `tests/fixtures/content/` holds a full copy of the content. With `CONTENT_SOURCE=fixtures` (the default), the site reads it instead of the database, so tests and CI need no database, and switching production back to `fixtures` is the rollback.

### Database setup

```bash
DATABASE_URL=... pnpm db:migrate   # create or update the tables
DATABASE_URL=... pnpm db:seed      # copy tests/fixtures/content into the database, then check it reads back the same
```

The seed validates every section first and writes nothing if one fails. Running it again overwrites the content with the fixtures, recording what it replaced as revisions. After changing `src/db/schema.ts`, run `pnpm db:generate` to write a new migration into `drizzle/`.

## 🧰 Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Build for production, then run the stealth scan |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run end-to-end tests (Playwright) |
| `pnpm db:generate` | Write a SQL migration after changing `src/db/schema.ts` |
| `pnpm db:migrate` | Apply migrations to `DATABASE_URL` |
| `pnpm db:seed` | Copy the fixture content into `DATABASE_URL` |

## 🗂️ Project structure

```
src/
├── app/         # Routes, layout, API routes, fonts, OG image
├── components/  # Panels, nav, cards, and motion
├── content/     # Content schema, cached getters and the content store
├── db/          # Database tables and the Postgres content store
├── lib/         # Spotify, Letterboxd and resume helpers
└── styles/      # Layout, motion, and work styles
drizzle/         # SQL migrations
scripts/         # Stealth scan, migrations and the content seed
tests/           # Unit and e2e tests, and the content fixtures
openspec/        # Specs and change proposals
```

Text on the site comes from the content store (see [Content](#-content)), so copy edits need no code changes.

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
