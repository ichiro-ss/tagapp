package main

import (
	"fmt"
	"net/http"

	"app-plate/data"
	"app-plate/handler"

	_ "app-plate/data"
)

func setHandle() {
	http.HandleFunc("/test", handler.TestHandler)
	http.HandleFunc("/print", handler.TestHandlerPrint)
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
