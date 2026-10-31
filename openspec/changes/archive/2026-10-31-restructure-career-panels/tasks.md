# Tasks

## 1. Content

- [x] 1.1 Add `src/content/dates.ts` (month labels, year ranges with "now", short stint labels); verify unit tests cover a single stint, two stints (Shopify), an ongoing stint and a range within one year
- [x] 1.2 Add `Job`, `Stint`, `FounderWork`, `FounderArt`, `AlsoLed`, `Paper` and `Product.tag` to `types.ts`, and a `jobs.ts` module with `shownJobs()`; verify a unit test checks every month's format, end after start and unique ids, and that shown jobs come newest first
- [x] 1.3 Fill content from the resume, LinkedIn and GitHub: jobs (freelance from 2011-08 to Mappedin, with Shopify's two stints, Konfer linking to `#founder`, and the TA job, Brainstorm Academy and Grand Cinnamon hidden), side projects (Tab, Kabo, MuSpace, this website, then nine more with tags), founder works (Konfer, SpurHacks, HawkHacks, stealth), "also led", papers, panel copy i to v, and a "built" count of side projects; verify `pnpm exec tsc --noEmit` and the content unit tests pass

## 2. Page

- [x] 2.1 Build the ledger (`DayJob.tsx`) and add the day job panel first after the cover, plus its nav link; verify Playwright tests that panels come in order, freelancing shows "2011 to 2022", Shopify shows both stints once, hidden jobs are absent, and each row's text is readable with the leader hidden
- [x] 2.2 Rework the engineer panel (featured works by name with art, tagged "also built" links, an "also wrote" row) and the founder panel (works with photo, counter or blank art, stealth, "also led"); verify Playwright tests for the engineer and founder scenarios in the `home-layout` delta
- [x] 2.3 Add the Kabo, MuSpace and site artworks, and remove `BlueDot`, `Dots` and their motion; verify Playwright tests that the new artworks are labelled images and that the counters finish at "96" and "1,400+"

## 3. Integration checks

- [x] 3.1 Verify every panel fits one screen at 1440x900 and 1280x720, and the phone layout (390x844) has no horizontal scroll, with `layout.spec.ts`
- [x] 3.2 Verify `pnpm lint`, `pnpm test`, `pnpm test:e2e` and `pnpm build` pass
    - All pass. The stealth scan skipped itself because `STEALTH_TERMS` isn't set on this machine.

## Workflow follow-up

- Rebase `add-content-admin-panel` (PR #45) onto this. Its schema, fixtures, seed and editors take the new shape, and its `content-admin` delta gains "Career content is editable".
- Archive this change before `add-content-admin-panel`.
