package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/0x5341/dv/handler"
)

//go:embed ui/dist
var rootfs embed.FS

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

func main() {
	http.HandleFunc("/api/repos", handler.ReposHandler)
	http.HandleFunc("/api/get", handler.GetHandler)
	http.HandleFunc("/api/create", handler.CreateHandler)
	http.HandleFunc("/api/rm", handler.RmHandler)
	http.HandleFunc("/api/repo/status", handler.RepoStatusHandler)
	http.HandleFunc("/api/code", handler.CodeHandler)
	http.HandleFunc("/api/open-link-button", handler.OpenLinkButtonHandler)

	f, err := fs.Sub(rootfs, "ui/dist")
	if err != nil {
		log.Fatal(err)
	}
	http.Handle("/", http.FileServer(http.FS(f)))

	port := os.Getenv("DV_SERVER_PORT")
	if port == "" {
		port = "3000"
	}

	// Backwards compatible note: /api/vibe-kanban removed in favor of /api/open-link-button

	host := os.Getenv("DV_SERVER_HOST")
	if host == "" {
		host = "localhost"
	}

	log.Printf("Server started on http://%s:%s", host, port)
	err = http.ListenAndServe(host+":"+port, loggingMiddleware(http.DefaultServeMux))
	log.Fatal(err)
}
