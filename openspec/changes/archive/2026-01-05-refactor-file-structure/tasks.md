## 1. Backend Refactoring
- [x] 1.1 Create `handler` package directory.
- [x] 1.2 Move `apiReposHandler` and `getRepos` logic to `handler/repos.go`.
- [x] 1.3 Move `apiCodeHandler` logic to `handler/code.go`.
- [x] 1.4 Move `apiVibeKanbanHandler` logic to `handler/kanban.go`.
- [x] 1.5 Update `main.go` to import and use the new `handler` package.
- [x] 1.6 Verify backend builds and runs (`go build`).

## 2. Frontend Refactoring
- [x] 2.1 Create `ui/src/components/Header.tsx` and move header logic.
- [x] 2.2 Create `ui/src/components/SearchBar.tsx` and move input logic.
- [x] 2.3 Create `ui/src/components/RepoCard.tsx` and move card logic.
- [x] 2.4 Create `ui/src/components/RepoList.tsx` and move grid/list logic.
- [x] 2.5 Refactor `App.tsx` to compose these new components.
- [x] 2.6 Verify frontend builds and runs.