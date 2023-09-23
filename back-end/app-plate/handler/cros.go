package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

func GetPUblicAddr() string {

	//デプロイ時に書き換える
	publicIPAddr := "localhost:8080"

	return publicIPAddr
}

func SetCrosOptions(w http.ResponseWriter, r *http.Request) (isOptions bool) {

	isOptions = r.Method == http.MethodOptions

	// allowedURL := [4]string{"http://localhost:3000", "http://localhost:9000", "http://localhost:8080", "http://" + GetPUblicAddr()}
	allowedURL := [1]string{"http://" + GetPUblicAddr()}

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
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, access-control-allow-credentials")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
	w.Header().Set("Content-Type", "application/json")

	return isOptions
}

func setJsonData(w http.ResponseWriter, r *http.Request, target interface{}) error {
	w.Header().Set("Content-Type", CONTENT_JSON_STR)

	err := json.NewEncoder(w).Encode(target)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Jsonの書き込みに失敗しました"))
		return err
	}

	return nil
}
