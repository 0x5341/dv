## ADDED Requirements

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
