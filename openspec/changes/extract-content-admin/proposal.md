# Proposal

## Why

The content admin panel lives inside the portfolio at `/admin`, so it can only ever edit this one site. The owner is about to start more projects that need the same thing (the first is a standalone recipe site), and wants one private panel that manages all of them instead of rebuilding sign-in, editors, history and uploads in every project.

## What Changes

- The site keeps everything that makes its content correct: the Neon store, the zod schemas, validation, revision history, the resume PDF check, its Blob store and its cache invalidation.
- The site gains a signed content API under `/api/admin/v1/` that only the admin app can call. It covers a manifest, reading a section for editing, saving, revision history, restoring, and upload authorization. Every request is HMAC-signed with a per-project secret.
- The site serves its own editing layout (the field definitions now in `src/app/admin/_editor/fields.ts`) through the manifest. That makes the layout data the admin renders, not code the admin imports.
- Saves and restores through the API expire the section's cache tag immediately, so edits still go live on the next page load. Route handlers can't call `updateTag`, so this uses `revalidateTag(tag, { expire: 0 })`.
- A new standalone admin app, in its own repo at `admin.sherrao.tech`, takes over the panel: GitHub sign-in for the owner only, the section editors, history and restore, assumed facts, and uploads. It reaches each registered project only through that project's content API, and it has no database of its own.
- Uploads still go straight from the browser to the site's own Blob store. The site issues the upload authorization and the admin relays it, so the admin never holds a project's storage credentials.
- **BREAKING**: `/admin`, `/api/auth/*`, the sign-in proxy, Auth.js and the `AUTH_*` and `ADMIN_GITHUB_ID` environment variables are removed from the site once the new panel is verified in production. `/admin` on the public site returns 404.
- Out of scope: the recipe app itself, which becomes the second project in its own change and repo.

## Capabilities

### New Capabilities

- `content-api`: the site's signed, machine-to-machine interface for reading, saving, restoring and uploading content, which any admin panel uses to manage it.

### Modified Capabilities

- `content-admin`: the panel moves to its own host and authenticates to projects with signed requests. It manages several registered projects, resolves previews and links against each project, and refuses projects whose contract version it doesn't support. The public site no longer serves admin pages.

## Impact

- **Site code**: new `src/app/api/admin/v1/**` route handlers and a request-signing module. `fields.ts` moves into `src/content/`. `src/lib/content-admin.ts` no longer checks the session itself. The following are removed: `src/app/admin/**`, `src/auth.ts`, `src/app/api/auth/**`, `src/proxy.ts`, `src/lib/owner.ts` and `src/lib/require-owner.ts`.
- **Site config**: `next.config.ts` drops the CSP exclusions for `/admin` and `/api/auth`, the `/admin` header block and `NEXT_DIST_DIR`. `playwright.config.ts` drops the second admin server. `robots.ts`, `.gitignore`, `.oxfmtrc.json`, `README.md` and `.env.example` are updated.
- **Dependencies**: `next-auth` is removed from the site. `@vercel/blob`, `zod` and `drizzle-orm` stay.
- **Environment**: the site gains `ADMIN_API_SECRETS`. The admin app needs `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `ADMIN_GITHUB_ID` and a secret plus base URL for each project. It also needs a new GitHub OAuth app whose callback is on `admin.sherrao.tech`.
- **Data**: no schema or data migration. The Neon database and Blob store stay attached to the site's Vercel project.
- **Tests**: editor, form-state, slug, paging, owner and proxy tests and the admin e2e suite move to the admin repo. The site gains API unit tests and an e2e that publishes through the signed API.
- **Release**: the API must reach `live` before the admin app points at it. The in-site panel is removed only after the new one is verified in production.
