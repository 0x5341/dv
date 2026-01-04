# DV - Development Environment Manager

A web-based development environment manager that provides a unified interface for managing repositories and launching development tools.

[日本語版](docs/README_ja.md)

## Features

- **Repository Browser**: View and search all your repositories managed by `ghq`
- **Fuzzy Search**: Find repositories quickly with Fuse.js powered fuzzy search
- **Code Server Integration**: Open repositories directly in VS Code Server
- **GitHub Integration**: Quick links to GitHub repositories
- **VIBE-KANBAN Integration**: Launch VIBE-KANBAN web application
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Quick Start

### Prerequisites

- [ghq](https://github.com/x-motemen/ghq) for repository management

### Installation

Download the latest binary from GitHub Releases:

1. Go to [GitHub Releases](https://github.com/0x5341/dv/releases)
2. Download the appropriate binary for your platform (Linux, macOS, or Windows)
3. Extract and place the binary in your PATH

```bash
# Example for Linux
wget https://github.com/0x5341/dv/releases/latest/download/dv-linux-amd64
chmod +x dv-linux-amd64
sudo mv dv-linux-amd64 /usr/local/bin/dv
```

### Usage

1. Start the server:
```bash
./dv
```

2. Open your browser and navigate to `http://localhost:3000`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | Port for the web server | `3000` |
| `DV_CODE_SERVER_URL` | VS Code Server URL | `http://localhost:8000` |
| `DV_CODE_SERVER_TOKEN` | VS Code Server authentication token | - |
| `DV_VIBE_KANBAN_PORT` | Port for VIBE-KANBAN integration | `4000` |

## Development

### Prerequisites

- [Go](https://go.dev/) 1.25.5 or later
- [Bun](https://bun.sh/) for frontend development

### Frontend Development

The UI is built with React and Vite:

```bash
cd ui
bun install
bun run dev
```

### Build Production

```bash
cd ui
bun run build
cd ..
go build -o dv .
```

## API Endpoints

- `GET /api/repos` - Returns list of repositories from `ghq`
- `GET /api/code` - Returns Code Server configuration
- `GET /api/vibe-kanban` - Returns VIBE-KANBAN URL configuration

## Architecture

- **Backend**: Go web server with embedded frontend assets
- **Frontend**: React SPA with Tailwind CSS for styling
- **Search**: Fuse.js for fuzzy search functionality
- **UI Components**: Radix UI components with custom styling

## Documentation

- [日本語版ドキュメント](docs/README_ja.md) - Japanese documentation