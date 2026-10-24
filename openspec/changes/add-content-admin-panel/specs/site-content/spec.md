# Spec Delta

## MODIFIED Requirements

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
The site SHALL refer to the new company only as "a new company, in stealth" or "untitled". The production build SHALL fail if the company's name or project details appear in code, metadata, source maps, comments or shipped assets. Keeping the name out of content entered in the admin panel is the owner's responsibility and is not checked automatically.

#### Scenario: Build output check
- **WHEN** the production build output is searched for the company's name and for details from its project
- **THEN** there are no matches

## ADDED Requirements

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
