export interface Repo {
  name: string
  fullPath: string
}

export interface CodeConfig {
  url: string
  token: string
}

export interface VibeKanbanConfig {
  url: string
}

export interface CommitInfo {
  hash: string
  message: string
}

export interface UnpushedBranch {
  branch: string
  commits: CommitInfo[]
}

export interface RepoStatus {
  is_clean: boolean
  has_unpushed_commits: boolean
  has_conflicts: boolean
  uncommitted_files: string[]
  unpushed_commits: UnpushedBranch[]
  unmerged_local_branches: string[]
}
