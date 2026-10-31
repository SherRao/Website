# Design

## Context

- Content lives in `src/content/*.ts` (about 330 lines): `site` and `profile` (with socials and `glance`) in `profile.ts`, `products.ts`, `events.ts` (events and `stagePhotos`), and `panels.ts` (panel copy, `founderWorks`, `offHours`, `fallbackFilms`). Types are in `types.ts`.
- Content is imported directly by server code (`page.tsx`, `layout.tsx`, `opengraph-image.tsx`, `lib/letterboxd.ts`) and by components (`Nav`, `OffHours`, `ListeningCard`), plus unit tests.
- `page.tsx` picks featured products with a hard-coded `FEATURED` list of names and `findProduct()`, which throws on an unknown name. `panels.ts` also calls `findProduct("seahorse")` when the module loads.
- The resume is linked as `profile.resume` (a direct `public/` path) in `page.tsx` and `Nav.tsx`, and `/resume` and `/resume.pdf` redirect to it from `next.config.ts`.
- The site runs Next.js 16.4. Per `node_modules/next/dist/docs`, `'use cache'`, `cacheTag`, `cacheLife` and `updateTag` require `cacheComponents: true`. Middleware is now `proxy.ts`. There is a dedicated guide, `02-guides/authentication-with-cache-components.md`.
- Deploys go through Vercel from the `live` branch. Spotify and Letterboxd data already use time-based revalidation and are out of scope.

## Goals / Non-Goals

**Goals:**
- One schema module is the single definition of content shape, used for validation on save, validation on read, and TypeScript types.
- The public page stays in the static shell: content reads are cached with no time-based expiry and invalidated only on save.
- Content code paths can't crash the page on bad data. Reads fall back to the last cached value, and saves are validated before they're written.

**Non-Goals:**
- Multiple editors, roles, or draft/preview workflows. There is one owner, and saves publish immediately.
- Editing Spotify or Letterboxd behavior, layout, styles or motion from the panel.
- Generating the resume PDF. The owner uploads a finished PDF.
- A save-time stealth-term check (decided in exploration).

## Decisions

### 1. Storage: Neon Postgres, one JSON document per section
Table `content_sections(key text primary key, data jsonb not null, updated_at timestamptz)` with keys `profile`, `products`, `events`, `panels`, `jobs`, and `content_revisions(id, key, data jsonb, created_at)`, which is append-only.
- **Why documents, not relational tables:** there's one editor and little content, and the code already reads each section as one object. Whole-section validation and versioning are simpler, and restoring a section is a single row copy.
- **Alternatives:** fully relational tables (more migrations and joins for no benefit at this size); Vercel Edge Config (size limits, and no revision history without building it ourselves).
- **ORM:** Drizzle with `@neondatabase/serverless`. It's light, has typed queries, includes migrations, and the owner already uses it in the Tab project.

### 2. Schema: zod as the single source of truth
`src/content/schema.ts` defines one zod schema per section. Existing types (`Product`, `LiveEvent`, `Photo`, ...) become `z.infer` exports, so components keep their imports.
- `Placeholder` becomes a discriminated field (`{ needed: true, hint } | { needed: false, ...details }`), and an optional `assumed: boolean` is added to facts that can be unconfirmed (roles, dates, event stats).
- `Product` gains `featured: boolean`. `founderWorks.seahorse` stores a product reference by a stable `id` (a new field on products) instead of copying values when the module loads.
- **Alternative:** hand-written TS types plus ad-hoc checks. That would let the panel and the site drift apart.

### 3. Reads: cached per section, invalidated on write
`src/content/index.ts` exports async getters (`getProfile()`, `getProducts()`, ...). Each uses `'use cache'`, `cacheTag('content:<key>')` and `cacheLife('max')`, then parses with the schema. Server pages and `opengraph-image` await them. Client components (`Nav`, `OffHours`, `ListeningCard`) receive content as props from their server parents instead of importing modules.
- Enable `cacheComponents: true` in `next.config.ts`, following `02-guides/migrating-to-cache-components.md`, and audit the existing `revalidate` exports in the Spotify and Letterboxd routes for compatibility.
- **If a read fails** (database down, or a row fails the schema): throw inside the cached function so the previous cached entry keeps serving. Log the error.
- **Alternative:** time-based ISR. It would delay edits and make unnecessary database calls.

### 4. Writes: server actions with `updateTag`
Each section editor submits to a server action. The action verifies the owner session, parses with zod, inserts the old row into `content_revisions`, upserts the new data in a single transaction, then calls `updateTag('content:<key>')`. On validation failure it returns zod field errors to the form.
- `updateTag` is preferred over `revalidateTag`, because the owner should see their change immediately (read-your-own-writes).
- Restore works like a save that uses a revision's data, so the restore itself is also recorded.

### 5. Auth: Auth.js with the GitHub provider, one allowed user
- Auth.js v5 with the GitHub provider and JWT sessions, so no session table is needed. The `signIn` callback allows only the GitHub numeric user id in `ADMIN_GITHUB_ID` (the id doesn't change if the username does).
- `proxy.ts` redirects unauthenticated `/admin` requests to sign-in. It's a usability guard only: every server action and upload handler calls `requireOwner()` itself.
- Admin pages read the session at request time and are not cached. Follow `02-guides/authentication-with-cache-components.md` so session reads don't leak into the public page's cache.
- **Alternatives:** passkeys (more to build, including recovery); a shared password (too weak for something that can rewrite the site).
- **Risk check first:** confirm that Auth.js v5 works with Next 16 (`proxy.ts`, Cache Components) in a spike before building the panel. The fallback is GitHub OAuth handled directly with a signed cookie, about 100 lines of code.

### 6. Files: Vercel Blob
- Resume uploads go to `resume/<timestamp>.pdf`, are checked as `application/pdf`, and are capped at 10 MB. The current resume URL is stored in the `profile` section (`resume.url`), so swapping the resume is an ordinary versioned save, and "earlier resumes remain available" comes for free.
- Photo uploads go to `photos/<uuid>.<ext>`, with image MIME types only. The photo's `src` stores the Blob URL. Add the Blob host to `images.remotePatterns`.
- `/resume` and `/resume.pdf` become route handlers that read `profile.resume.url` and return a 307 (temporary) redirect. They replace the permanent redirects in `next.config.ts`, because browsers cache a 308 forever and would keep serving an old target. Site links point to `/resume` rather than the Blob URL.
- Old Blob files are never deleted automatically, so the revisions that reference them stay valid.

### 7. Admin UI
- Server-rendered forms at `/admin/<section>`, one per section, with list editors (add, remove, reorder) for arrays. Plain React, no admin framework, styled minimally with the existing Tailwind setup.
- A revisions page per section shows the timestamp and a JSON diff summary, with a Restore button.
- An "Assumed only" filter view lists every field marked `assumed: true`, which satisfies the "assumed facts are findable" scenario.
- **Alternative:** Payload or Keystatic as a database-backed CMS. Too heavy for four documents, and it would bring its own conventions into a small codebase.

### 8. Seed and tests
- `scripts/seed-content.ts` imports the current TS modules (kept in git history in the commit that removes them, or under `tests/fixtures/content/`), validates them with the schema, and upserts them. Run once against production and on demand against dev and preview databases.
- The TS content values move to `tests/fixtures/content/*.ts`. Unit tests import the fixtures. Data access goes through a small repository interface, so tests and Playwright can run against a fixture-backed implementation when `CONTENT_SOURCE=fixtures`, with no database needed in CI.

## Risks / Trade-offs

- [The database becomes the source of truth outside git] → The revisions table gives history and restore. Neon's point-in-time recovery covers disasters. An optional "export all content as JSON" button in the panel gives a manual backup.
- [Turning on Cache Components changes rendering across the whole app] → Do it as its own first step, check that the home page still prerenders (with `next build` output) before adding database reads, and follow the migration guide.
- [Auth.js may lag behind Next 16] → Spike first, with a hand-rolled OAuth fallback (Decision 5).
- [The stealth name could be typed into content] → Accepted by the owner. The spec now says so explicitly.
- [A bad save could break the page] → Schema validation on write and on read. Read failures keep the last cache entry.
- [Previews and production sharing a database] → Use separate Neon branches per Vercel environment, and give previews their own Blob prefix or store.
- [A 307 for the resume costs a redirect hop and isn't cached the way a 308 is] → That's acceptable for a link people rarely open.

## Migration Plan

1. Provision Neon and Blob through the Vercel marketplace, create the GitHub OAuth app, and set the environment variables for production, preview and development.
2. Ship the schema, data layer, seed script and Cache Components switch behind `CONTENT_SOURCE` (default `fixtures`), so production behavior is unchanged.
3. Run the database migrations and the seed against production, upload the current resume and photos to Blob, and point `profile` at the Blob URLs.
4. Set `CONTENT_SOURCE=db` in production and verify that the page, the OG image and the `/resume` links work.
5. Ship the admin panel, then remove the TS content modules and the static resume redirects.
6. **Rollback:** set `CONTENT_SOURCE=fixtures` and redeploy. The fixtures remain a complete snapshot as of the migration.

### 9. Existing photos stay in `public/`
A photo's `src` accepts either a site-relative path (`/events/...`) or a Blob URL. The seed keeps the existing `public/events/*` paths. New uploads go to Blob, and replacing an existing photo with an upload works through the same field. This avoids a bulk migration, and every photo is still editable.
