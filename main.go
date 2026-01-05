package main

import (
	"embed"
	"encoding/json"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"
)

//go:embed ui/dist
var rootfs embed.FS

type Repo struct {
	Name     string `json:"name"`
	FullPath string `json:"fullPath"`
}

type CodeConfig struct {
	Url   string `json:"url"`
	Token string `json:"token"`
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

func apiReposHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	repos, err := getRepos()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(repos)
}

func apiCodeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	config := CodeConfig{
		Url:   os.Getenv("DV_CODE_SERVER_URL"),
		Token: os.Getenv("DV_CODE_SERVER_TOKEN"),
	}

	json.NewEncoder(w).Encode(config)
}

func apiVibeKanbanHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	url := os.Getenv("DV_VIBE_KANBAN_URL")
	if url == "" {
		url = "http://localhost:4000"
	}

	json.NewEncoder(w).Encode(map[string]string{"url": url})
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

func main() {
	http.HandleFunc("/api/repos", apiReposHandler)
	http.HandleFunc("/api/code", apiCodeHandler)
	http.HandleFunc("/api/vibe-kanban", apiVibeKanbanHandler)

	f, err := fs.Sub(rootfs, "ui/dist")
	if err != nil {
		log.Fatal(err)
	}
	http.Handle("/", http.FileServer(http.FS(f)))

	port := os.Getenv("DV_SERVER_PORT")
	if port == "" {
		port = "3000"
	}

	host := os.Getenv("DV_SERVER_HOST")
	if host == "" {
		host = "localhost"
	}

	log.Printf("Server started on http://%s:%s", host, port)
	err = http.ListenAndServe(host+":"+port, loggingMiddleware(http.DefaultServeMux))
	log.Fatal(err)
}
