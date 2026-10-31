# site-content Specification

## Purpose

Defines where the site's words and data come from, how missing content is shown, and the privacy rule for the stealth company.

## Requirements

### Requirement: Single typed content source

All copy, roles, products, events, photos and links SHALL come from one typed content module, so changing content never requires editing a component.

#### Scenario: Adding a product

- **WHEN** a new product is added to the content module
- **THEN** it appears in the engineer panel's product links without any component change

### Requirement: Facts match the source material

Roles, dates and numbers SHALL match the resume, the LinkedIn profile and the confirmed details from planning (for example Konfer from July 2024, SpurHacks 2025 with 1,400+ attendees and 291 projects, Tab started August 2026, HawkHacks founded and led as president from 2021 to 2025). Facts not yet confirmed (the Mappedin start date and the organizer role at Collision and the BBQ) SHALL be marked as assumed in the content module.

#### Scenario: Assumed facts are findable

- **WHEN** someone searches the content module for "assumed"
- **THEN** every unconfirmed fact is listed

### Requirement: Missing content is shown honestly

Content not yet supplied (the band, photography, cooking) SHALL appear as a clearly marked placeholder ("content needed") rather than invented text, and SHALL be replaceable from the content module alone.

#### Scenario: Band details missing

- **WHEN** the band content is empty
- **THEN** the music I make card shows a "content needed" marker and no made-up details

### Requirement: The stealth company is never named

The site SHALL refer to the new company only as "a new company, in stealth" or "untitled". Its name, industry, location, links and any detail from its project SHALL not appear in page content, metadata, source maps, comments or shipped assets.

#### Scenario: Build output check

- **WHEN** the production build output is searched for the company's name and for details from its project
- **THEN** there are no matches

### Requirement: Page metadata

The page SHALL have a title, description and Open Graph tags that describe Nausher Rao as engineer, founder and stage manager, with a social share image.

#### Scenario: Link preview

- **WHEN** the site URL is shared on a platform that reads Open Graph tags
- **THEN** the preview shows the title, description and share image

### Requirement: Jobs are stored with structured dates

Each job SHALL be stored with one or more stints, each with a role, a start month and an optional end month, plus a flag for whether it is shown. Every date shown for a job SHALL come from these stored months, never from separately typed date text.

#### Scenario: Correcting a date

- **WHEN** a stint's end month is changed in the content
- **THEN** the day job panel shows the new month without any other edit

#### Scenario: Invalid dates caught

- **WHEN** a stint's end month is before its start month, or a month isn't written as year and month
- **THEN** the content tests fail and name the job

### Requirement: Side projects, job work and founded organizations are kept apart

Content SHALL keep side projects, jobs and founded organizations as separate lists, so each item appears in exactly one of the day job, engineer and founder panels.

#### Scenario: Products list holds side projects only

- **WHEN** the products content is listed
- **THEN** it contains only side projects, and work done for an employer appears with its job instead
