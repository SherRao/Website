# Spec Delta

## Purpose

Lets a separate admin panel read, save, restore and upload this site's content over a signed interface, while the site alone decides what content is valid and when it goes live.

## ADDED Requirements

### Requirement: Only signed requests are answered

Every content API request SHALL carry a signature over its method, path, query, timestamp and body, made with a secret the site holds. A request that is unsigned, has a wrong signature, or has a timestamp more than five minutes from the site's clock SHALL be rejected as unauthorized, and nothing SHALL be read or changed.

#### Scenario: Unsigned request

- **WHEN** a request reaches the content API with no signature
- **THEN** it is rejected as unauthorized and no content is returned

#### Scenario: Body changed after signing

- **WHEN** a signed save request arrives whose body differs from the one that was signed
- **THEN** it is rejected as unauthorized and the stored content is unchanged

#### Scenario: Old request replayed

- **WHEN** a correctly signed request arrives more than five minutes after its timestamp
- **THEN** it is rejected as unauthorized

#### Scenario: Secret rotation

- **WHEN** the site is configured with both a current and a next secret, and a request is signed with either
- **THEN** the request is accepted

### Requirement: Manifest describes how the site is edited

The API SHALL serve a manifest with the contract version, the project's name and public origin, every section with its title, description and editing layout, each upload kind with its accepted types and size limit, the flags the panel can list (such as "assumed"), and whether saving and uploads are available on this deployment.

#### Scenario: Panel loads the site

- **WHEN** the admin panel requests the manifest with a valid signature
- **THEN** it receives every section of the site with the layout needed to render its editor, and the contract version

#### Scenario: Read-only deployment

- **WHEN** the manifest is requested from a deployment that can't save (fixture content on Vercel)
- **THEN** the manifest says saving is off and gives the reason

### Requirement: Sections are read for editing from the store

Reading a section SHALL return the latest stored document, not a cached copy, with its version. A stored document that fails the schema SHALL still be returned, with its problems by field path. A section never saved SHALL be reported as missing.

#### Scenario: Section that fails its schema

- **WHEN** a stored section no longer passes its schema and is read through the API
- **THEN** its stored data is returned together with each failing field path and message

#### Scenario: Unknown section

- **WHEN** a section key that the site doesn't have is requested
- **THEN** the request is answered as not found

### Requirement: Saves are validated and versioned by the site

A save SHALL be accepted only if the whole section passes the site's schema and the save is based on the current version. A rejected save SHALL leave the stored content unchanged and return why, with invalid fields by path.

#### Scenario: Invalid save

- **WHEN** a signed save sends an event with no name
- **THEN** the save is rejected with the event's name field flagged, and the stored content is unchanged

#### Scenario: Stale save

- **WHEN** a signed save is based on a version older than the stored one
- **THEN** the save is refused as a conflict and the newer content is kept

### Requirement: Changes made through the API go live on the next page load

After a save or restore through the API succeeds, the next request for any public page, metadata file or resume link that uses that section SHALL show the new content, without a build or deploy.

#### Scenario: Headline saved through the API

- **WHEN** a signed save changes the headline and succeeds
- **THEN** the next load of the home page shows the new headline

### Requirement: Revisions are listed and restored through the API

The API SHALL list a section's earlier versions newest first, a page at a time, together with the current content. Restoring a revision SHALL make it current, recorded as a new save. A revision that no longer passes the schema SHALL NOT be restored.

#### Scenario: Restoring a revision

- **WHEN** a signed request restores a revision of the profile
- **THEN** the profile shows that revision's content and the replaced version appears in the history

#### Scenario: Revision that no longer fits the schema

- **WHEN** a signed request restores a revision that fails the current schema
- **THEN** the restore is refused and the current content is unchanged

### Requirement: Upload authorization is issued by the site

The site SHALL authorize an upload only for a declared upload kind, an accepted file type, a size within the kind's limit, and an unguessable storage path under that kind's prefix. The file SHALL be stored in the site's own file store. A deployment that can't save SHALL refuse uploads.

#### Scenario: Photo upload authorized

- **WHEN** the panel asks to upload a WebP image as a photo under the photos prefix
- **THEN** the site returns a short-lived authorization limited to that path, type and size

#### Scenario: Disallowed upload

- **WHEN** the panel asks to upload an HTML file as a photo
- **THEN** the site refuses and nothing can be stored

#### Scenario: Uploaded photo is shown on the site

- **WHEN** a photo uploaded through an authorization from the site is saved into the stage mosaic
- **THEN** the site renders it through its own image optimizer
