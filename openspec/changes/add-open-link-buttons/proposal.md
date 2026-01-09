# Change: Add Open Link Buttons

## Why
Currently, the application only supports a single "VIBE-KANBAN" button configured via an environment variable. Users need the ability to configure multiple arbitrary links (e.g., Blog, Design tools) to customize their dashboard.

## What Changes
- **Backend**:
    - Add `github.com/BurntSushi/toml` dependency.
    - Implement configuration loading from `$XDG_CONFIG_HOME/dv/config.toml`.
    - Create new API `/api/open-link-button`.
    - Merge legacy `DV_VIBE_KANBAN_URL` into the new configuration list.
    - Remove `/api/vibe-kanban` endpoint.
- **Frontend**:
    - Update `App.tsx` to fetch from the new API.
    - Update `Header.tsx` to render a list of buttons dynamically.
    - Update types to support `OpenLink` interface.

## Impact
- **Affected specs**: `ui-config` (new capability)
- **Affected code**: `main.go`, `handler/`, `ui/src/App.tsx`, `ui/src/components/Header.tsx`, `ui/src/types.ts`
