## ADDED Requirements

### Requirement: The followspot mascot
The site SHALL have one mascot, a followspot: a stage light on a stand with a face, drawn with a single stroke weight and round caps in the ink colour, with a gel-coloured beam as its only fill. It SHALL have four moods: on cue (eyes open, beam on), on headphones (headphones on, happy eyes, beam on), asleep (eyes closed, tilted down, beam off, "z"s), and taking a bow (happy eyes, tilted far down, beam dimmed). The mascot SHALL be decorative: hidden from assistive technology, never focusable, and never the only place information is shown.

#### Scenario: Hidden from assistive technology
- **WHEN** a screen reader reads the page
- **THEN** no followspot is announced, and keyboard focus never lands on one

#### Scenario: Page stays accessible
- **WHEN** the home page is checked with axe
- **THEN** the followspots add no violations

### Requirement: The followspot on the cover aims at the spotlight
On large screens, the cover SHALL show the followspot on cue to the right of the name, facing it, without covering any letter of the name, the headline, the intro or the glance. Its beam SHALL point at the centre of the cursor spotlight and stretch to reach it, every frame, so it follows the pointer, the touch cue and the light's return to the name exactly as the light does. The aim SHALL turn no more than 45 degrees either way from facing the name. On small screens, the followspot SHALL stand in the space to the left of "rao", facing right, and aim the same way.

#### Scenario: Pointer moves over the cover
- **WHEN** a visitor moves the pointer across the name
- **THEN** the followspot turns so its beam points at the light, and the beam's end stays on the light as it moves

#### Scenario: Pointer leaves the cover
- **WHEN** the pointer leaves the cover
- **THEN** the light returns to the name and the followspot turns with it

#### Scenario: Light behind the followspot
- **WHEN** the light is further than 45 degrees from where the followspot faces
- **THEN** the followspot stops turning at 45 degrees and does not flip around

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

### Requirement: The followspot takes a bow on the say hi panel
The say hi panel SHALL show the followspot taking a bow above its "say hi, and the house lights come up" line, without moving the email link, the links or the closing line out of view.

#### Scenario: Reaching the end of the page
- **WHEN** a visitor scrolls to the say hi panel
- **THEN** the followspot is shown taking a bow above the panel's heading

### Requirement: The followspot respects reduced motion
When the visitor prefers reduced motion, every followspot SHALL hold still: the cover's followspot rests facing the name with no tracking, the eyes don't blink, and nothing turns, flickers or drifts. Moods SHALL still change.

#### Scenario: Reduced motion on the cover
- **WHEN** the page loads with prefers-reduced-motion set to reduce and the pointer moves over the cover
- **THEN** the cover's followspot stays facing the name and none of the followspots animate

#### Scenario: Reduced motion in the music card
- **WHEN** reduced motion is on and a track starts playing
- **THEN** the music card's followspot switches to headphones with no animation
