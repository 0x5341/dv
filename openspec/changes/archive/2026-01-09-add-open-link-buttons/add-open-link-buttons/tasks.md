# Implementation Tasks

1.  **Backend: Add TOML dependency**
    - [x] Run `go get github.com/BurntSushi/toml` (manual install not available in this environment)
    - [x] Verify `go.mod` and `go.sum`.

2.  **Backend: Implement Config Handler**
    - [x] Create `handler/open_link.go`.
    - [x] Implement logic to resolve `$XDG_CONFIG_HOME/dv/config.toml` path.
    - [x] Implement TOML parsing for `[[open_links]]`.
    - [x] Implement merging logic for `DV_VIBE_KANBAN_URL`.
    - [x] Expose `OpenLinkButtonHandler`.

3.  **Backend: Register New Endpoint**
    - [x] Update `main.go` to register `/api/open-link-button`.
    - [x] Remove `/api/vibe-kanban` registration.
    - [ ] Delete `handler/kanban.go`.

4.  **Frontend: Update Types**
    - [x] Update `ui/src/types.ts`:
        - [x] Add `OpenLink` interface (`{ name: string; url: string }`).
        - [x] Remove `VibeKanbanConfig` interface.

5.  **Frontend: Update App Component**
    - [x] Update `ui/src/App.tsx`:
        - [x] Fetch from `/api/open-link-button`.
        - [x] Store result as `OpenLink[]`.
        - [x] Remove `vibeKanbanConfig` state.

6.  **Frontend: Update Header Component**
    - [x] Update `ui/src/components/Header.tsx`:
        - [x] Accept `openLinks: OpenLink[]` props.
        - [x] Map over `openLinks` to render buttons.
        - [x] Ensure `ExternalLink` icon is used.

7.  **Verification**
    - [ ] Build backend (`go build`).
    - [ ] Build frontend (`cd ui && npm run build` - implicitly checked via embedding, but good to check).
    - [ ] Manual check with `config.toml` and env var combinations.
