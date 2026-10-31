## MODIFIED Requirements

### Requirement: Scrolling snaps to panels

On the large-screen layout, scrolling SHALL come to rest with exactly one panel fully in place, never halfway between two panels. One wheel spin, trackpad fling or scrolling key press (arrows, Page Up/Down, Space) SHALL move the page at most one panel. A deliberate gesture SHALL move to the next or previous panel in its direction; a tiny accidental movement SHALL settle back on the current panel. Jumps the visitor aims directly (dragging the scrollbar, Home, End, navigation links) SHALL settle on the panel nearest to where they land.

#### Scenario: Stopping between panels

- **WHEN** a visitor stops scrolling partway through a panel transition
- **THEN** the page settles on the nearest panel in the direction of the gesture, fully in place

#### Scenario: Hard spin or fling

- **WHEN** a visitor spins the wheel hard or flings the trackpad from a panel
- **THEN** the page moves to the next panel only, and stops there fully in place

#### Scenario: One wheel notch

- **WHEN** a visitor turns the wheel by one notch while a panel is in place
- **THEN** the page moves to the next panel in that direction and settles fully in place

#### Scenario: Keyboard scrolling

- **WHEN** a visitor presses Page Down, Space or the down arrow while a panel is in place
- **THEN** the page moves to the next panel and settles fully in place

#### Scenario: Dragging the scrollbar

- **WHEN** a visitor drags the scrollbar across several panels and lets go partway through a transition
- **THEN** the page settles on the panel nearest to where it was released, fully in place

#### Scenario: In-page links land on a panel

- **WHEN** a visitor clicks a section link in the navigation
- **THEN** the page glides to that panel and it is fully in place

### Requirement: Small screens scroll normally

Below 961px wide or 641px tall, panels SHALL be laid out one after another with no pinning and no snapping, and all panel content SHALL remain reachable. Mouse and trackpad scrolling SHALL be smoothed as on the large layout; touch scrolling SHALL stay native.

#### Scenario: Phone layout

- **WHEN** the page is viewed at 390x844
- **THEN** every panel's content is visible by scrolling, nothing pins or snaps, and the page has no horizontal scroll

#### Scenario: Short desktop window

- **WHEN** the page is viewed at 1440x600 and scrolled with the wheel
- **THEN** scrolling is smoothed, and it can come to rest anywhere, including partway through a panel

#### Scenario: Resizing across the breakpoint

- **WHEN** a desktop window is resized from 1440x600 to 1440x900
- **THEN** scrolling snaps to panels without a reload
