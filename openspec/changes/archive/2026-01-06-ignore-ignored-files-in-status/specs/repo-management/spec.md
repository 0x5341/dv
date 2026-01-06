## MODIFIED Requirements
### Requirement: Repository Deletion
The system SHALL allow users to permanently delete a local repository from the filesystem via the UI. Before deletion, the system SHALL check for uncommitted changes (excluding files matched by .gitignore) or unpushed commits and warn the user.

#### Scenario: User initiates deletion
- **WHEN** the user clicks the "More" menu (three dots) on a repository card
- **AND** selects the "Delete" option
- **THEN** a confirmation dialog appears.
- **AND** the system automatically fetches the Git status of the repository.

#### Scenario: User warns of uncommitted/unpushed/unmerged changes
- **WHEN** the Git status check reveals uncommitted changes, unpushed commits, or unmerged local branches
- **THEN** a warning message is displayed in the confirmation dialog, specifically above the "Are you sure?" text.
- **AND** the warning clearly indicates the presence of:
  - Uncommitted changes (unstaged/staged files, excluding gitignored files).
  - Unpushed commits (branch names, commit titles, and hashes).
  - Unmerged local branches (branch names not merged into the default branch).
- **AND** the warning states that proceeding with deletion will result in permanent data loss for these items.

#### Scenario: User confirms deletion
- **WHEN** the user confirms the deletion in the dialog
- **THEN** the system sends a request to `POST /api/rm` with the repository's full path
- **AND** the repository folder is recursively deleted from the filesystem.
