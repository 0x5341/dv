package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"

	"github.com/BurntSushi/toml"
)

type OpenLink struct {
	Name string `toml:"name" json:"name"`
	Url  string `toml:"url" json:"url"`
}

type openLinkConfig struct {
	OpenLinks []OpenLink `toml:"open_links"`
}

func loadOpenLinks() ([]OpenLink, error) {
	var cfg openLinkConfig

	xdg := os.Getenv("XDG_CONFIG_HOME")
	if xdg == "" {
		home := os.Getenv("HOME")
		if home == "" {
			return nil, nil
		}
		xdg = filepath.Join(home, ".config")
	}

	path := filepath.Join(xdg, "dv", "config.toml")
	if _, err := os.Stat(path); err == nil {
		if _, err := toml.DecodeFile(path, &cfg); err != nil {
			return nil, err
		}
	}

	if v := os.Getenv("DV_VIBE_KANBAN_URL"); v != "" {
		vibe := OpenLink{Name: "VIBE-KANBAN", Url: v}
		// Prepend to preserve visibility
		cfg.OpenLinks = append([]OpenLink{vibe}, cfg.OpenLinks...)
	}

	return cfg.OpenLinks, nil
}

func OpenLinkButtonHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	links, err := loadOpenLinks()
	if err != nil {
		json.NewEncoder(w).Encode([]OpenLink{})
		return
	}

	json.NewEncoder(w).Encode(links)
}
