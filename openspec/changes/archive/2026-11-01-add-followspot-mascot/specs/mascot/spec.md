## ADDED Requirements

### Requirement: The followspot mascot

The site SHALL have one mascot, a followspot: a stage light on a stand with a face, drawn with a single stroke weight and round caps in the ink colour, with a gel-coloured beam as its only fill. It SHALL have five moods: on cue (eyes open, beam on), on headphones (happy eyes, a softer beam), asleep (eyes closed, no beam), hi (happy eyes, on the say hi panel) and out (crossed eyes, no beam, a wisp of smoke, on the 404). It SHALL be decorative: hidden from assistive technology, and never focusable.

#### Scenario: Hidden from assistive technology

- **WHEN** a screen reader reads the page
- **THEN** no followspot is announced, and keyboard focus never lands on one

#### Scenario: Page stays accessible

- **WHEN** the home page is checked with axe
- **THEN** the followspots add no violations

### Requirement: The followspot on the cover aims at the spotlight

The cover SHALL show the followspot on cue beside the name, in the notch the name's lines leave, without covering the headline, the intro or the glance. It SHALL be part of the name's `<h1>` without changing its accessible name. Its beam SHALL point at the centre of the cursor spotlight, turning no more than 45 degrees either way, and stretch to reach it.

#### Scenario: Pointer moves over the cover

- **WHEN** a visitor moves the pointer across the name
- **THEN** the followspot turns so its beam points at the light, and the beam's end stays on the light as it moves

#### Scenario: Pointer leaves the cover

- **WHEN** the pointer leaves the cover
- **THEN** the light returns to the name and the followspot turns with it

#### Scenario: Pointer behind the followspot

- **WHEN** the pointer moves more than a small distance behind the followspot's stand
- **THEN** the lamp swings around on its stand to face it, and swings back the same way

#### Scenario: Touch cue

- **WHEN** the touch cue moves the light
- **THEN** the followspot follows it without swinging around

#### Scenario: Cover layout unchanged

- **WHEN** the cover loads at any supported screen size
- **THEN** the name, headline, intro and all five glance items are still fully visible and not overlapped by the followspot

### Requirement: The followspot in the music card follows Spotify

The music card SHALL show a small followspot. It SHALL wear headphones while a track is playing, and be asleep when nothing is playing or the now playing endpoint fails. Its mood SHALL change whenever the card's state changes.

#### Scenario: A track is playing

- **WHEN** the now playing endpoint returns a playing track
- **THEN** the music card's followspot wears headphones

#### Scenario: Nothing playing

- **WHEN** the now playing endpoint returns null or fails
- **THEN** the music card's followspot is asleep, and the card still shows "not listening right now"

### Requirement: The followspot lights the say hi panel

The say hi panel SHALL show a large followspot rising from below the screen's bottom edge, with its beam lighting the email at rest and without hiding the email, the links or the closing line. It SHALL swing to light whichever of the panel's links is hovered or focused, return to the email once none is, and lean a few degrees toward the mouse while it rests.

#### Scenario: Hovering a link

- **WHEN** a visitor hovers or focuses one of the say hi panel's links
- **THEN** the followspot's beam swings to light that link, and returns to the email afterwards

### Requirement: The followspot marks the 404

The 404 page SHALL show the followspot with its lamp blown: no beam, drawn dim, with a wisp of smoke.

#### Scenario: A page that doesn't exist

- **WHEN** a visitor opens a page that doesn't exist
- **THEN** the followspot is shown with its lamp out

### Requirement: The followspot respects reduced motion

When the visitor prefers reduced motion, every followspot SHALL hold still: the cover's followspot rests facing the name with no tracking, the say hi followspot rests lighting the email, the eyes don't blink, and nothing turns, flickers or drifts. Moods SHALL still change. Turning reduced motion on or off mid-visit SHALL switch between the two.

#### Scenario: Reduced motion on the cover

- **WHEN** the page loads with prefers-reduced-motion set to reduce and the pointer moves over the cover
- **THEN** the cover's followspot stays facing the name and none of the followspots animate

#### Scenario: Reduced motion in the music card

- **WHEN** reduced motion is on and a track starts playing
- **THEN** the music card's followspot switches to headphones with no animation
