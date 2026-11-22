# Design

## Context

See proposal.md for the motivation. These are the facts about `main` (0.11.3) that shape the approach:

- **The editor is already generic.** `src/app/admin/_editor/*` imports nothing from the content schema at runtime, only `SectionKey` as a type. It renders a serializable field description (`SECTIONS` in `fields.ts`) and shows the field errors the server returns. The only parts of that description that aren't plain data are the `empty: () => object` factories, 16 of them, and one of those uses `new Date().getFullYear()`.
- **Server-side logic is tied to the session.** `saveSectionContent` and `restoreRevisionContent` in `src/lib/content-admin.ts` call `requireOwner()` (Auth.js) and `updateTag()`. Pages read the store directly through `loadSectionForEditing` and `getRepository()`.
- **`updateTag` only works in Server Actions.** Route handlers must use `revalidateTag(tag, profile)`. The recommended `"max"` profile serves stale content on the next request, which would break "edits go live on the next page load". `{ expire: 0 }` makes the next request a blocking miss. Source: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidateTag.md` and `updateTag.md`.
- **GET route handlers run at request time under Cache Components** when they read request data. A handler that verifies a signature from headers is therefore never prerendered.
- **Uploads are locked to the site's own Blob store.** `next.config.ts` limits `images.remotePatterns` to the host derived from the site's `BLOB_READ_WRITE_TOKEN` (`blobStoreHost`). A photo stored in any other store would fail to render on the site.
- **The upload route uses the Vercel Blob client-upload protocol.** `handleUpload` answers `{ type: "blob.generate-client-token", clientToken }`, and the browser then uploads straight to Blob. Without Blob, in local fixture mode, the route takes the file itself and serves it from `/uploads/*` on the site.
- **Previews assume the admin and the site share an origin.** `UploadButton` previews a root-relative `src` such as `/events/...` or `/uploads/...` as-is, and the layout's "View site" link is `href="/"`.
- **The site decides whether editing is allowed.** "Saving is off" (`canSaveContent()`) and the upload mode are computed from the site's own environment.
- **Tests.** Admin e2e tests run against a second copy of the site build (`.next-admin`, `NEXT_DIST_DIR`) on port 3210. They sign in by minting an Auth.js cookie.
- **Deploys.** Production deploys from the `live` branch through release-please. Neon and Blob are attached to the site's Vercel project.

## Goals / Non-Goals

**Goals:**

- The site stays the only authority on its content: validation, versions, history, the resume check, cache invalidation and file storage.
- The admin app holds no project data and no project storage credentials. It holds only an API address and secret for each project.
- Adding a project means registering it with the admin, not writing editor code in the admin.
- No downtime and no data migration. The old panel keeps working until the new one is proven in production.

**Non-Goals:**

- The recipe app. It will be the second project, in its own repo and change.
- Multiple users, roles, drafts or previews of unpublished content. There is still one owner, and saves publish immediately.
- Generating forms from the schemas. Projects keep hand-written layouts.
- An admin-side database, shared sessions across hosts, or an audit trail of who saved. There is one owner.
- A stricter CSP for the admin app. It keeps parity with today's admin headers, and tightening them is a follow-up.

## Decisions

### 1. The project owns the data, the admin owns identity and UI

| Stays in the site                               | Moves to the admin app                                     |
| ----------------------------------------------- | ---------------------------------------------------------- |
| Store, schemas, validation, versions, revisions | GitHub sign-in (Auth.js, owner id only)                    |
| Resume PDF check, Blob store, upload rules      | Editor renderer, history view and diff, flagged-facts view |
| Cache invalidation                              | Upload relay, project registry                             |
| Editing layout (as manifest data)               |                                                            |

**Alternative: the admin writes directly to each project's database.** Rejected. Every project's schema would then live in the admin, a bad save could skip a project's validation, and the cache invalidation problem the API solves would come back.

### 2. The contract: JSON over HTTPS under `/api/admin/v1/`

| Method and path                             | Purpose                                                                                                                                | Answers                                         |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `GET /manifest`                             | contract version, project name and origin, sections with layouts, upload kinds, flags, `saving` (`{ enabled, reason? }`), `uploadMode` | 200                                             |
| `GET /sections/:key`                        | `{ data, issues, missing, version }`, read through `loadSectionForEditing`                                                             | 200, 404                                        |
| `PUT /sections/:key`                        | body `{ data, version }`, answer `SectionSaveResult`                                                                                   | 200, 409 stale, 422 invalid, 503 read-only, 404 |
| `GET /sections/:key/revisions?limit&offset` | `{ current, revisions: [{ id, createdAt, data }] }`                                                                                    | 200, 404                                        |
| `POST /sections/:key/revisions/:id/restore` | `SaveResult`                                                                                                                           | 200, 404, 422, 503                              |
| `POST /uploads/token`                       | forwarded `HandleUploadBody`, answer Blob's client-token reply                                                                         | 200, 400, 503                                   |
| `POST /uploads`                             | multipart file in local fixture mode, answer `{ url }`                                                                                 | 200, 400, 503                                   |

- Every rejection body has the existing `Rejection` shape (`{ ok: false, message, fieldErrors }`), so the editor's error handling ports unchanged.
- The manifest's `contract` is an integer. The admin supports a set of versions and marks any other as unavailable (the `content-admin` spec covers this). Breaking changes add a `/v2/` prefix and bump the number.
- No CORS headers are sent. Browsers never call the API; only the admin's server does.

### 3. Request signing: HMAC-SHA256 with a timestamp

- Headers `x-admin-timestamp` (Unix seconds) and `x-admin-signature` carry `hex(HMAC-SHA256(secret, METHOD \n PATH?QUERY \n TIMESTAMP \n hex(SHA-256(body))))`.
- The site accepts a timestamp within ±300 seconds and compares signatures in constant time.
- `ADMIN_API_SECRETS` is a comma-separated list, so a secret can be rotated without downtime: add the new one, switch the admin, remove the old one.
- Each project has its own secret, so a leaked secret exposes one project.
- **Replay within the window.** A replayed save is bound to its version and fails as stale once anything else is saved. A replayed restore records one more identical revision. Both are accepted risks, so there is no nonce store.
- **Alternatives:** a plain bearer token (no body integrity, and replayable forever once logged); Vercel OIDC between projects (ties the contract to Vercel and fits future non-Vercel projects poorly); mTLS (not available on Vercel functions).

### 4. Cache invalidation: `revalidateTag(contentTag(key), { expire: 0 })`

The API handlers call this after a successful save or restore. Because the save happens inside the site, no webhook is needed. Read-your-own-writes holds: the panel reads back from the store, not the cache, and the public site's next request does a blocking refresh. The in-site Server Actions keep `updateTag` until they are removed in step 3 of the migration plan.

### 5. The editing layout becomes manifest data owned by the site

- `fields.ts` moves to `src/content/editor-layout.ts`. Each `empty` factory becomes a plain object, and the manifest builds its JSON per request so the current-year default stays correct.
- The `Field` union becomes the contract's layout type. `upload: "resume" | "photo"` becomes a reference to an upload kind declared in the manifest.
- **Upload rules move into the manifest:** types, accept string, max bytes, path prefix and extension per type, and the wrong-type message. The admin's `UploadButton` checks files and builds the `<prefix>/<uuid>.<ext>` path from them. The site still checks the path against its own pattern.
- **Flags generalize the assumed-facts page.** The manifest lists `{ key: "assumed", title, description }`, and the admin walks loaded sections for `key: true`, as `findAssumed` does today.
- **Alternative: JSON Schema from zod plus generic forms.** Rejected. The editor never used the schema, and the hand-written layout carries labels, hints, summaries and slug sources that a schema doesn't.

### 6. Uploads: the site authorizes, the admin relays, the browser uploads directly

- The browser calls `upload(path, file, { handleUploadUrl: "/p/<project>/upload" })` on the admin.
- That admin route checks the owner session, then forwards the body unchanged to the project's signed `POST /uploads/token`.
- The site runs today's `handleUpload` logic: kind, path pattern, types, size, `addRandomSuffix: false`, `allowOverwrite: false`.
- The browser then uploads straight to the site's Blob store.
- **What this keeps:** files land in the store `next/image` already allows, the 4.5 MB function body limit doesn't apply, and the admin never sees `BLOB_READ_WRITE_TOKEN`.
- **Local mode:** the admin forwards multipart bodies to `POST /uploads`, and the site keeps serving them at `/uploads/*`.
- Verified that `@vercel/blob` 2.8.2 exports `handleUpload` with this reply shape and `generateClientTokenFromReadWriteToken`.
- **Alternative: the admin holds each project's Blob token.** Rejected. That would make the admin a key ring for every project's storage.

### 7. The admin resolves site-relative values against the project origin

Previews use `new URL(value, project.origin)` after the existing `toSafePreviewSrc` checks. "View site" links to `project.origin`. Stored values never change, as the `content-admin` spec requires.

### 8. Project registry: code plus environment secrets, no database

- The admin repo has `projects.ts` with `{ id, name, apiBase, secretEnv }`. Secrets are read from env, for example `PROJECT_SITE_SECRET`.
- Routes are `/` (projects), `/p/[project]`, `/p/[project]/[section]`, `/p/[project]/[section]/revisions` and `/p/[project]/flags/[flag]`.
- Sessions stay JWT (Auth.js, one week), so the admin stays stateless.

### 9. Admin app shape

- **Repo and stack.** A new repo, assumed to be `SherRao/admin` (rename freely). It uses Next 16 with the same tooling as the site: pnpm, oxlint, oxfmt, husky, commitlint, vitest, Playwright, release-please and Dependabot. It's deployed to `admin.sherrao.tech` on Vercel.
- **Auth.** A new GitHub OAuth app with callback `https://admin.sherrao.tech/api/auth/callback/github`, and a new `AUTH_SECRET`. Sessions from `sherrao.tech` are not reused.
- **Headers.** The same set as today's `/admin`: `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `nosniff`, `strict-origin-when-cross-origin`. Plus `noindex` metadata and a `robots.txt` that disallows everything.
- **Environments.** Project secrets exist only in the admin's Production environment, paired with the site's production `ADMIN_API_SECRETS`. Admin previews register no projects. Local development runs the site on :3000 (fixtures, `ADMIN_API_SECRETS=dev-secret`) and the admin on :3001.

### 10. The contract module is copied into both repos for now

- `admin-contract.ts` holds the version, wire types, layout types and the sign/verify helpers. Both repos carry a byte-identical copy with a header naming its source commit.
- Each side's tests pin the wire shapes and check a shared known-answer signature vector, so a drift shows up as a failing test.
- It gets promoted to a published package when a third project joins.
- **Alternatives:** a package now (registry auth in CI, and publishing overhead with only two consumers); a monorepo (restructures this repo and couples release cadences, which the separation is meant to avoid).

### 11. Testing

- **Site.** Unit tests for signature verification (valid, tampered body, wrong path, expired, future, rotated secret) and for each endpoint against the fixtures repository. They assert the status codes and that `revalidateTag` is called with `{ expire: 0 }`. An e2e test signs a save to the public build and checks that the next page load shows it. `content-admin.test.ts` and `editor-fields.test.ts` stay, because the code they test stays.
- **Admin.** These tests move to the admin repo: `editor-errors`, `editor-form-state`, `slug`, `paging`, `owner` and `proxy`, plus the `tests/e2e/admin/*` suite and its session helper. The e2e suite runs against a fixture project server in the admin repo that implements the contract in memory. An optional local smoke test runs against the real site in fixture mode.

## Risks / Trade-offs

- **The admin is compromised, which gives write access to every project.** Each project still validates every write, secrets are per project and rotatable, sessions last one week, and sign-in is restricted to one GitHub id.
- **The contract drifts between repos.** The version number, identical copies with known-answer tests, and "unavailable" handling instead of a broken editor.
- **Clock skew rejects valid requests.** Both run on Vercel with synced clocks, and the window is ±5 minutes.
- **Both panels are live during cutover and edit the same section.** The existing version check refuses the stale save, as it does today across tabs.
- **The admin is cut over before the API reaches `live`.** The cutover task is gated on a signed `GET /manifest` returning 200 from production.
- **Local development needs two servers.** This is documented in both READMEs, and the admin's fixture project lets it run alone.
- **One extra network hop per admin request.** Negligible for a single editor.

## Migration Plan

1. **Site, additive.** Ship the layout move, signing, the content API and upload authorization, each in its own PR. Release to `live`. The old `/admin` keeps working.
2. **Admin app.** Build and deploy it to `admin.sherrao.tech`, and set the production secret on both projects. Verify end to end in production:
    - sign in;
    - change a harmless field and see it on the next load of `sherrao.tech`;
    - restore the previous version;
    - upload a photo, save it, and see it render on the site;
    - upload a resume and check that `/resume` redirects to it.
3. **Remove the in-site admin.** Delete the panel, auth and proxy from the site, release to `live`, then delete the site's `AUTH_*` and `ADMIN_GITHUB_ID` env vars. Revoke the old OAuth app a week later (see Rollback).
4. **Rollback.** Before step 3, stop using the admin app; nothing in the site depends on it. After step 3, revert the removal PR and restore the old `AUTH_*` and `ADMIN_GITHUB_ID` values. GitHub shows an OAuth client secret only once, so keep a copy in a password manager and revoke the old OAuth app only after a quiet week on the new panel. The database and Blob are untouched throughout.

## Open Questions

- The admin repo's name and whether it starts with its own OpenSpec. The assumption is yes, seeded from this change's `content-admin` spec once this change is archived.
- Whether site preview deployments should ever be registered with the admin. The default is no, and nothing in this change depends on it.
