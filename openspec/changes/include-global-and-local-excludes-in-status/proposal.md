# Change: Include global and local gitignore patterns in status check

## Why
Users expect their global git configuration (`~/.config/git/ignore`, `~/.gitignore`) and repository-specific exclusions (`.git/info/exclude`) to be respected when checking for uncommitted changes. Currently, only the root `.gitignore` is checked.

## What Changes
- Update `handler/status.go` to load ignore patterns from:
  - `~/.config/git/ignore`
  - `~/.gitignore`
  - `.git/info/exclude` (within the target repository)
- Combine these patterns with the existing `.gitignore` patterns.

## Impact
- Affected specs: `repo-management`
- Affected code: `handler/status.go`
