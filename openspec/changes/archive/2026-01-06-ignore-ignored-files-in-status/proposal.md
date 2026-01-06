# Change: Ignore gitignored files in status check

## Why
Currently, the repository deletion status check might include files that are listed in `.gitignore` (e.g. build artifacts, temporary files) as "uncommitted changes". This causes unnecessary warnings when deleting a repository.

## What Changes
- Modify the status check logic to explicitly exclude files that match `.gitignore` patterns.
- Ensure that only truly relevant uncommitted changes (tracked modified files or untracked non-ignored files) trigger the warning.

## Impact
- Affected specs: `repo-management`
- Affected code: `handler/status.go`
