# Proposal

## Why

The engineer and founder panels mix two different questions: "was I paid for it or did I build it for myself?" and "did I work there or did I start it?". Jobs are spread across both panels (Shopify and Mappedin under the engineer, SPUR and NEAR's Seahorse under the founder), Tab is the only real side project, and organizations Nausher actually founded (SpurHacks, HawkHacks) aren't shown as founded at all. LinkedIn also turned up content the site doesn't use yet: eleven years of freelancing from age ten, HawkHacks founder & president, Laurier Computing Society president, and two papers.

This lands before `add-content-admin-panel`, which moves the content into a database. Reshaping the content now only means editing the TypeScript content modules. That change then carries the new shape into its schema, fixtures and editors.

## What Changes

- **New panel, "the day job"** (first after the cover): every job from freelancing (2011) to Mappedin, with structured dates, multiple stints per job (Shopify), and a per-job show/hide flag. It's laid out as a **ledger**: one row per job, read like a playbill's credits. Two layouts with bars drawn to scale (a swimlane, and a ledger with time tracks) were prototyped against it, and the ledger was kept (design.md, Decision 5).
- **The engineer becomes side projects only.** Featured works: Tab, Kabo, MuSpace and this website. "Also built" chips: SherBot, HomeStock (tagged "winner, openhacks 2020"), Chaterest, Spacestagram, Localify, Maerienette, Julia, BuddyBot, FreeGameNotifier. A new "also wrote" row lists the two papers. Products from jobs (blue dot, Shopify CLI, RFQ dashboard, Seahorse, SPUR investor platform, SpurHacks platform) move out of the products list.
- **The founder becomes organizations Nausher started.** Works: Konfer, SpurHacks, HawkHacks, and the untitled stealth company. "Also led" chips: Laurier Computing Society, Brainstorm Academy. SPUR and Seahorse move to the day job.
- Panel copy for the day job, engineer and founder panels is rewritten to match. Panels are renumbered i to v. The navigation gains "the day job".
- HawkHacks' organizer role is confirmed (president & founder), so it is no longer an unconfirmed fact.
- The cover's "built" count now counts side projects only.

Out of scope: reconciling where the resume and LinkedIn disagree (Mappedin end date, NEAR metrics, Shopify team name, HawkHacks title wording), what replaces "now: mappedin" on the cover when that job ends, and editing any of this in an admin panel (that comes with `add-content-admin-panel`).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `home-layout`: seven panels instead of six; a new day job panel; new contents for the engineer and founder panels; the cover's count changes to side projects.
- `motion`: the animated artworks change with the works. The blue dot, Shopify, Seahorse and SPUR pieces leave the page; the Kabo score and the SpurHacks figure count up instead.
- `site-content`: jobs are stored with structured dates and a visibility flag, display dates are generated from them, and HawkHacks' role is no longer unconfirmed.

## Impact

- Content: `src/content/types.ts`, `products.ts`, `panels.ts` (`founder` and `writing` replace `founderWorks`), `profile.ts`, a new `jobs.ts`, and `dates.ts` for date text.
- Page and components: `src/app/page.tsx`, a new `DayJob.tsx` (the ledger), `artworks.tsx` (art for the new featured works), `PageMotion.tsx`, `Nav.tsx`, `works.css` and `motion.css`.
- Tests: content and date unit tests; the layout, motion and quality Playwright specs.
- `add-content-admin-panel` must rebase onto this: its schema, fixtures, seed and editors take the new shape, and it gains the requirement that jobs, founder works, "also led" items and papers are editable.
