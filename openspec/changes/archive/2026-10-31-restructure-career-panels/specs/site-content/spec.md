# Spec Delta

## MODIFIED Requirements

### Requirement: Facts match the source material

Roles, dates and numbers SHALL match the resume, the LinkedIn profile and the confirmed details from planning (for example Konfer from July 2024, SpurHacks 2025 with 1,400+ attendees and 291 projects, Tab started August 2026, HawkHacks founded and led as president from 2021 to 2025). Facts not yet confirmed (the Mappedin start date and the organizer role at Collision and the BBQ) SHALL be marked as assumed in the content module.

#### Scenario: Assumed facts are findable

- **WHEN** someone searches the content module for "assumed"
- **THEN** every unconfirmed fact is listed

## ADDED Requirements

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
