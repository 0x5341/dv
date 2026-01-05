package handler

import (
	"encoding/json"
	"net/http"
)

type GetRequest struct {
	Url string `json:"url"`
}

func GetHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req GetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Url == "" {
		http.Error(w, "url is required", http.StatusBadRequest)
		return
	}

	// ghq get <url>
	cmd := ghqCommand("get", req.Url)
	output, err := cmd.CombinedOutput()
	if err != nil {
		http.Error(w, string(output), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(output)
}
