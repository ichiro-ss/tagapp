package handler

import (
	"fmt"
	"net/http"
	"strings"
)

func SetCrosOptions(w http.ResponseWriter, r *http.Request) (isOptions bool) {

	isOptions = r.Method == http.MethodOptions
	// const allowedURL := ["http://localhost:3000"]
	allowedURL := [2]string{"http://localhost:3000", "http://localhost:9000"}

	//リクエスト元のURL
	referer := r.Header.Get("Referer")
	fmt.Println("URL := ", referer)
	fmt.Println(r.Method)

	for _, value := range allowedURL {
		if strings.Contains(referer, value) {
			w.Header().Set("Access-Control-Allow-Origin", value)
		}
	}
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
	w.Header().Set("Content-Type", "application/json")

	return
}
