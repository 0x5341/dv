# Change: Add GHQ Operations UI

## Why
Currently, the application allows viewing repositories but lacks the ability to add new remote repositories or create local ones directly from the UI. Users have to rely on the command line for these operations.

## What Changes
- Add an "Add" button to the main interface.
- Implement a popup dialog for repository creation/cloning.
- Add `ghq get` functionality via `/api/get` endpoint.
- Add local repository creation functionality via `/api/create` endpoint.

## Impact
- **repo-management**: New capability defining repository addition behaviors.
- **UI**: New components and API integration.
- **Backend**: New API handlers.
