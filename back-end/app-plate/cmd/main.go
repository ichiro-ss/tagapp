package main

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"app-plate/data"
	"app-plate/handler"

	_ "app-plate/data"
	_ "app-plate/lib"
)

func enableCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		allowedURL := [3]string{"http://localhost:3000", "http://localhost:9000", "http://localhost:8080"}

		//リクエスト元のURL
		referer := r.Header.Get("Referer")
		fmt.Println("URL := ", referer)
		fmt.Println(r.Method)

		for _, value := range allowedURL {
			if strings.Contains(referer, value) {
				w.Header().Set("Access-Control-Allow-Origin", value)
			}
		}
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, access-control-allow-credentials")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
		w.Header().Set("Content-Type", "application/json")

		if r.Method == "OPTIONS" {
			// OPTIONSリクエストへの返答
			w.WriteHeader(http.StatusOK)
			return
		}

		extension := filepath.Ext(r.URL.Path)

		fmt.Println("exntension:", extension)
		if extension == ".jpg" {
			fmt.Println("jpg")
			w.Header().Set("Content-Type", "image/jpeg")
		}
		if extension == ".png" {
			w.Header().Set("Content-Type", "image/png")
		}

		h.ServeHTTP(w, r)
	})
}

func setHandle() {
	// http.Handle("/")
	http.HandleFunc("/test", handler.TestHandler)
	http.HandleFunc("/print", handler.TestHandlerPrint)
	http.HandleFunc("/api/login", handler.LoginHandler)
	http.HandleFunc("/api/logout", handler.LogoutHandler)
	http.HandleFunc("/api/memo", handler.MemoHandler)
	http.HandleFunc("/api/memosearch", handler.MemoSearchHanlder)
	http.HandleFunc("/api/tags", handler.TagHandler)
}

func main() {

	db := data.GetMydb()
	defer db.Close()

	if db == nil {
		fmt.Println("Database is nil pointer")
	}

	serverURL := "0.0.0.0:5000"
	server := http.Server{
		Addr: serverURL,
	}
	dir, _ := os.Getwd()
	fmt.Println("dir = ", dir)
	// http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir(dir+"/img/"))))
	http.Handle("/img/", enableCORS(http.StripPrefix("/img/", http.FileServer(http.Dir(dir+"/img/")))))

	fmt.Println("Start Listen " + serverURL)
	setHandle()
	server.ListenAndServe()
}
