## Purpose

Defines the structure of the home page: a stack of full-screen panels that pin and slide over each other, what each panel contains, and how the page behaves on small screens.

## ADDED Requirements

### Requirement: Home page is a stack of full-screen panels
The home page SHALL show six panels in this order: cover, the engineer, the stage, the founder, off hours, say hi. On screens at least 961px wide and 641px tall, each panel SHALL fill the viewport, pin to the top while the next panel slides up over it, and show a dark background with a faint 6-column grid.

#### Scenario: Next panel covers the current one
- **WHEN** a visitor on a 1440x900 screen scrolls down from a pinned panel
- **THEN** the current panel stays fixed in place and the next panel slides up over it until it fills the screen

#### Scenario: Every panel fits one screen
- **WHEN** the page is viewed at 1440x900 or 1280x720
- **THEN** no panel's content is cut off or needs scrolling inside the panel

### Requirement: Scrolling snaps to panels
On the large-screen layout, scrolling SHALL come to rest with exactly one panel fully in place, never halfway between two panels.

#### Scenario: Stopping between panels
- **WHEN** a visitor stops scrolling partway through a panel transition
- **THEN** the page settles on the nearest panel, fully in place

#### Scenario: In-page links land on a panel
- **WHEN** a visitor clicks a section link in the navigation
- **THEN** the page moves to that panel and it is fully in place

### Requirement: Small screens scroll normally
Below 961px wide or 641px tall, panels SHALL be laid out one after another with normal scrolling, no pinning and no snapping, and all panel content SHALL remain reachable.

#### Scenario: Phone layout
- **WHEN** the page is viewed at 390x844
- **THEN** every panel's content is visible by scrolling, nothing pins or snaps, and the page has no horizontal scroll

### Requirement: Cover panel gives the essentials at a glance
The cover SHALL show the visitor's first view of: the name, the headline, a short intro, and an "at a glance" row with the current role (Mappedin), the company (Konfer), a new company in stealth, the largest event (1,400+ people at SpurHacks 2025), and the number of products built. Each linkable item SHALL link to its destination.

#### Scenario: First screen
- **WHEN** the page loads at 1440x900
- **THEN** the name, headline, intro and all five "at a glance" items are visible without scrolling

### Requirement: The engineer panel shows works with museum labels
The engineer panel SHALL show three works (blue dot, Tab, Shopify CLI + Partner Dashboard) as artworks in a row. Each SHALL have a label with title, years, role, a one- or two-line note, and a link where one exists. The remaining products SHALL appear as compact links.

#### Scenario: Tab is reachable
- **WHEN** a visitor views the engineer panel
- **THEN** Tab appears as a work labelled "side project, 2026" with a link to its source repository

### Requirement: The stage panel shows a dense photo mosaic
The stage panel SHALL show at least eight event photos close together in one mosaic, with the largest tile for SpurHacks 2025, plus a line listing each event with its headline number. Each photo SHALL have a caption visible on hover or focus (always visible on small screens).

#### Scenario: Photo captions
- **WHEN** a visitor hovers or keyboard-focuses a photo tile
- **THEN** its caption appears

### Requirement: The founder panel shows companies, including the stealth company
The founder panel SHALL show Konfer, SPUR Innovation Center, Seahorse and an "untitled" work for the stealth company, each with a label.

#### Scenario: Stealth company shown without details
- **WHEN** a visitor views the founder panel
- **THEN** the stealth company appears only as "untitled", "a new company, in stealth", with no name, industry, location or link

### Requirement: Off hours panel shows personal interests
The off hours panel SHALL show cards for music I listen to, music I make, films, photography and cooking.

#### Scenario: Films card
- **WHEN** a visitor views off hours
- **THEN** the films card lists recent films with ratings and links to the Letterboxd profile

### Requirement: Navigation and contact
A fixed top bar SHALL show the name and links to each section. The say hi panel SHALL show the email address as a mailto link plus links to GitHub, LinkedIn and Letterboxd.

#### Scenario: Contact link
- **WHEN** a visitor clicks the email on the say hi panel
- **THEN** their mail client opens a message to nausher@sherrao.tech

### Requirement: Accessible structure
The page SHALL have exactly one top-level heading (the name), one heading per panel, and alt text on every content image. Every interactive element SHALL be reachable and operable by keyboard with a visible focus style.

#### Scenario: Keyboard navigation
- **WHEN** a visitor tabs through the page
- **THEN** focus moves through the navigation, links and photo tiles in reading order, with a visible focus indicator on each
