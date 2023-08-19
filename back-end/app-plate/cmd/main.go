package main

import (
	"fmt"
	"net/http"
	"os"

	"app-plate/data"
	"app-plate/handler"

	_ "app-plate/data"
	_ "app-plate/lib"
)

func setHandle() {
	http.HandleFunc("/test", handler.TestHandler)
	http.HandleFunc("/print", handler.TestHandlerPrint)
	http.HandleFunc("/api/login", handler.LoginHandler)
	http.HandleFunc("/api/logout", handler.LogoutHandler)
	http.HandleFunc("/api/memo", handler.MemoHandler)
	http.HandleFunc("/api/memoserach", handler.MemoSearchHanlder)
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
	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir(dir+"/img/"))))

	fmt.Println("Start Listen " + serverURL)
	setHandle()
	server.ListenAndServe()
}
