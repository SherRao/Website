# Spec Delta

## MODIFIED Requirements

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

## ADDED Requirements

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
- **THEN** it appears twice, once per stint (winter 2023, then summer 2022), each with its own line

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
