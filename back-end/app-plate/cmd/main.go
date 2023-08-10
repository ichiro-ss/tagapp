package main

import (
	"app-plate/kohinigeee/data"
	"app-plate/kohinigeee/handler"
	"fmt"
	"net/http"
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
