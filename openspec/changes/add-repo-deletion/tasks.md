## 1. Frontend Implementation
- [x] 1.1 Install `@radix-ui/react-dropdown-menu` and `@radix-ui/react-alert-dialog` (or implement equivalent components).
- [x] 1.2 Add `DropdownMenu` and `AlertDialog` components to `ui/src/components/ui/`.
- [x] 1.3 Update `ui/src/components/RepoCard.tsx` to include the three-dots menu icon (`MoreVertical`).
- [x] 1.4 Implement the delete confirmation flow in `RepoCard.tsx`.

## 2. Backend Implementation
- [x] 2.1 Create `handler/rm.go` to handle `POST /api/rm`.
- [x] 2.2 Implement recursive file deletion logic using `os.RemoveAll`.
- [x] 2.3 Register the `/api/rm` endpoint in `main.go`.

## 3. Integration
- [x] 3.1 Wire up the frontend "Delete" action to call `/api/rm`.
- [x] 3.2 Verify deletion removes the folder and updates the UI list (refresh or optimistic update).