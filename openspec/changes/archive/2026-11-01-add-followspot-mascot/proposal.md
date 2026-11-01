# Proposal

## Why

The site is built like a theatre (a cursor spotlight on the name, unlit and lit titles, museum labels, "the house lights come up"), but nobody is running the lights. A small mascot gives it a character the way Jacqueline Truong's line-drawn cat does for her site. Four concepts were prototyped side by side in `prototypes/mascot/` (a ghost light, a followspot, a moth and a bean in four hats), and the followspot was chosen: its beam can be the spotlight that already chases the cursor over the name, and Nausher is the person who runs the cues.

## What Changes

- **A new followspot mascot**: a stage light on a stand with a face, drawn in the same style as the prototype. It uses one stroke weight with round caps in `--ink`, and a `--gel` beam as its only fill. It has a fixed set of moods: on cue, on headphones, asleep and taking a bow.
- **The cover**: the followspot stands to the right of the name, facing it, and aims its beam at the existing spotlight. Because it follows the spotlight's own position, it follows the pointer and the touch cue, and returns to the name when the pointer leaves, all in step with the light. The beam stretches to reach the light.
- **The music card in off hours**: a small followspot sits in the card's corner. It wears headphones while something is playing on Spotify and falls asleep when nothing is.
- **The say hi panel**: above "say hi, and the house lights come up", the followspot takes a bow with its beam lowered, because the show is over.
- The mascot is decorative: it's hidden from assistive technology and takes no focus. With reduced motion it holds still in its resting pose.

Out of scope: the nav, the loader, and a 404 page (the prototype's "standby" and "blown lamp" moods), a favicon, and any other mascot concept. The mascot doesn't replace or restyle the existing spotlight on the name.

## Capabilities

### New Capabilities

- `mascot`: the followspot, its moods, and where it appears: the cover (aiming at the spotlight), the music card (headphones or asleep) and the say hi panel (a bow). Also covers how it behaves with reduced motion and for assistive technology.

### Modified Capabilities

None. The cursor spotlight, the music card's states and the reduced motion rules keep their current requirements; the mascot follows them.

## Impact

- New component: `src/components/Followspot.tsx` (the SVG and its moods).
- `src/components/Spotlight.tsx`: renders the cover's followspot and aims it from the light's position on every frame.
- `src/components/ListeningCard.tsx`: shows the followspot in the right mood.
- `src/app/page.tsx`: the say hi panel shows the bowing followspot.
- Styles: a new `src/styles/mascot.css`, imported from `globals.css`, holds the drawing, its moods and the three placements. `layout.css` gives the cover's name box a fitted width on large screens too, so the followspot can stand beside it.
- Tests: the layout, motion, live-data and quality Playwright specs.
- No new dependencies. The Lenis change (#54) is already merged and left `Spotlight.tsx` and the cover alone.
- `prototypes/mascot/` stays as the reference until this change is built, then it's removed, as earlier prototypes were.
