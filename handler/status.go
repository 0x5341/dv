package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/object"
	"github.com/go-git/go-git/v5/plumbing/storer"
)

type CommitInfo struct {
	Hash    string `json:"hash"`
	Message string `json:"message"`
}

type UnpushedBranch struct {
	Branch  string       `json:"branch"`
	Commits []CommitInfo `json:"commits"`
}

type RepoStatus struct {
	IsClean               bool             `json:"is_clean"`
	HasUnpushedCommits    bool             `json:"has_unpushed_commits"`
	HasConflicts          bool             `json:"has_conflicts"`
	UncommittedFiles      []string         `json:"uncommitted_files"`
	UnpushedCommits       []UnpushedBranch `json:"unpushed_commits"`
	UnmergedLocalBranches []string         `json:"unmerged_local_branches"`
}

func RepoStatusHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	path := r.URL.Query().Get("path")
	if path == "" {
		http.Error(w, "path is required", http.StatusBadRequest)
		return
	}

	status, err := getRepoStatus(path)
	if err != nil {
		// If it's not a git repo or path invalid, might return error or specific json
		// For now, internal server error or simple error message
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(status)
}

func getRepoStatus(path string) (*RepoStatus, error) {
	r, err := git.PlainOpen(path)
	if err != nil {
		return nil, err
	}

	status := &RepoStatus{
		UncommittedFiles:      make([]string, 0),
		UnpushedCommits:       make([]UnpushedBranch, 0),
		UnmergedLocalBranches: make([]string, 0),
	}

	// 1. Uncommitted Changes & Conflicts
	w, err := r.Worktree()
	if err != nil {
		return nil, err
	}

	s, err := w.Status()
	if err != nil {
		return nil, err
	}

	status.IsClean = s.IsClean()

	for path, fileStatus := range s {
		if fileStatus.Staging == git.Unmodified && fileStatus.Worktree == git.Unmodified {
			continue
		}
		status.UncommittedFiles = append(status.UncommittedFiles, path)

		// Check for conflicts
		if fileStatus.Staging == git.UpdatedButUnmerged {
			status.HasConflicts = true
		}
	}

	// 2. Unpushed Commits & 3. Unmerged Local Branches
	branches, err := r.Branches()
	if err != nil {
		return nil, err
	}

	// Identify default branch (naive approach: check for main or master)
	var defaultBranchHash *plumbing.Hash

	// Try to resolve main or master
	if ref, err := r.Reference("refs/heads/main", true); err == nil {
		h := ref.Hash()
		defaultBranchHash = &h
	} else if ref, err := r.Reference("refs/heads/master", true); err == nil {
		h := ref.Hash()
		defaultBranchHash = &h
	}

	err = branches.ForEach(func(ref *plumbing.Reference) error {
		branchName := ref.Name().Short()
		localHash := ref.Hash()

		// --- Check Unpushed Commits ---
		// Get config for this branch to find upstream
		cfg, err := r.Config()
		if err == nil {
			branchConfig := cfg.Branches[branchName]
			if branchConfig != nil {
				// Has upstream
				remoteName := branchConfig.Remote
				mergeRef := branchConfig.Merge

				shortMerge := mergeRef.Short()
				remoteRefName := plumbing.ReferenceName("refs/remotes/" + remoteName + "/" + shortMerge)

				remoteRef, err := r.Reference(remoteRefName, true)
				if err == nil {
					remoteHash := remoteRef.Hash()
					commits, err := getCommitsAhead(r, localHash, remoteHash)
					if err == nil && len(commits) > 0 {
						status.UnpushedCommits = append(status.UnpushedCommits, UnpushedBranch{
							Branch:  branchName,
							Commits: commits,
						})
					}
				} else {
					commits, err := getCommitsAhead(r, localHash, plumbing.ZeroHash)
					if err == nil && len(commits) > 0 {
						status.UnpushedCommits = append(status.UnpushedCommits, UnpushedBranch{
							Branch:  branchName,
							Commits: commits,
						})
					}
				}
			} else {
				// No upstream configured.
				commits, err := getCommitsAhead(r, localHash, plumbing.ZeroHash)
				if err == nil && len(commits) > 0 {
					status.UnpushedCommits = append(status.UnpushedCommits, UnpushedBranch{
						Branch:  branchName,
						Commits: commits,
					})
				}
			}
		}

		// --- Check Unmerged Local Branches ---
		// Skip if this IS the default branch
		if defaultBranchHash != nil && localHash != *defaultBranchHash {
			// Check if localHash is reachable from defaultBranchHash
			isMerged, err := isAncestor(r, localHash, *defaultBranchHash)
			if err == nil && !isMerged {
				status.UnmergedLocalBranches = append(status.UnmergedLocalBranches, branchName)
			}
		}

		return nil
	})

	if len(status.UnpushedCommits) > 0 {
		status.HasUnpushedCommits = true
	}

	return status, nil
}

// getCommitsAhead returns commits that are reachable from 'from' but not from 'exclude'
func getCommitsAhead(r *git.Repository, from, exclude plumbing.Hash) ([]CommitInfo, error) {
	var commits []CommitInfo

	cIter, err := r.Log(&git.LogOptions{From: from})
	if err != nil {
		return nil, err
	}

	err = cIter.ForEach(func(c *object.Commit) error {
		if c.Hash == exclude {
			return storer.ErrStop // Stop iteration
		}

		if exclude != plumbing.ZeroHash {
			isMerged, err := isAncestor(r, c.Hash, exclude)
			if err == nil && isMerged {
				return storer.ErrStop
			}
		}

		commits = append(commits, CommitInfo{
			Hash:    c.Hash.String(),
			Message: strings.Split(c.Message, "\n")[0], // First line
		})

		// Safety break to avoid huge payload
		if len(commits) >= 20 {
			return storer.ErrStop
		}

		return nil
	})

	return commits, nil
}

func isAncestor(r *git.Repository, ancestor, descendant plumbing.Hash) (bool, error) {
	if ancestor == descendant {
		return true, nil
	}

	aCommit, err := r.CommitObject(ancestor)
	if err != nil {
		return false, err
	}
	dCommit, err := r.CommitObject(descendant)
	if err != nil {
		return false, err
	}

	return aCommit.IsAncestor(dCommit)
}
