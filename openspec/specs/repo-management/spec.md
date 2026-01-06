# repo-management Specification

## Purpose
TBD - created by archiving change add-ghq-operations. Update Purpose after archive.
## Requirements
### Requirement: Repository Addition
The system SHALL allow users to add repositories from remote sources or create them locally via the UI.

#### Scenario: Clone remote repository
- **WHEN** the user clicks the "Add" button
- **AND** enters a remote repository name/URL in the popup
- **AND** leaves "Just create in local" unchecked
- **AND** clicks the "Clone" button
- **THEN** the system sends a request to `POST /api/get` with the repository name.

#### Scenario: Create local repository
- **WHEN** the user clicks the "Add" button
- **AND** enters a repository name in the popup
- **AND** checks "Just create in local"
- **AND** clicks the "Clone" button
- **THEN** the system sends a request to `POST /api/create` with the repository name.

### Requirement: Repository Deletion
The system SHALL allow users to permanently delete a local repository from the filesystem via the UI.

#### Scenario: User initiates deletion
- **WHEN** the user clicks the "More" menu (three dots) on a repository card
- **AND** selects the "Delete" option
- **THEN** a confirmation dialog appears asking "Are you sure you want to delete this repository?".

#### Scenario: User confirms deletion
- **WHEN** the user confirms the deletion in the dialog
- **THEN** the system sends a request to `POST /api/rm` with the repository's full path
- **AND** the repository folder is recursively deleted from the filesystem.

