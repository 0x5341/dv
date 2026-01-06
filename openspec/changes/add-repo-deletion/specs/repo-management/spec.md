## ADDED Requirements
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
