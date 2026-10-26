# Design

## Context

- Content lives in typed TypeScript modules under `src/content/` (`profile.ts`, `products.ts`, `events.ts`, `panels.ts`) with hand-written types in `types.ts`. `page.tsx` picks featured products by name with `findProduct()`. `panels.ts` built the Seahorse founder work from the product list.
- `page.tsx` hard-codes the founder row (Konfer photo, SPUR dots, Seahorse counter, stealth blank) and the engineer row (blue dot, Tab, Shopify counter). `artworks.tsx` has `BlueDot`, `TabSplit`, `Counter`, `Dots`, `Blank` and `Wave`.
- `add-content-admin-panel` (PR #45) is still open. It moves this content into a database behind a zod schema. This change lands first, in the current module structure.
- Source material: the resume (`public/Resume - Nausher Rao.pdf`), the LinkedIn export, and the GitHub repos. Where they disagree, the current values stay (proposal, Out of scope).

## Goals / Non-Goals

**Goals:**

- Each item lives in exactly one list (jobs, side projects, founded organizations), and each list drives exactly one panel.
- Job dates are stored once, as months, so the shape carries straight into the admin change's schema.
- The new and changed panels still fit one screen at 1280x720 (`home-layout`, "Every panel fits one screen").

**Non-Goals:**

- Editing any of this in an admin panel. That arrives with `add-content-admin-panel`.
- A time-to-scale layout. One was prototyped and rejected (Decision 5).
- New artwork beyond what the three new featured works need.

## Decisions

### 1. Jobs are a new content module, `jobs.ts`

Each job is `{ id, org, url?, place?, line, shipped?, link?, show, stints: [{ role, start: "YYYY-MM", end? }] }`.

- `shipped` is free text ("blue dot"). The job products leave the products list, so there's nothing to reference.
- `link` is an in-page anchor. Konfer's row uses it to point at `#founder` instead of repeating its story.
- A missing `end` means "now". With no schema on save yet, a unit test checks every month's format, that each stint ends after it starts, and that ids are unique. The admin change turns these into schema rules.
- `shownJobs()` filters to shown jobs and sorts them newest first, by when their latest stint started.
- **Alternative:** keep job work in `products` with a `kind` field. Rejected, because jobs need stints and dates that products don't have, and one list would still feed two panels.

### 2. Products become side projects, with an optional tag

`Product` gains `tag?: string` ("winner, openhacks 2020") and the list loses the six job items. `page.tsx` keeps choosing featured works by name: Tab, Kabo, MuSpace and this website, each with its artwork.

### 3. `panels.ts`: `founder` and `writing`

- `founderWorks` is replaced by `founder: { works: FounderWork[]; stealth: WorkLabel; alsoLed: AlsoLed[] }`. A work's `art` is an optional photo or counter. A work without art gets a `Blank` frame. The content uses Konfer's existing photo, a counter for SpurHacks (1,400+) and a HawkHacks photo from `public/events/hawkhacks/`.
- **Stealth stays its own field, not a list item.** Its render ("not yet on view", never a link) and the never-named rule are clearer when it can't be given a URL or image by mistake.
- `writing: Paper[]` holds the papers. `short` is the chip text, and the full `title` is the hover text and follows the short title in the accessible name (WCAG 2.5.3, label in name).
- `panels` gains `dayjob` copy, and the numerals move to i to v.

### 4. Date text is computed

`src/content/dates.ts` formats stints: a month label ("may 2022"), a year range ("2022 to 2023", "2011 to 2022", "2024 to now") and a short stint label ("may to aug 2022"). It's unit-tested, and the "Correcting a date" scenario depends on it.

### 5. Timeline layouts were prototyped and rejected

A `/prototype` run compared the ledger with two time-to-scale layouts, built from the same data on a piecewise axis (years before the second-earliest job compressed into ~12% of the width, behind a `//` seam):

- **Swimlane:** one lane per job with stints as bars, and each job's line in a caption for the lane under the pointer or focus.
- **Tracks:** the ledger with its dotted leader turned into a thin time bar.

The owner picked the ledger. The swimlane hid most of the text behind hover and was the busiest of the three. Tracks' bars were too small to carry the overlap, and its lines were cut short at 1280 wide. Both were deleted with the prototype, so the day job panel has no time axis.

### 6. Ledger

One row per job: dates, org, a dotted leader, the latest role with what it shipped, and the line. The rows share columns through a subgrid, reuse the label typography from `works.css`, and borrow the leader pattern from the cover's glance row, so the panel reads as part of the same museum. A job with two stints lists both ("may to aug 2022", "jan to apr 2023"). Below 961px each job stacks: dates, then name and role, then the line.

### 7. Engineer art for the new featured works

- Kabo: a karaoke score ("96", counting up when revealed) over the existing `Wave` level meter.
- MuSpace: two listeners joined by the albums they share, as a static SVG.
- This website: a miniature of the page itself, five stacked panels with the engineer panel lit ("you are here").
- `BlueDot` and `Dots` are deleted, and so is `PageMotion`'s dot-filling.

## Risks / Trade-offs

- [Seven panels at about one screen each make the page longer] → Each panel still fits one screen. The day job is the densest panel, so the TA job, Brainstorm Academy and Grand Cinnamon are hidden by default, and Playwright checks fit at 1280x720.
- [The admin change has to absorb a reshaped content model] → The shapes here are the ones its schema will use, so it's a translation: the modules become fixtures, these types become zod schemas, and the date checks become schema rules.
- [Konfer appears in both the day job and the founder panel] → The job row is one line linking to `#founder`, and the founder panel holds the full story.

## Migration Plan

No data to migrate: content ships with the code. Rollback is reverting the commit.
