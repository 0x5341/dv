# Change: Refactor File Structure for Maintainability

## Why
Currently, the codebase has low cohesion and high coupling within single files.
- `main.go` contains all API handlers, domain logic, and server configuration.
- `App.tsx` contains all UI components, state management, and effect logic.

This makes the code difficult to read, test, and maintain. Splitting these into focused modules will improve developer experience and scalability.

## What Changes
- **Backend (Go):**
  - Extract API handlers into a separate `handler` package.
  - Split handlers into individual files (`repos.go`, `code.go`, `kanban.go`).
- **Frontend (React):**
  - Extract UI sections into reusable components (`RepoCard`, `RepoList`, `SearchBar`, `Header`).
  - Move these components to `ui/src/components/`.

## Impact
- **Affected Specs:** `architecture` (New capability)
- **Affected Code:** `main.go`, `ui/src/App.tsx`
