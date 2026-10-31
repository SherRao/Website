# Spec Delta

## MODIFIED Requirements

### Requirement: Off hours cards show live data with fallbacks
The music card SHALL show the current track when one is playing, and a "not listening right now" state otherwise. The films card SHALL show the four most recent films, and fall back to the fallback films in the content store when live data is empty.

#### Scenario: Nothing playing
- **WHEN** the now playing endpoint returns null
- **THEN** the music card shows "not listening right now" and the page has no errors

#### Scenario: Letterboxd down
- **WHEN** the films endpoint returns an empty list
- **THEN** the films card shows the fallback films stored in the content store
