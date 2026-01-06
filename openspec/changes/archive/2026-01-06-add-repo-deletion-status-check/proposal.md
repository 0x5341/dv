# Change: Add Git Status Check to Repository Deletion

## Why
リポジトリを削除する前に、未コミットの変更、未プッシュのコミット、または未マージのワークツリーが存在するかをユーザーに知らせることで、重要なデータの喪失を防ぎ、より安全な削除操作を提供するため。

## What Changes
- **Backend**:
  - `go-git/go-git/v5` を依存関係に追加。
  - 新しいエンドポイント `/api/repo/status` を追加。
    - パラメータ: `path` (リポジトリのフルパス)
    - レスポンス: 未コミットの変更(unstaged/staged)、未プッシュのコミット、未マージのワークツリーの有無を含む JSON。
  - `go-git` を使用してこれらの状態を判定するロジックを実装。
- **Frontend**:
  - `RepoCard` コンポーネントの削除ダイアログを更新。
  - ダイアログが開いた際に `/api/repo/status` を呼び出し、ステータスを取得。
  - ステータスが存在する場合（例：未コミットの変更がある）、削除確認ボタンの上に警告メッセージを表示。

## Impact
- Affected specs: `specs/repo-management/spec.md`
- Affected code: `handler/`, `ui/src/components/RepoCard.tsx`, `go.mod`
- 新しい依存関係: `github.com/go-git/go-git/v5`
