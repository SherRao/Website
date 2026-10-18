# live-data Specification

## Purpose

Defines the live data the site shows: what is playing on Spotify and recently watched films from Letterboxd, served from the site's own endpoints, and how the page behaves when that data is missing.

## Requirements

### Requirement: Now playing endpoint
The site SHALL expose an endpoint that returns the currently playing Spotify track (title, artist, album, album art URL, track URL, and whether it is playing), or null when nothing is playing, credentials are missing, or Spotify fails. Responses SHALL be cached for no more than 30 seconds, and credentials SHALL never reach the browser.

#### Scenario: Something is playing
- **WHEN** the endpoint is called while a track is playing
- **THEN** it returns that track's details with isPlaying true

#### Scenario: Missing credentials
- **WHEN** the Spotify environment variables are not set
- **THEN** the endpoint returns null with a 200 status, without throwing

### Requirement: Recent films endpoint
The site SHALL expose an endpoint that returns recently watched films from the public Letterboxd feed for SherRao, newest first, each with title, year, watched date and rating. If the feed cannot be fetched, it SHALL return an empty list.

#### Scenario: Feed available
- **WHEN** the endpoint is called
- **THEN** it returns films sorted by watched date, newest first

#### Scenario: Feed unavailable
- **WHEN** Letterboxd cannot be reached
- **THEN** the endpoint returns an empty list with a 200 status

### Requirement: Off hours cards show live data with fallbacks
The music card SHALL show the current track when one is playing, and a "not listening right now" state otherwise. The films card SHALL show the four most recent films, and fall back to the films in the content module when live data is empty.

#### Scenario: Nothing playing
- **WHEN** the now playing endpoint returns null
- **THEN** the music card shows "not listening right now" and the page has no errors

#### Scenario: Letterboxd down
- **WHEN** the films endpoint returns an empty list
- **THEN** the films card shows the films stored in the content module
