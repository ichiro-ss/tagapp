package handler

import (
	"app-plate/data"
	"app-plate/lib"
	"encoding/json"
	"net/http"
)

type apiParams struct {
	userName string
	password string
}

type apiMessage struct {
	Message string `json:"errorMessage"`
}

func setMessage(w http.ResponseWriter, message string) {
	apims := apiMessage{Message: message}
	w.Header().Set("Content-Type", ContentJsonStr)

	encoder := json.NewEncoder(w)
	encoder.Encode(apims)
	return
}

func parseRequestParams(w http.ResponseWriter, r *http.Request) (params apiParams, isCorrect bool) {
	params = apiParams{}
	isCorrect = true

	r.ParseForm()
	_, userNmmeExists := r.Form["username"]
	_, pwExists := r.Form["password"]

	if !userNmmeExists || !pwExists {
		w.WriteHeader(http.StatusBadRequest)
		setMessage(w, "リクエストパラメータが正しくありません")
		isCorrect = false
		return
	}

	params.userName = r.Form["username"][0]
	params.password = r.Form["password"][0]

	return
}

// アカウントの作成
func loginPostHandle(w http.ResponseWriter, r *http.Request) {
	var err error

	params, isCollectParams := parseRequestParams(w, r)
	if !isCollectParams {
		return
	}

	hash, err := lib.PasswordEncrypt(params.password)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		setMessage(w, "パスワードのハッシュ化に失敗しました")
		return
	}

	user := data.User{Id: params.userName, Hashpass: hash}

	err = user.Create()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		setMessage(w, "ユーザ登録に失敗しました")
		return
	}

	w.WriteHeader(http.StatusOK)
}

// アカウントのログイン
func loginGetHandle(w http.ResponseWriter, r *http.Request) {

	var err error
	params, isCollectParams := parseRequestParams(w, r)
	if !isCollectParams {
		return
	}

	user, err := data.GetUser(params.userName)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		setMessage(w, "ユーザーが存在しません")
		return
	}

	isCorrectPass := lib.CompareHashAndPassword(user.Hashpass, params.password)

	if !isCorrectPass {
		w.WriteHeader(http.StatusBadRequest)
		setMessage(w, "Passwordが正しくありません")
		return
	}

	encoder := json.NewEncoder(w)
	err = encoder.Encode(user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		setMessage(w, "Jsonへの変換ができませんでした")
		return
	}

	w.Header().Set("Content-Type", ContentJsonStr)
	w.WriteHeader(http.StatusOK)

	gsession := lib.GetGlobalSessions()
	sess := gsession.SessionStart(w, r)
	lib.SetSessionUser(&sess, &user)

	return
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if SetCrosOptions(w, r) {
		return
	}

	switch r.Method {
	case http.MethodGet:
		loginGetHandle(w, r)
	case http.MethodPost:
		loginPostHandle(w, r)
	default:
		loginGetHandle(w, r)
	}
}
