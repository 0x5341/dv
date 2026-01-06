## 1. Implementation
- [x] 1.1 Update `handler/status.go` to resolve user home directory and read global ignore files (`~/.config/git/ignore`, `~/.gitignore`).
- [x] 1.2 Update `handler/status.go` to read `.git/info/exclude` from the repository.
- [x] 1.3 Combine all patterns and use them in the `gitignore.Matcher`.
