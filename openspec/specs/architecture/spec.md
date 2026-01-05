# architecture Specification

## Purpose
TBD - created by archiving change refactor-file-structure. Update Purpose after archive.
## Requirements
### Requirement: Backend Modularity
The backend code structure SHALL separate HTTP handlers from the main server configuration to ensure maintainability.

#### Scenario: Handlers are isolated
- **WHEN** a developer looks for API logic
- **THEN** they find it in the `handler` package, separated by feature (e.g., `repos.go`, `code.go`).

### Requirement: Frontend Component Modularity
The user interface SHALL be composed of small, single-responsibility React components rather than a single monolithic file.

#### Scenario: Component reusability
- **WHEN** a developer wants to reuse the repository card design
- **THEN** they can import `RepoCard` from the components directory.

