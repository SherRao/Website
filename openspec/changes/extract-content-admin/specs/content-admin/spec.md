# Spec Delta

## MODIFIED Requirements

### Requirement: Only the owner can use the admin panel

The admin panel, served from its own host, and every action that reads drafts, saves content, uploads files or restores revisions SHALL require a signed-in session belonging to the single allowed GitHub account. Every action SHALL check the session itself, independent of page access. A project SHALL accept content changes only through its signed content API, never from a browser directly.

#### Scenario: Visitor opens the panel

- **WHEN** someone who is not signed in opens the admin panel's host
- **THEN** they are sent to the sign-in page and no content editor is shown

#### Scenario: Another GitHub account signs in

- **WHEN** a GitHub account other than the allowed one completes sign-in
- **THEN** access is denied and no session for the admin panel is created

#### Scenario: Direct save request without a session

- **WHEN** a save, upload or restore request arrives at the panel without a valid owner session
- **THEN** it is rejected and nothing is stored

#### Scenario: Direct request to the site's content API

- **WHEN** a browser or any other caller without the panel's secret sends a save straight to the site's content API
- **THEN** it is rejected and nothing is stored

## ADDED Requirements

### Requirement: The public site serves no admin panel

The public site SHALL NOT serve admin pages, sign-in routes or session cookies. Requests for `/admin` on the public site SHALL be answered as not found.

#### Scenario: Old admin bookmark

- **WHEN** someone opens `/admin` on the public site
- **THEN** they get the site's not-found page and no sign-in is offered

### Requirement: One panel manages every registered project

The panel SHALL list each registered project and edit its sections using the layout the project's manifest describes. Adding a project SHALL need only its registration (address and secret), not changes to the panel's editors.

#### Scenario: Two projects registered

- **WHEN** the owner signs in with two projects registered
- **THEN** the panel lists both, and each project's sections open in editors built from that project's manifest

### Requirement: Previews and links point at the project

Where content holds a site-relative path, the panel SHALL resolve it against the project's public origin for previews and links. Stored values SHALL be saved exactly as entered.

#### Scenario: Previewing an existing stage photo

- **WHEN** the owner opens the events editor and a stage photo's source is `/events/stage-1.jpg`
- **THEN** the preview loads the image from the site's origin, and saving keeps `/events/stage-1.jpg` unchanged

#### Scenario: Viewing the site

- **WHEN** the owner follows "View site" for a project
- **THEN** the project's public origin opens in a new tab

### Requirement: Unavailable projects are shown, not edited

When a project can't be reached, rejects the panel's signature, or reports a contract version the panel doesn't support, the panel SHALL show that project as unavailable with the reason, offer no editor or save for it, and keep every other project usable.

#### Scenario: Project on a newer contract

- **WHEN** a project's manifest reports a contract version the panel doesn't support
- **THEN** the project is listed as unavailable with that reason and none of its sections can be saved

#### Scenario: Project down

- **WHEN** one project's API doesn't answer
- **THEN** that project is shown as unavailable, and other projects can still be edited
