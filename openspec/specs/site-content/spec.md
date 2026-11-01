# site-content Specification

## Purpose

Defines where the site's words and data come from, how missing content is shown, and the privacy rule for the stealth company.

## Requirements

### Requirement: Single typed content source

All copy, roles, products, events, photos and links SHALL come from one content store, read through one shared schema, so changing content never requires editing a component or deploying code.

#### Scenario: Adding a product

- **WHEN** a new product is added to the content store
- **THEN** it appears in the engineer panel's product links without any component change

#### Scenario: Content store unreachable

- **WHEN** the content store cannot be reached
- **THEN** the site keeps serving the last cached content

### Requirement: Facts match the source material

Roles, dates and numbers SHALL match the resume and the confirmed details from planning (for example Konfer from July 2024, SpurHacks 2025 with 1,400+ attendees and 291 projects, Tab started August 2026). Facts not yet confirmed SHALL carry an "assumed" mark in the content store.

#### Scenario: Assumed facts are findable

- **WHEN** the owner filters content by the "assumed" mark
- **THEN** every unconfirmed fact is listed

### Requirement: Missing content is shown honestly

Content not yet supplied (the band, photography, cooking) SHALL appear as a clearly marked placeholder ("content needed") rather than invented text, and SHALL be replaceable from the content store alone.

#### Scenario: Band details missing

- **WHEN** the band content is marked "content needed"
- **THEN** the music I make card shows a "content needed" marker and no made-up details

### Requirement: The stealth company is never named

The site SHALL refer to the new company only as "a new company, in stealth" or "untitled". Keeping its name and details out of the code and the content entered in the admin panel is the owner's responsibility and is not checked automatically.

#### Scenario: Founder panel and cover

- **WHEN** the founder panel and the cover's "at a glance" row are shown
- **THEN** the company appears only as "untitled" and "a new company, in stealth", with no link

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

### Requirement: Resume link serves the current resume

`/resume` and `/resume.pdf` SHALL redirect to the most recently uploaded resume PDF, so existing links keep working after every upload.

#### Scenario: Old link after an upload

- **WHEN** someone opens `/resume.pdf` after a new resume was uploaded
- **THEN** they receive the new PDF

### Requirement: Featured products are chosen in content

Which products the engineer panel features by name SHALL be set by a field on each product, not by product names written in code.

#### Scenario: Renaming a featured product

- **WHEN** the owner renames a featured product
- **THEN** the product is still featured and the page renders without errors
