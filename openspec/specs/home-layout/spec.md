# home-layout Specification

## Purpose

Defines the structure of the home page: a stack of full-screen panels that pin and slide over each other, what each panel contains, and how the page behaves on small screens.

## Requirements

### Requirement: Home page is a stack of full-screen panels

The home page SHALL show seven panels in this order: cover, the day job, the engineer, the stage, the founder, off hours, say hi. On screens at least 961px wide and 641px tall, each panel SHALL fill the viewport, pin to the top while the next panel slides up over it, and show a dark background with a faint 6-column grid.

#### Scenario: Next panel covers the current one

- **WHEN** a visitor on a 1440x900 screen scrolls down from a pinned panel
- **THEN** the current panel stays fixed in place and the next panel slides up over it until it fills the screen

#### Scenario: Every panel fits one screen

- **WHEN** the page is viewed at 1440x900 or 1280x720
- **THEN** no panel's content is cut off or needs scrolling inside the panel

#### Scenario: Panel order

- **WHEN** a visitor reads the navigation or scrolls the page from the top
- **THEN** the panels appear as the day job (i), the engineer (ii), the stage (iii), the founder (iv) and off hours (v), between the cover and say hi

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

### Requirement: Cover panel gives the essentials at a glance

The cover SHALL show the visitor's first view of: the name, the headline, a short intro, and an "at a glance" row with the current role (Mappedin), the company (Konfer), a new company in stealth, the largest event (1,400+ people at SpurHacks 2025), and the number of side projects built. Each linkable item SHALL link to its destination.

#### Scenario: First screen

- **WHEN** the page loads at 1440x900
- **THEN** the name, headline, intro and all five "at a glance" items are visible without scrolling

#### Scenario: Side project count follows the list

- **WHEN** a side project is added to or removed from the content
- **THEN** the "built" item's number changes to match, and it links to the engineer panel

### Requirement: The engineer panel shows works with museum labels

The engineer panel SHALL show side projects only. Four featured works (Tab, Kabo, MuSpace and this website) SHALL appear as artworks in a row, each with a label giving title, years, role, a one- or two-line note, and a link where one exists. The other side projects SHALL appear as compact "also built" links, with a short tag where one is set. An "also wrote" row SHALL list the papers.

#### Scenario: Tab is reachable

- **WHEN** a visitor views the engineer panel
- **THEN** Tab appears as a work labelled "side project, 2026" with a link to its source repository

#### Scenario: No job work in the engineer panel

- **WHEN** a visitor views the engineer panel
- **THEN** blue dot, the Shopify CLI and Partner Dashboard, the RFQ dashboard, Seahorse, the SPUR investor platform and the SpurHacks platform do not appear in it

#### Scenario: Hackathon win is tagged

- **WHEN** a visitor views the "also built" links
- **THEN** HomeStock shows the tag "winner, openhacks 2020"

#### Scenario: Papers are listed

- **WHEN** a visitor views the "also wrote" row
- **THEN** both papers appear by title, and a paper with a link opens it

### Requirement: The stage panel shows a dense photo mosaic

The stage panel SHALL show at least eight event photos close together in one mosaic, with the largest tile for SpurHacks 2025, plus a line listing each event with its headline number. Each photo SHALL have a caption visible on hover or focus (always visible on small screens).

#### Scenario: Photo captions

- **WHEN** a visitor hovers or keyboard-focuses a photo tile
- **THEN** its caption appears

### Requirement: The founder panel shows companies, including the stealth company

The founder panel SHALL show only organizations Nausher started: Konfer, SpurHacks, HawkHacks and an "untitled" work for the stealth company, each with a label. Organizations Nausher led but didn't found (Laurier Computing Society, Brainstorm Academy) SHALL appear as compact "also led" items.

#### Scenario: Stealth company shown without details

- **WHEN** a visitor views the founder panel
- **THEN** the stealth company appears only as "untitled", "a new company, in stealth", with no name, industry, location or link

#### Scenario: Jobs are not in the founder panel

- **WHEN** a visitor views the founder panel
- **THEN** SPUR Innovation Center and Seahorse do not appear in it

#### Scenario: HawkHacks is shown as founded

- **WHEN** a visitor views the founder panel
- **THEN** HawkHacks appears with the role "founder & president" and the years 2021 to 2025

### Requirement: Off hours panel shows personal interests

The off hours panel SHALL show cards for music I listen to, music I make, films, photography and cooking.

#### Scenario: Films card

- **WHEN** a visitor views off hours
- **THEN** the films card lists recent films with ratings and links to the Letterboxd profile

### Requirement: Navigation and contact

A fixed top bar SHALL show the name and links to each section. The say hi panel SHALL show the email address as a mailto link plus links to Instagram, GitHub, LinkedIn and Letterboxd.

#### Scenario: Contact link

- **WHEN** a visitor clicks the email on the say hi panel
- **THEN** their mail client opens a message to nausher@sherrao.tech

### Requirement: Accessible structure

The page SHALL have exactly one top-level heading (the name), one heading per panel, and alt text on every content image. Every interactive element SHALL be reachable and operable by keyboard with a visible focus style.

#### Scenario: Keyboard navigation

- **WHEN** a visitor tabs through the page
- **THEN** focus moves through the navigation, links and photo tiles in reading order, with a visible focus indicator on each

### Requirement: The day job panel shows a timeline of jobs

The day job panel SHALL show every job marked as shown, from freelancing (2011) to the current role, each with organization, role, dates, and one line about the work. Jobs marked hidden SHALL not appear. A job with more than one stint SHALL appear once, with all its stints.

#### Scenario: Freelancing starts the timeline

- **WHEN** a visitor views the day job panel
- **THEN** the earliest job shown is freelance software development, starting in 2011

#### Scenario: Hidden job

- **WHEN** a job is marked as not shown in the content
- **THEN** the job no longer appears in the day job panel, and its content is kept

#### Scenario: Two stints at one company

- **WHEN** a visitor views Shopify in the day job panel
- **THEN** it appears once, showing both stints (summer 2022 and winter 2023)

#### Scenario: Ongoing job

- **WHEN** a job has no end date
- **THEN** it is shown as running to now

### Requirement: The day job timeline is readable without the visuals

The day job panel SHALL expose each job as text in reading order (organization, role, dates and line), so screen readers and keyboard users get the same facts as any visual timeline. Anything drawn purely for visual effect (bars, axes, leader lines) SHALL be hidden from assistive technology. On small screens the panel SHALL have no horizontal scroll.

#### Scenario: Screen reader

- **WHEN** a screen reader reads the day job panel
- **THEN** it reads each job as a list item with its organization, role and dates, and announces no decorative shapes

#### Scenario: Phone layout

- **WHEN** the day job panel is viewed at 390x844
- **THEN** every job is readable by scrolling the page and the page has no horizontal scroll
