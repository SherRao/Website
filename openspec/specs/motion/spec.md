# motion Specification

## Purpose

Defines the page's motion: the cursor spotlight, how works and photos reveal, cue-lit titles, animated artworks and count-ups, and what happens when a visitor prefers reduced motion.

## Requirements

### Requirement: Cursor spotlight on the name

On the cover, a soft circular light SHALL follow the pointer with a slight lag and reveal the name in a warm colour inside the light. The lit name SHALL line up exactly with the dim name at all times, including after web fonts load and on resize. When the pointer leaves, the light SHALL return to the centre of the name.

#### Scenario: Pointer moves over the cover

- **WHEN** a visitor moves the pointer across the cover
- **THEN** the light follows it and the letters inside the light are lit, with no offset between lit and dim letters

#### Scenario: Fonts load late

- **WHEN** a web font finishes loading after the page first renders
- **THEN** the lit name realigns with the dim name

### Requirement: Works and photos reveal on arrival

Each work and photo SHALL start dim and closed, then light up and open through a widening circle the first time it comes into view, in a short stagger. The reveal SHALL play once and leave the item fully visible.

#### Scenario: Scrolling into a panel

- **WHEN** a panel slides into view
- **THEN** its works or photos light up and open in sequence, and stay visible afterwards

#### Scenario: Nothing stays hidden

- **WHEN** a visitor has scrolled the whole page
- **THEN** every work and photo is fully visible

### Requirement: Chapter titles light up when their panel lands

Each chapter title SHALL change from unlit to lit when its panel is mostly in view, and return to unlit when it is not. On small screens, where panels don't pin, a title SHALL be lit while its heading is in view. With reduced motion, every title SHALL be lit.

#### Scenario: Panel arrives

- **WHEN** a chapter panel is more than 60% in view
- **THEN** its title and number are shown in the lit colour

#### Scenario: Small screen

- **WHEN** a chapter heading scrolls into view on a phone
- **THEN** its title is lit, and it goes unlit again once the heading leaves the screen

### Requirement: Animated artworks

The Tab artwork SHALL alternate between six and two payments with captions that never overlap. The Kabo score and the SpurHacks figure SHALL count up from zero when revealed. The Kabo artwork's level meter SHALL move while motion is allowed. The stealth artwork SHALL show a slow scan line.

#### Scenario: Count-up

- **WHEN** the SpurHacks work in the founder panel is revealed
- **THEN** its figure counts up to 1,400+ and stops there

### Requirement: Reduced motion

When the visitor prefers reduced motion, the site SHALL not animate: the name and chapter titles are fully lit with no spotlight, works and photos are visible immediately, counters show their final values, and artworks show their end state. Page scrolling SHALL follow the input directly with no smoothing, and snapping to a panel or following an in-page link SHALL jump straight there.

#### Scenario: Reduced motion preference

- **WHEN** the page loads with prefers-reduced-motion set to reduce
- **THEN** no element animates, and all content and final values are visible

#### Scenario: Snapping with reduced motion

- **WHEN** a visitor who prefers reduced motion scrolls one wheel notch on the large layout
- **THEN** the page lands on the next panel straight away, with no glide

### Requirement: Motion stays smooth

Continuous motion SHALL animate only transform, opacity, filter, clip-path or SVG properties, and SHALL not cause layout shifts.

#### Scenario: Layout stability

- **WHEN** the page loads and reveals play
- **THEN** cumulative layout shift stays below 0.1

### Requirement: Smooth page scrolling

Page scrolling from a mouse wheel or trackpad SHALL be smoothed with Lenis using a heavy, cinematic glide, so it feels the same on every operating system and device. Touch scrolling SHALL stay native. The sideways work and photo strips on small screens SHALL keep scrolling sideways with a wheel, a trackpad or touch.

#### Scenario: Wheel on a PC

- **WHEN** a visitor turns a mouse wheel on the stacked small layout
- **THEN** the page glides to its new position instead of jumping one notch at a time

#### Scenario: Touch

- **WHEN** a visitor scrolls the page on a phone
- **THEN** scrolling is the device's native scrolling

#### Scenario: Sideways strip

- **WHEN** a visitor swipes sideways with a trackpad over a work or photo strip on the small layout
- **THEN** the strip scrolls sideways and the page does not scroll
