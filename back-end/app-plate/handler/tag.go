package handler

import (
	"app-plate/data"
	"fmt"
	"net/http"
)

func tagGetHandle(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	userName := r.FormValue("username")

	tagDatas, err := data.TagByUser(userName)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("タグデータの取得に失敗しました"))
	}

	err = setJsonData(w, r, tagDatas)
	if err != nil {
		return
	}

	return
}

func TagHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Tag Method :", r.Method)
	if SetCrosOptions(w, r) {
		return
	}

	switch r.Method {
	case http.MethodGet:
		tagGetHandle(w, r)
	default:
		tagGetHandle(w, r)
	}
}
