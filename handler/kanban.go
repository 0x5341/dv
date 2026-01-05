package handler

import (
	"encoding/json"
	"net/http"
	"os"
)

func VibeKanbanHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	url := os.Getenv("DV_VIBE_KANBAN_URL")
	if url == "" {
		url = "http://localhost:4000"
	}

	json.NewEncoder(w).Encode(map[string]string{"url": url})
}
