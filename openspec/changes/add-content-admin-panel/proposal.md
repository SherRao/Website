# Proposal

## Why

Every content change on the site (a new role, an updated resume, a new event) currently means editing `src/content/*.ts` or `public/`, opening a PR, merging it, then merging a release-please PR before Vercel deploys `live`. Updating the resume took two merges and a version bump. Content should be editable from a web panel and go live on the next page load, without git or a deploy.

## What Changes

- Move all site content out of the TypeScript modules in `src/content/` into a Neon Postgres database (provisioned through Vercel), stored as one validated JSON document per section: profile (including site metadata, socials and "at a glance"), products, events (including stage photos), panels (including founder works, papers, off-hours and fallback films), and jobs (added by `restructure-career-panels`, which lands first).
- Move the resume PDF and content photos to Vercel Blob storage.
- Add an `/admin` web panel, protected by GitHub sign-in restricted to the site owner's account, for editing every content section, uploading the resume and photos, and restoring earlier versions.
- Validate every save against a shared schema. The existing "content needed" placeholder and "assumed" conventions become explicit fields in the panel.
- Keep a revision history: every save records the previous version of that section, and any revision can be restored.
- Read content on the public site through the Next.js cache (`'use cache'`, tagged per section) and expire the tag on save, so edits are live on the next page load while the site stays as fast as a static page.
- **BREAKING (internal):** `/resume` and `/resume.pdf` stop being static redirects in `next.config.ts` and instead redirect to whichever resume PDF is current in Blob storage. Public URLs keep working.
- **BREAKING (internal):** the featured products on the home page are chosen by a content field instead of a hard-coded list of names in `page.tsx`, so renaming a product in the panel cannot break the page.
- A one-time seed script copies the current `src/content/*.ts` values and `public/` assets into the database and Blob storage. After migration, the TS content modules are removed; the TS types stay as the schema's inferred types.
- No save-time check for the stealth company's name. The existing build-output scan stays for code; content entered in the panel is the owner's responsibility.

## Capabilities

### New Capabilities
- `content-admin`: the owner-only web panel: sign-in, editing each content section, validation, revision history and restore, and uploading the resume and photos.

### Modified Capabilities
- `site-content`: content comes from the database through one shared schema instead of a TS module; "assumed" facts and placeholders are schema fields; the stealth requirement is narrowed to what the build scan enforces; the resume link points to the current uploaded PDF.
- `live-data`: the films card's fallback films come from the content store instead of the content module.

## Impact

- **Code:** `src/content/` (modules replaced by a schema and a cached data-access layer), `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/opengraph-image.tsx`, `src/lib/letterboxd.ts`, and the components that import content directly (`Nav`, `OffHours`, `ListeningCard`), which will receive content as props instead. New `src/app/admin/` routes, server actions, and an auth route.
- **Config:** `next.config.ts` (enable `cacheComponents`, remove the static resume redirects, allow Blob image hosts).
- **Dependencies:** a Postgres client/ORM for Neon, `@vercel/blob`, an auth library (Auth.js with the GitHub provider), and a schema library (zod).
- **Infrastructure:** Neon Postgres and Vercel Blob added through the Vercel marketplace; a GitHub OAuth app; new environment variables (database URL, Blob token, auth secret, GitHub client ID/secret, allowed GitHub user).
- **Tests:** unit tests in `tests/unit/content.test.ts` and `letterboxd.test.ts`, and Playwright e2e tests, move to seed data instead of the TS modules.
- **Release flow:** content edits no longer go through PRs or release-please; code changes still do.
