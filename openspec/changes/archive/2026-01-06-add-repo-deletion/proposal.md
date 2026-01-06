# Change: Add Repository Deletion

## Why
Users need a way to remove repositories that are no longer needed directly from the management interface, rather than having to manually delete folders in the terminal.

## What Changes
- **Backend**: New API endpoint `/api/rm` that accepts a repository path and recursively deletes it from the filesystem.
- **Frontend**: 
    - Add a "more" menu (three dots) to each repository card.
    - Add a "Delete" option in the menu.
    - Add a confirmation dialog ("Are you sure?") before executing the deletion.

## Impact
- **Specs**: `repo-management` capability extended.
- **UI**: `RepoCard` component updated, new UI components (DropdownMenu, Dialog/Alert) added.
- **API**: New handler for deletion.
