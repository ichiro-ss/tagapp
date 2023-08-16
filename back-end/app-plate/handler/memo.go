package handler

import (
	"app-plate/lib"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/google/uuid"
)

// imageの保存ディレクトリのパスの生成
func makeUserImageFokdaPath(userId string) string {
	return "./img/users/" + userId
}

// imageの保存ファイル名の生成
func makePostImageFname() string {
	uuid := uuid.New()
	return uuid.String()
}

// imageを保存するフォルダの生成
func makeUserImageFolda(userId string) error {
	path := makeUserImageFokdaPath(userId)
	err := os.MkdirAll(path, os.ModePerm)

	if err != nil {
		return err
	}

	return nil
}

type apiMemoParams struct {
	userName    string
	memoTitle   string
	memoContent string
	memoId      int
	tagsId      []int
	date        *time.Time
	thumbnail   *lib.GoImg
}

func (params *apiMemoParams) print() {
	fmt.Println("userName:", params.userName)
	fmt.Println("memoTitle:", params.memoTitle)
	fmt.Println("memoContent:", params.memoContent)
	fmt.Println("memoId:", params.memoId)
	fmt.Println("tagsId:", params.tagsId)
	fmt.Println("date:", *params.date)
	fmt.Println("thumbnail:", *params.thumbnail)
}

// apiのリクエストのパラメータの解析
// Getメソッドのみ当関数を利用せず、パースをしているため注意
func parseMemoRequestParams(w http.ResponseWriter, r *http.Request) (params apiMemoParams, isCollectParams bool) {
	parseSize := 10 << 20
	params = apiMemoParams{}
	isCollectParams = true

	r.ParseMultipartForm(int64(parseSize))

	test := r.FormValue("test")
	userName := r.FormValue("username")
	memoTitle := r.FormValue("memotitle")
	memoContent := r.FormValue("memocontent")
	tagsIdStr := r.Form["tags"]
	thumbnailFile, _, err := r.FormFile("thumbnail")
	memoIdStr := r.FormValue("memoid")
	timeIso := r.FormValue("dateiso")

	var thumbnail *lib.GoImg
	var tagsId []int
	var memoId int
	var datep *time.Time
	thumbnail = nil
	datep = nil

	if err == nil {
		goimage, err := lib.LoadImageFromFile(&thumbnailFile)
		if err == nil {
			thumbnail = &goimage
		}
	}

	for _, value := range tagsIdStr {
		ivalue, err := strconv.Atoi(value)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("`tags`に不正な値が存在します"))
			isCollectParams = false
			return
		}
		tagsId = append(tagsId, ivalue)
	}

	memoId = -1
	memoId, err = strconv.Atoi(memoIdStr)
	if memoIdStr != "" && err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("`memoid`に不正な値が存在します"))
		isCollectParams = false
		return
	}

	date, err := time.Parse(time.RFC3339, timeIso)
	if timeIso != "" && err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("`timeIso`に不正な値が存在します"))
		isCollectParams = false
	}
	datep = &date
	if timeIso == "" {
		datep = nil
	}

	params.userName = userName
	params.memoTitle = memoTitle
	params.memoContent = memoContent
	params.thumbnail = thumbnail
	params.tagsId = tagsId
	params.memoId = memoId
	params.date = datep

	params.print()
	fmt.Println("test:", test)
	return
}

// Memoの新規作成API
func memoPostHandle(w http.ResponseWriter, r *http.Request) {
	var err error
	params, isCollectParams := parseMemoRequestParams(w, r)
	if !isCollectParams {
		return
	}

	//<------variable region---------
	// userName := params.userName
	// memoTitle := params.memoTitle
	// memoContent := params.memoContent
	// tagsId := params.tagsId
	// date := params.date
	thumbnail := params.thumbnail
	//-------variable region-------->

	gbsession := lib.GetGlobalSessions()
	sess := gbsession.SessionStart(w, r)
	sessUser := lib.GetSessionUser(&sess)

	if sessUser == nil || sessUser.Id != params.userName {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("不正なPostリクエストです"))
		fmt.Println("prams:userName:", params.userName)
		fmt.Println("sessUser.Id:", sessUser.Id)
		return
	}

	err = makeUserImageFolda(params.userName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Imageフォルダの作成を作成できませんでした"))
		return
	}

	dir := makeUserImageFokdaPath(params.userName)
	fname := makePostImageFname()

	fmt.Println("dir : ", dir)
	fmt.Println("fname : ", fname)

	err = thumbnail.Save(dir, fname)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Imageを保存できませんでした"))
		return
	}

	//<--------投稿のデータベースクリエイト領域----------

	//---------投稿のデータベースクリエイト領域--------->

	w.WriteHeader(http.StatusOK)
}

// memoデータベースクラスができてから
func memoPutHandle(w http.ResponseWriter, r *http.Request) {
	// var err error
	params, isCollectParams := parseMemoRequestParams(w, r)
	if !isCollectParams {
		return
	}

	//<------variable region---------
	// userName := params.userName
	// memoTitle := params.memoTitle
	// memoContent := params.memoContent
	// tagsId := params.tagsId
	// date := params.date
	// thumbnail := params.thumbnail
	//-------variable region-------->

	gbsession := lib.GetGlobalSessions()
	sess := gbsession.SessionStart(w, r)
	sessUser := lib.GetSessionUser(&sess)

	//<--------投稿のデータベース取得領域---------------

	//---------投稿のデータベース取得領域-------------->

	//<--------投稿のデータベースアップデート領域----------

	//---------投稿のデータベースアップデート領域--------->

	if sessUser == nil || sessUser.Id != params.userName {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("不正なPostリクエストです"))
		return
	}

}

// 未完成
func memoDeleteHandle(w http.ResponseWriter, r *http.Request) {
	// var err error
	r.ParseForm()

	//<------variable region---------
	// userName := params.userName
	// memoId := params.memoI
	//-------variable region-------->

	//<--------投稿のデータベース取得領域---------------

	//---------投稿のデータベース取得領域-------------->

}

func memoGetHandle(w http.ResponseWriter, r *http.Request) {
	var err error
	r.ParseForm()

	memoIdStr := r.FormValue("memoid")
	memoid, err := strconv.Atoi(memoIdStr)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("`memoid'が不正な値です"))
		return
	}

	fmt.Println("/api/memo Get : memoId=", memoid)

	//<--------投稿のデータベース取得領域---------------

	//---------投稿のデータベース取得領域-------------->

	w.WriteHeader(http.StatusOK)
	return
}

func MemoHandler(w http.ResponseWriter, r *http.Request) {
	if SetCrosOptions(w, r) {
		return
	}

	switch r.Method {
	case http.MethodPost:
		memoPostHandle(w, r)
	case http.MethodGet:
		memoGetHandle(w, r)
	default:
		memoPostHandle(w, r)
	}
}
