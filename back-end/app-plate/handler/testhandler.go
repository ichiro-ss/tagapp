package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// <-----テストの用の関数達----------
type Fluit struct {
	Name    string
	English string
	Text    string
}

func TestHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	SetCrosOptions(w, r)
	post := &Fluit{
		Name:    "ぶどう",
		English: "grape",
		Text:    "一房に多くの実がなる、紫色の果物です",
	}

	json.NewEncoder(w).Encode(post)
	fmt.Println("[Log] exe TestHandler")
}

func TestHandlerPrint(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World!")
}

// -----テストの用の関数達---------->
