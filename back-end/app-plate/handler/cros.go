package handler

import (
	"fmt"
	"net/http"
	"strings"
)

func SetCrosOptions(w http.ResponseWriter, r *http.Request) {

	// const allowedURL := ["http://localhost:3000"]
	allowedURL := [2]string{"http://localhost:3000", "http://localhost:9000"}

	//リクエスト元のURL
	referer := r.Header.Get("Referer")
	fmt.Println("URL := ", referer)

	for _, value := range allowedURL {
		if strings.Contains(referer, value) {
			w.Header().Set("Access-Control-Allow-Origin", value)
		}
	}
}
