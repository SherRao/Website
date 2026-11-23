# Tasks

Each numbered group is one PR, using the repo's PR template. Groups 1–5 are additive: the in-site `/admin` keeps working until group 7. Group 6 happens in the new admin repo and is tracked here as a gate for group 7.

## 1. Site: the editing layout becomes data

- [x] 1.1 Move `src/app/admin/_editor/fields.ts` to `src/content/editor-layout.ts`. Replace every `empty: () => ({...})` with a plain object, and make the current-year default a value resolved when the layout is read. Point the in-site editor at the new module. Verify that `pnpm test` (including `editor-fields.test.ts`, moved to the new path) and `pnpm test:e2e` pass unchanged.
- [x] 1.2 Add upload-kind entries to the layout (types, accept, max bytes, path prefix, extension per type, wrong-type message) derived from `UPLOADS` in `src/lib/upload-rules.ts`, so the two can't disagree. Verify with a unit test that the layout's upload rules match `UPLOADS` for both kinds.

## 2. Site: request signing

- [x] 2.1 Add `src/lib/admin-contract.ts`. It holds the contract version (1), the wire and layout types, and `sign` and `verify`: HMAC-SHA256 over method, path and query, timestamp and the body's SHA-256, with a ±300 s window, constant-time comparison, and a list of accepted secrets. Verify with unit tests for valid, tampered body, wrong path, wrong query, expired, future-dated, rotated secret, and a fixed known-answer vector.
- [x] 2.2 Add `ADMIN_API_SECRETS` to `.env.example` and the README's environment table. Verify that `pnpm format:check` passes and that the README describes rotation (add the new secret, switch the admin, remove the old one).

## 3. Site: read endpoints

- [x] 3.1 Add a shared handler wrapper for `src/app/api/admin/v1/**`. It verifies the signature before any other work and answers 401 with no body details. Unknown section keys get 404. Verify with unit tests that every route rejects unsigned and expired requests, and that it never touches the repository when it rejects.
- [x] 3.2 Add `GET /api/admin/v1/manifest`: contract version, project name and origin (`profile.site.url`), sections with layouts, upload kinds, the `assumed` flag, `saving` from `canSaveContent()`/`READ_ONLY_MESSAGE`, and `uploadMode` from `blobUploadsEnabled()`/`localUploadsEnabled()`. Verify with unit tests in fixtures mode and with `VERCEL` set (saving off, with the reason).
- [x] 3.3 Add `GET /api/admin/v1/sections/[key]` returning `loadSectionForEditing`'s data, issues, missing and version. Verify with unit tests for a valid section, a section that fails its schema (issues returned with the raw data), and a missing section.
- [x] 3.4 Add `GET /api/admin/v1/sections/[key]/revisions?limit&offset` returning the current content and one page of revisions (with the `PER_PAGE + 1` lookahead the history page uses). Verify with unit tests for paging and an empty history.

## 4. Site: write endpoints

- [ ] 4.1 Split `saveSectionContent` and `restoreRevisionContent` in `src/lib/content-admin.ts` into authorization-free cores that return results, and invalidation that the caller does. The existing Server Actions keep `requireOwner()` and `updateTag`. Verify that `content-admin.test.ts` and the admin e2e suite still pass.
- [ ] 4.2 Add `PUT /api/admin/v1/sections/[key]` (body `{ data, version }`). It answers 200 with the new version, 409 if stale, 422 with field errors if invalid (including the resume PDF check), and 503 if read-only. After success it calls `revalidateTag(contentTag(key), { expire: 0 })`. Verify with unit tests for each status, plus a mock of `next/cache` asserting the exact `revalidateTag` call.
- [ ] 4.3 Add `POST /api/admin/v1/sections/[key]/revisions/[id]/restore`, with the same statuses and invalidation. A revision from another section, or one that fails the current schema, is refused. Verify with unit tests.
- [ ] 4.4 Add a Playwright test that signs a `PUT` of the profile headline to the production build and checks that the next load of `/` shows it. Verify that `pnpm test:e2e` passes in CI.

## 5. Site: upload authorization, then release

- [ ] 5.1 Add `POST /api/admin/v1/uploads/token`. It takes a forwarded `HandleUploadBody` and runs today's `handleUpload` options (kind, path pattern, types, size, `addRandomSuffix: false`, `allowOverwrite: false`) with the site's `BLOB_READ_WRITE_TOKEN`. It answers 503 when uploads are off. Verify with unit tests (moved from `upload-route.test.ts`) for an allowed photo, a disallowed type, a bad path and read-only.
- [ ] 5.2 Add `POST /api/admin/v1/uploads` for local fixture mode. It takes a multipart file, signed over the raw body, applies the same `uploadProblem` and PDF-magic checks, and answers `{ url: "/uploads/..." }`. Verify with unit tests and by fetching the returned URL from the local server.
- [ ] 5.3 Add `ADMIN_API_SECRETS` to the site's Vercel Production environment, then merge the release PR so groups 1–5 reach `live`. Verify that a signed `GET /api/admin/v1/manifest` against `https://sherrao.tech` returns 200 and an unsigned one returns 401.

## 6. Admin app (new repo `SherRao/admin`, gate for group 7)

- [ ] 6.1 Create the repo with Next 16, pnpm, oxlint, oxfmt, husky, commitlint, vitest, Playwright, release-please, Dependabot and the CI workflow copied from this repo. Verify that CI is green on an empty app.
- [ ] 6.2 Copy `admin-contract.ts` byte-for-byte, with a header naming the site commit, and add the same known-answer signature test. Add `projects.ts` (id, name, apiBase, secretEnv) and a signed contract client. Verify with unit tests against a fixture project server.
- [ ] 6.3 Port Auth.js (GitHub, `ADMIN_GITHUB_ID` only, one-week JWT), `proxy.ts`, `owner`, `require-owner` and the session test helper. Verify that the ported `auth.spec.ts`, `owner.test.ts` and `proxy.test.ts` pass.
- [ ] 6.4 Port the editor (`SectionEditor`, `FieldView`, `inputs`, `lists`, `form-state`, `errors`, `slug`, `unsaved`), the history page and the flags page under `/p/[project]/...`, reading and saving through the contract client. Verify that the ported unit tests and the `editing`, `shell`, `assumed` and `a11y` e2e specs pass against the fixture project server.
- [ ] 6.5 Add the `/p/[project]/upload` relay (owner check, then forward to `uploads/token` or `uploads`) and drive `UploadButton` from the manifest's upload kinds. Verify that the ported `uploads.spec.ts` passes in local mode.
- [ ] 6.6 Resolve previews and "View site" against `project.origin`, keeping the `toSafePreviewSrc` checks. Verify with a unit test (`/events/a.jpg` resolves to the site origin, `//evil` is rejected) and an e2e test that saving keeps the stored path unchanged.
- [ ] 6.7 Show unreachable, unauthorized or unsupported-contract projects as unavailable, with no editor. Verify with e2e tests using a fixture project that is down and one that reports contract 2.
- [ ] 6.8 Add the security headers, `noindex` metadata and a disallow-all `robots.txt`. Verify with an e2e test reading the response headers.
- [ ] 6.9 Create the GitHub OAuth app for `admin.sherrao.tech`, deploy, and set the secrets in Production only. Verify in production:
    - sign in;
    - change a harmless field and see it on the next load of `sherrao.tech`;
    - restore the previous version;
    - upload a photo, save it, and see it render on the site;
    - upload a resume and check that `/resume` redirects to it.

## 7. Site: remove the in-site admin (only after 6.9)

- [ ] 7.1 Delete `src/app/admin/**`, `src/auth.ts`, `src/app/api/auth/**`, `src/proxy.ts`, `src/lib/owner.ts`, `src/lib/require-owner.ts`, the Server Actions and the tests ported in group 6, and remove `next-auth`. Verify that `pnpm build` and `pnpm test` pass, and that a new e2e test sees `/admin` answer 404.
- [ ] 7.2 In `next.config.ts`, apply the site CSP to every route (drop the `admin|api/auth` exclusion and the `/admin` header block) and remove `NEXT_DIST_DIR`. In `playwright.config.ts`, drop the 3210 server and the `admin` project. Remove `.next-admin/` from `.gitignore` and `.oxfmtrc.json`. Verify that `pnpm test:e2e` passes and that the CSP header is present on `/resume` and `/api/admin/v1/manifest`.
- [ ] 7.3 Drop `/admin` from `robots.ts`, keeping `/api/`. Verify with the metadata e2e test.
- [ ] 7.4 Update the README (admin section, environment table, local development with the admin on :3001) and `.env.example` (remove `AUTH_*` and `ADMIN_GITHUB_ID`). Verify that `pnpm format:check` passes and that the README no longer mentions `/admin` as a route.
- [ ] 7.5 Release to `live`, then delete the site's `AUTH_*` and `ADMIN_GITHUB_ID` env vars in Vercel. Verify that `https://sherrao.tech/admin` is 404 and that an edit from `admin.sherrao.tech` still shows on the next page load.

## Workflow follow-up

- Revoke the old GitHub OAuth app a week after 7.5 if no rollback was needed (see design.md, Migration Plan).
- Archive this change, then seed the admin repo's OpenSpec with the archived `content-admin` spec.
- Write the recipe app's change in its own repo against contract v1.
