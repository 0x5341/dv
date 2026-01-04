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

func getRepos() ([]Repo, error) {
	cmdName := exec.Command("ghq", "list")
	outName, err := cmdName.Output()
	if err != nil {
		return nil, err
	}
	names := strings.Split(strings.TrimSpace(string(outName)), "\n")

	cmdPath := exec.Command("ghq", "list", "--full-path")
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
		Url:   os.Getenv("CODE_SERVER_URL"),
		Token: os.Getenv("CODE_SERVER_TOKEN"),
	}

	json.NewEncoder(w).Encode(config)
}

func apiVibeKanbanHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	port := os.Getenv("VIBE_KANBAN_PORT")
	if port == "" {
		port = "3001"
	}

	url := "http://localhost:" + port
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

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server started on http://localhost:%s", port)
	err = http.ListenAndServe(":"+port, loggingMiddleware(http.DefaultServeMux))
	log.Fatal(err)
}

