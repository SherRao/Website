## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Reduced motion

When the visitor prefers reduced motion, the site SHALL not animate: the name and chapter titles are fully lit with no spotlight, works and photos are visible immediately, counters show their final values, and artworks show their end state. Page scrolling SHALL follow the input directly with no smoothing, and snapping to a panel or following an in-page link SHALL jump straight there.

#### Scenario: Reduced motion preference

- **WHEN** the page loads with prefers-reduced-motion set to reduce
- **THEN** no element animates, and all content and final values are visible

#### Scenario: Snapping with reduced motion

- **WHEN** a visitor who prefers reduced motion scrolls one wheel notch on the large layout
- **THEN** the page lands on the next panel straight away, with no glide
