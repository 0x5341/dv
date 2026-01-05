package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"os/exec"
	"strings"
)

type Repo struct {
	Name     string `json:"name"`
	FullPath string `json:"fullPath"`
}

func ghqCommand(args ...string) *exec.Cmd {
	ghqPath := os.Getenv("DV_GHQ_PATH")
	if ghqPath == "" {
		ghqPath = "ghq"
	}
	cmd := exec.Command(ghqPath, args...)
	if root := os.Getenv("DV_GHQ_ROOT"); root != "" {
		cmd.Env = append(os.Environ(), "GHQ_ROOT="+root)
	}
	return cmd
}

func getRepos() ([]Repo, error) {
	cmdName := ghqCommand("list")
	outName, err := cmdName.Output()
	if err != nil {
		return nil, err
	}
	names := strings.Split(strings.TrimSpace(string(outName)), "\n")

	cmdPath := ghqCommand("list", "--full-path")
	outPath, err := cmdPath.Output()
	if err != nil {
		return nil, err
	}
	paths := strings.Split(strings.TrimSpace(string(outPath)), "\n")

	var repos []Repo
	count := len(names)
	if len(paths) < count {
		count = len(paths)
	}

	for i := 0; i < count; i++ {
		if names[i] == "" {
			continue
		}
		repos = append(repos, Repo{
			Name:     names[i],
			FullPath: paths[i],
		})
	}
	return repos, nil
}

func ReposHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	repos, err := getRepos()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(repos)
}
