package main

import (
	"fmt"
	"net/http"

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
}

func main() {

	db := data.GetMydb()
	defer db.Close()

	serverURL := "0.0.0.0:5000"
	server := http.Server{
		Addr: serverURL,
	}

	fmt.Println("Start Listen " + serverURL)
	setHandle()
	server.ListenAndServe()

}
