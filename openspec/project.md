# Project Context

## Purpose
GHQをWeb App上でManageします。
ついでにVscode(code serve-web)やvibe-kanbanなども管理します(option)

## Tech Stack
- Backend
    - Go
    - net/http
- Frontend
    - Bun
    - Typescript
    - Vite
    - React
    - React Compiler

## Project Conventions

### Code Style
言語標準の方法に従ってください。
`bun run lint`や`go fmt`,`go vet`等を実装することを推奨します。

### Architecture Patterns
トップディレクトリにはGo Backendコードを置き、ui/にFrontendコードを置きます。
APIごとに分割することを推奨します。
Frontendは適切にコンポーネントを分割することを推奨します。

### Testing Strategy
特にテストしません。
開発用の個人ツールなので、特にいりません

### Git Workflow
ありません。
vibe-kanbanの方法に従います。

## Domain Context
- ui/はビルドされてgo:embedによって埋め込まれます。
- シングルバイナリでビルドするためです。

## Important Constraints
- systemd daemonとして動かすので、cli interactiveな機能は入れません

## External Dependencies
- `code serve-web`(Vscode Server)
- vibe-kanban
- ghq command
