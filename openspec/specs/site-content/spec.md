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
Roles, dates and numbers SHALL match the resume and the confirmed details from planning (for example Konfer from July 2024, SpurHacks 2025 with 1,400+ attendees and 291 projects, Tab started August 2026). Facts not yet confirmed (the Mappedin start date and the organizer role at HawkHacks, Collision and the BBQ) SHALL be marked as assumed in the content module.

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
