# Tasks

## 1. Spikes and infrastructure

- [x] 1.1 Spike Auth.js v5 with the GitHub provider on Next 16 (`proxy.ts`, Cache Components on) in a throwaway branch; verify a sign-in round trip works locally, and record go/no-go (fall back to hand-rolled GitHub OAuth per design Decision 5 if no-go)
  - **Go** (2026-10-24, `next-auth@5.0.0-beta.32`, Next 16.4.1). With `cacheComponents: true`, `src/proxy.ts` wrapping `auth()` and an `/admin` page reading the session inside `<Suspense>`: the build passes, `/admin` is a partial prerender and `/` stays static. A full round trip ran locally against a mock of GitHub's OAuth endpoints (the provider's `enterprise.baseUrl` pointed at a local server, since no real OAuth app exists yet): the owner id got a session cookie and reached `/admin`; another id was sent to `/api/auth/error?error=AccessDenied` with no session cookie; signed-out `/admin` redirected to sign-in. A round trip against real GitHub waits for 1.3.
- [ ] 1.2 Provision Neon Postgres and Vercel Blob through the Vercel marketplace with separate Neon branches for production, preview and development; verify `vercel env ls` shows the database and Blob variables for all three environments
- [ ] 1.3 Create the GitHub OAuth app and set `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` and `ADMIN_GITHUB_ID` in Vercel; verify with `vercel env ls`
  - 1.2 and 1.3 need the owner's Vercel and GitHub accounts; not done by the implementing agent.
- [x] 1.4 Add dependencies (`zod`, `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `@vercel/blob`, `next-auth`) and verify `pnpm install` and `pnpm build` succeed

## 2. Cache Components switch

- [x] 2.1 Enable `cacheComponents: true` in `next.config.ts` following `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`, and update the Spotify and Letterboxd `revalidate` usage as the guide requires; verify `pnpm build` reports the home page as prerendered and `pnpm test` and `pnpm test:e2e` pass

## 3. Content schema and fixtures

- [x] 3.1 Write `src/content/schema.ts` with one zod schema per section (profile incl. site metadata, socials, glance and `resume.url`; products with `id` and `featured`; events with stats and stage photos; panels with founder works, off-hours placeholders and fallback films), with `assumed` flags and the placeholder union; re-export the inferred types from `types.ts`; verify `pnpm exec tsc --noEmit` passes
- [x] 3.2 Move current content values to `tests/fixtures/content/` in the new shape (add product ids, `featured` on blue dot, tab and shopify, seahorse referenced by id, mark facts flagged as assumed in comments); verify a unit test parses every fixture section with its schema
- [x] 3.3 Add schema unit tests for rejection cases (missing event name, photo without alt text, resume URL not a PDF, `needed: true` without hint); verify `pnpm test` passes

## 4. Data layer

- [ ] 4.1 Add Drizzle schema and migration for `content_sections` and `content_revisions`; verify the migration applies to the development Neon branch
- [ ] 4.2 Implement the content repository (`get(key)`, `save(key, data)` writing the previous row to revisions in one transaction, `listRevisions(key)`, `restore(revisionId)`) with a database implementation and a fixtures implementation selected by `CONTENT_SOURCE`; verify unit tests against the fixtures implementation cover save-records-revision and restore-records-new-save
- [ ] 4.3 Implement cached getters in `src/content/index.ts` (`'use cache'`, `cacheTag('content:<key>')`, `cacheLife('max')`, schema parse, throw on failure); verify a unit test that a schema-invalid row throws rather than returning partial data
- [ ] 4.4 Write `scripts/seed-content.ts` that validates fixtures and upserts each section; verify running it against the development branch and reading back each section matches the fixtures

## 5. Site reads from the data layer

- [ ] 5.1 Update `page.tsx`, `layout.tsx` and `opengraph-image.tsx` to await the getters; replace `FEATURED`/`findProduct` with the `featured` field and seahorse id lookup; verify a unit test that renaming a featured product keeps it featured, and `pnpm build` still prerenders the home page
- [ ] 5.2 Pass content as props into `Nav`, `OffHours` and `ListeningCard`, and update `lib/letterboxd.ts` to get fallback films from the data layer; verify `pnpm test` passes with `letterboxd.test.ts` updated
- [ ] 5.3 Replace the `next.config.ts` resume redirects with `/resume` and `/resume.pdf` route handlers that 307 to `profile.resume.url`, and point site links at `/resume`; add Blob host to `images.remotePatterns`; verify a Playwright test that `/resume.pdf` redirects to the configured URL
- [ ] 5.4 Point Playwright at `CONTENT_SOURCE=fixtures`; verify `pnpm test:e2e` passes with no database configured
- [ ] 5.5 Update `README.md` with content architecture, `CONTENT_SOURCE`, env vars and the seed command; verify the documented seed command runs as written against the development branch

## 6. Authentication

- [ ] 6.1 Configure Auth.js with the GitHub provider, JWT sessions and a `signIn` callback allowing only `ADMIN_GITHUB_ID`; add `requireOwner()` helper; verify unit tests that `requireOwner()` rejects no session and a non-owner id
- [ ] 6.2 Add `proxy.ts` redirecting unauthenticated `/admin/*` to sign-in, following `02-guides/authentication-with-cache-components.md` so the public page stays cached; verify a Playwright test that `/admin` redirects to sign-in when signed out, and `pnpm build` still prerenders the home page

## 7. Admin panel

- [ ] 7.1 Build the `/admin` shell with section navigation and sign-out; verify a Playwright test (with a test session) lists every section
- [ ] 7.2 Implement the save server action (session check, zod parse, repository save, `updateTag`) returning field errors on failure; verify unit tests that an invalid save leaves stored content unchanged and a save without a session is rejected
- [ ] 7.3 Build section editors with list add/remove/reorder for profile, products, events, panels (incl. placeholder "content needed" toggle and `assumed` checkbox); verify a Playwright test that adding a product and reordering products shows on the home page after save
- [ ] 7.4 Build the revisions page with restore per section; verify a Playwright test that restoring the previous revision brings back the earlier headline and the undone version remains in history
- [ ] 7.5 Add resume upload (PDF only, 10 MB cap, Blob `resume/<timestamp>.pdf`, saved into `profile.resume.url` via the save action); verify Playwright tests that a PDF upload changes the `/resume.pdf` target and a non-PDF is rejected
- [ ] 7.6 Add photo upload for stage photos and founder works (image types only, Blob `photos/<uuid>.<ext>`, alt text required); verify a Playwright test that saving a photo without alt text is rejected
- [ ] 7.7 Add the "assumed only" filter view; verify a Playwright test that it lists every fixture field marked assumed
- [ ] 7.8 Run the `web-design-guidelines` review on the admin pages and fix accessibility findings (labels, keyboard reordering, focus on errors); verify with Playwright axe checks on each admin page

## 8. Migration and cleanup

- [ ] 8.1 Run migrations and the seed against production with `CONTENT_SOURCE=fixtures` still set; upload the current resume to Blob and save its URL; verify reading each production section matches the fixtures
- [ ] 8.2 Switch production to `CONTENT_SOURCE=db`; verify the home page, OG image, `/resume` and `/resume.pdf` work on the production URL and an admin edit appears on the next reload
- [ ] 8.3 Remove the old TS content modules and `public/Resume - Nausher Rao.pdf`, keep fixtures; update `openspec`-referenced content paths; verify `pnpm lint`, `pnpm test`, `pnpm test:e2e` and `pnpm build` (including the stealth scan) pass

## Workflow follow-up

- Archive the change after the production switch is verified, syncing the `site-content` delta and the new `content-admin` spec into `openspec/specs/`.
