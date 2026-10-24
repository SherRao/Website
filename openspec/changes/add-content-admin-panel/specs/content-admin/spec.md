# Spec Delta

## Purpose

Lets the site owner edit every piece of site content, upload the resume and photos, and restore earlier versions from a private web panel, with changes going live without a code deploy.

## ADDED Requirements

### Requirement: Only the owner can use the admin panel
The admin panel and every action that reads drafts, saves content, uploads files or restores revisions SHALL require a signed-in session belonging to the single allowed GitHub account. Every action SHALL check the session itself, independent of page access.

#### Scenario: Visitor opens the panel
- **WHEN** someone who is not signed in opens `/admin`
- **THEN** they are sent to the sign-in page and no content editor is shown

#### Scenario: Another GitHub account signs in
- **WHEN** a GitHub account other than the allowed one completes sign-in
- **THEN** access is denied and no session for the admin panel is created

#### Scenario: Direct save request without a session
- **WHEN** a save, upload or restore request arrives without a valid owner session
- **THEN** it is rejected and nothing is stored

### Requirement: Every content section is editable
The panel SHALL let the owner edit every content section shown on the site: profile and site metadata, socials, "at a glance" items, products, events and their stats, stage photos, panel copy, founder works, off-hours cards and fallback films. Lists SHALL support adding, removing and reordering items.

#### Scenario: Adding a job
- **WHEN** the owner adds a product with a name, description, role and years and saves
- **THEN** the product appears on the site without a code change

#### Scenario: Reordering products
- **WHEN** the owner moves a product up the list and saves
- **THEN** the site shows products in the new order

### Requirement: Saves are validated
A save SHALL be accepted only if the whole section passes the content schema. A rejected save SHALL leave the stored content unchanged and SHALL tell the owner which fields are invalid.

#### Scenario: Missing required field
- **WHEN** the owner saves an event with no name
- **THEN** the save is rejected, the name field is flagged, and the live site is unchanged

### Requirement: Edits go live on the next page load
After a successful save, upload or restore, the next request for the public site SHALL show the new content, without a build or deploy.

#### Scenario: Updating the headline
- **WHEN** the owner changes the headline and saves
- **THEN** reloading the home page shows the new headline

### Requirement: Revision history and restore
Every successful save SHALL record the section's previous content with a timestamp. The panel SHALL list a section's revisions, and restoring one SHALL make it the current content, recorded as a new save.

#### Scenario: Undoing a bad edit
- **WHEN** the owner restores the revision from before their last save
- **THEN** the site shows the earlier content and the undone version is still in the history

### Requirement: Resume upload
The owner SHALL be able to upload a PDF as the current resume. Only PDF files SHALL be accepted. Earlier resumes SHALL remain available to restore.

#### Scenario: Uploading a new resume
- **WHEN** the owner uploads a new resume PDF
- **THEN** the site's resume link serves the new PDF on the next request

#### Scenario: Wrong file type
- **WHEN** the owner uploads a file that is not a PDF as the resume
- **THEN** the upload is rejected and the current resume is unchanged

### Requirement: Photo upload
The owner SHALL be able to upload images for content that shows photos (stage photos and founder works), and every photo SHALL require alt text before it can be saved.

#### Scenario: Photo without alt text
- **WHEN** the owner adds a stage photo without alt text and saves
- **THEN** the save is rejected and the alt text field is flagged

### Requirement: Placeholders and assumed facts are editable
The panel SHALL let the owner mark any placeholder-capable item as "content needed" with a hint, and mark any fact as "assumed", and clear either mark.

#### Scenario: Filling in the band card
- **WHEN** the owner clears "content needed" on the band card and enters its details
- **THEN** the site shows the details instead of the "content needed" marker
