# Implementation Tasks

1.  **Backend: Add TOML dependency**
    - [ ] Run `go get github.com/BurntSushi/toml`
    - [ ] Verify `go.mod` and `go.sum`.

2.  **Backend: Implement Config Handler**
    - [ ] Create `handler/open_link.go`.
    - [ ] Implement logic to resolve `$XDG_CONFIG_HOME/dv/config.toml` path.
    - [ ] Implement TOML parsing for `[[open_links]]`.
    - [ ] Implement merging logic for `DV_VIBE_KANBAN_URL`.
    - [ ] Expose `OpenLinkButtonHandler`.

3.  **Backend: Register New Endpoint**
    - [ ] Update `main.go` to register `/api/open-link-button`.
    - [ ] Remove `/api/vibe-kanban` registration.
    - [ ] Delete `handler/kanban.go`.

4.  **Frontend: Update Types**
    - [ ] Update `ui/src/types.ts`:
        - [ ] Add `OpenLink` interface (`{ name: string; url: string }`).
        - [ ] Remove `VibeKanbanConfig` interface.

5.  **Frontend: Update App Component**
    - [ ] Update `ui/src/App.tsx`:
        - [ ] Fetch from `/api/open-link-button`.
        - [ ] Store result as `OpenLink[]`.
        - [ ] Remove `vibeKanbanConfig` state.

6.  **Frontend: Update Header Component**
    - [ ] Update `ui/src/components/Header.tsx`:
        - [ ] Accept `openLinks: OpenLink[]` props.
        - [ ] Map over `openLinks` to render buttons.
        - [ ] Ensure `ExternalLink` icon is used.

7.  **Verification**
    - [ ] Build backend (`go build`).
    - [ ] Build frontend (`cd ui && npm run build` - implicitly checked via embedding, but good to check).
    - [ ] Manual check with `config.toml` and env var combinations.
