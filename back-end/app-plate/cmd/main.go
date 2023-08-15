package main

import (
	"app-plate/data"
	"app-plate/gotest"
	"app-plate/handler"
	"fmt"
	"net/http"

	_ "app-plate/data"
)

func setHandle() {
	http.HandleFunc("/test", handler.TestHandler)
	http.HandleFunc("/print", handler.TestHandlerPrint)
}

func main() {

	db := data.GetMydb()
	defer db.Close()

	if db == nil {
		fmt.Println("Database is nil pointer")
	}
	gotest.TestUserData()
	gotest.TestMemoData()

	serverURL := "0.0.0.0:5000"
	server := http.Server{
		Addr: serverURL,
	}

	fmt.Println("Start Listen " + serverURL)
	setHandle()
	server.ListenAndServe()
}
