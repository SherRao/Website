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
The blue dot artwork SHALL draw its route and move the dot along it. The Tab artwork SHALL alternate between six and two payments with captions that never overlap. The Shopify and Seahorse figures SHALL count up from zero when revealed. The SPUR artwork SHALL fill 12 of 15 dots in sequence. The stealth artwork SHALL show a slow scan line.

#### Scenario: Count-up
- **WHEN** the Shopify work is revealed
- **THEN** its figure counts up to 1,100,000+ and stops there

### Requirement: Reduced motion
When the visitor prefers reduced motion, the site SHALL not animate: the name and chapter titles are fully lit with no spotlight, works and photos are visible immediately, counters show their final values, and artworks show their end state. Smooth scrolling SHALL be off.

#### Scenario: Reduced motion preference
- **WHEN** the page loads with prefers-reduced-motion set to reduce
- **THEN** no element animates, and all content and final values are visible

### Requirement: Motion stays smooth
Continuous motion SHALL animate only transform, opacity, filter, clip-path or SVG properties, and SHALL not cause layout shifts.

#### Scenario: Layout stability
- **WHEN** the page loads and reveals play
- **THEN** cumulative layout shift stays below 0.1
