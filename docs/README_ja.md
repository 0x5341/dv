# DV - 開発環境マネージャー

リポジトリ管理と開発ツール起動のための統一インターフェースを提供するWebベースの開発環境マネージャー。

[English Documentation](../README.md)

## 機能

- **リポジトリブラウザ**: `ghq` で管理されているすべてのリポジトリを表示・検索
- **ファジー検索**: Fuse.js を使った高速なファジー検索機能
- **Code Server連携**: リポジトリを直接VS Code Serverで開く
- **GitHub連携**: GitHubリポジトリへのクイックリンク
- **VIBE-KANBAN連携**: VIBE-KANBAN Webアプリケーションを起動
- **モダンUI**: React、TypeScript、Tailwind CSSで構築

## クイックスタート

### 前提条件

- リポジトリ管理には [ghq](https://github.com/x-motemen/ghq)

### インストール

GitHubリリースから最新のバイナリをダウンロード:

1. [GitHub Releases](https://github.com/0x5341/dv/releases) にアクセス
2. プラットフォームに応じたバイナリをダウンロード (Linux、macOS、またはWindows)
3. 展開してバイナリをPATHに配置

```bash
# Linuxの場合の例
wget https://github.com/0x5341/dv/releases/latest/download/dv-linux-amd64
chmod +x dv-linux-amd64
sudo mv dv-linux-amd64 /usr/local/bin/dv
```

### 使い方

1. サーバーを起動:
```bash
./dv
```

2. ブラウザで `http://localhost:3000` を開く

### 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `SERVER_PORT` | Webサーバーのポート | `3000` |
| `DV_CODE_SERVER_URL` | VS Code ServerのURL | `http://localhost:8000` |
| `DV_CODE_SERVER_TOKEN` | VS Code Serverの認証トークン | - |
| `DV_VIBE_KANBAN_PORT` | VIBE-KANBAN連携のポート | `4000` |

## 開発

### 前提条件

- [Go](https://go.dev/) 1.25.5 以降
- フロントエンド開発には [Bun](https://bun.sh/)

### フロントエンド開発

UIはReactとViteで構築されています:

```bash
cd ui
bun install
bun run dev
```

### プロダクションビルド

```bash
cd ui
bun run build
cd ..
go build -o dv .
```

## APIエンドポイント

- `GET /api/repos` - `ghq` からリポジトリリストを返す
- `GET /api/code` - Code Serverの設定を返す
- `GET /api/vibe-kanban` - VIBE-KANBANのURL設定を返す

## アーキテクチャ

- **バックエンド**: フロントエンドアセットを埋め込んだGo Webサーバー
- **フロントエンド**: Tailwind CSSを使用したReact SPA
- **検索**: ファジー検索機能にはFuse.js
- **UIコンポーネント**: Radix UIコンポーネントとカスタムスタイリング

## ドキュメント

- [English Documentation](../README.md) - 英語版ドキュメント