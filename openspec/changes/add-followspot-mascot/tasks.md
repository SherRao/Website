# Tasks

## 1. The followspot

- [ ] 1.1 Add `src/components/Followspot.tsx`, porting the prototype's followspot (body, beam, stand, face, headphones, "z"s) to JSX for the moods `cue`, `listening`, `sleep` and `bow`, with `aria-hidden`, `focusable="false"`, `data-mood` and a `useId()` gradient id; verify `pnpm exec tsc --noEmit` and `pnpm lint` pass
- [ ] 1.2 Add `src/styles/mascot.css` (imported in `globals.css`): stroke defaults, per-mood rest angles and beam strength, and blinking, "z" drift and mood transitions under `.motion` only; verify with a screenshot of all four moods next to the prototype's

## 2. Placements

- [ ] 2.1 Render the cover's followspot inside the name's `<h1>` from `Spotlight.tsx`, placed in `em` beside the name: to the right facing left on large screens, left of "rao" facing right on small screens, with `--facing` set in CSS and `.name--base` given `width: max-content` on large screens; verify the existing "lit and dim names line up" and "fits one screen" tests still pass
- [ ] 2.2 In Spotlight's `layout()`, measure the pivot, lens and beam length and read `--facing`; in `apply()`, set `--aim` (clamped to ±45°) and `--reach` from `pos`; verify by hand that it tracks the pointer, the touch cue (phone emulation) and the return to the name
- [ ] 2.3 Show the followspot in `ListeningCard.tsx`, in `listening` mood while playing and `sleep` otherwise, in the card's top-right corner
- [ ] 2.4 Show the bowing followspot above the say hi heading in `page.tsx`

## 3. Tests

- [ ] 3.1 `layout.spec.ts`: the cover's followspot doesn't intersect the name's letters, headline, intro or glance at every tested large size and at 390x844, and the say hi followspot leaves the email, links and closing line on screen
- [ ] 3.2 `motion.spec.ts`: moving the pointer above, then below, the followspot changes the sign of its `--aim`, never past ±45°; with reduced motion, `--aim` is never set and no followspot has running animations
- [ ] 3.3 `live-data.spec.ts`: the music card's followspot is `listening` when a track is playing, and `sleep` when nothing is playing and when the endpoint fails
- [ ] 3.4 `quality.spec.ts`: axe still passes, the h1's accessible name is unchanged, and keyboard focus never lands on a followspot

## 4. Finish

- [ ] 4.1 Verify `pnpm lint`, `pnpm test`, `pnpm test:e2e` and `pnpm build` pass, and check screenshots of the cover (1440x900, 1280x720, 390x844), the music card in both states, and the say hi panel
- [ ] 4.2 Ask Nausher before deleting `prototypes/mascot/` (it's untracked)
