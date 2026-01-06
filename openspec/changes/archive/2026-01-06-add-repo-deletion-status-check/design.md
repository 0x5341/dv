# Design: Repository Status Check using go-git

## Context
リポジトリ削除前に、失われる可能性のある作業内容を特定し、ユーザーに警告を表示する。

## Goals
- `go-git` を使用して、リポジトリが「クリーン」であるか（未コミットの変更がないか）を判定する。
- ローカルブランチに、リモートにプッシュされていないコミットがあるかを判定する。
- 競合（unmerged entries）があるかを判定する。

## Technical Decisions

### 1. Git ステータスの取得
`Worktree.Status()` を使用して、インデックスとワーキングツリーの状態を取得する。
- `Status.IsClean()` が false の場合、未コミットの変更があるとみなす。

### 2. 未プッシュのコミット判定
全てのローカルブランチについて、そのアップストリーム（追跡対象リモートブランチ）と比較する。
- `Repo.Branch(name)` でブランチ設定を取得。
- アップストリームが存在する場合、ローカルの HEAD がリモートの HEAD に含まれているかを確認。
- アップストリームが存在しないローカルブランチがある場合も「未プッシュ」とみなす。
- 未プッシュのコミットがある場合、各コミットのタイトルとハッシュを収集する。

### 3. 未マージのローカルブランチの判定
各ローカルブランチがデフォルトブランチ（例: `main` または `master`）にマージされているかを確認する。
- リポジトリのデフォルトブランチ (`main` または `master`) の HEAD コミットを取得する。
- 各ローカルブランチの HEAD コミットを取得する。
- `go-git` の `Repository.Is
    Ancestor` を使用して、ローカルブランチの HEAD がデフォルトブランチの HEAD の祖先ではないことを確認する。
- デフォルトブランチにマージされていないローカルブランチを「未マージ」と判定する。

### 4. API 設計
`GET /api/repo/status?path=...`
レスポンス形式:
```json
{
  "is_clean": false,
  "has_unpushed_commits": true,
  "has_conflicts": false,
  "uncommitted_files": ["main.go", "ui/App.tsx"],
  "unpushed_commits": [
    {
      "branch": "feature/work",
      "commits": [
        {"hash": "abcdef12", "message": "feat: add new feature X"},
        {"hash": "fedcba98", "message": "fix: bug Y"}
      ]
    }
  ],
  "unmerged_local_branches": ["feature/work", "bugfix/Z"]
}
```

## Risks / Trade-offs
- **パフォーマンス**: 大規模なリポジトリやブランチ数が多い場合、ステータスチェックに時間がかかる可能性がある。削除ダイアログ表示時に非同期で取得し、ロード中を表示することでUXを確保する。
- **go-git の制限**: `git worktree` (複数ワークツリー) の完全なサポートは `go-git` には欠けている可能性があるため、本実装では標準の単一ワークツリーの状態確認に注力する。
