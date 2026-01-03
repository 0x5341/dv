package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
)

//go:embed ui/dist
var rootfs embed.FS

func main() {
	f, err := fs.Sub(rootfs, "ui/dist")
	if err != nil {
		log.Fatal(err)
	}
	http.Handle("/", http.FileServer(http.FS(f)))
	err = http.ListenAndServe(":3000", nil)
	log.Fatal(err)
}
