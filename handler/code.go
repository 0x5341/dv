package handler

import (
	"encoding/json"
	"net/http"
	"os"
)

type CodeConfig struct {
	Url   string `json:"url"`
	Token string `json:"token"`
}

func CodeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	config := CodeConfig{
		Url:   os.Getenv("DV_CODE_SERVER_URL"),
		Token: os.Getenv("DV_CODE_SERVER_TOKEN"),
	}

	json.NewEncoder(w).Encode(config)
}
