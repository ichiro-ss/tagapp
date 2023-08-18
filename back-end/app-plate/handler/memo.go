package handler

import (
	"app-plate/data"
	"app-plate/lib"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
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

func makeUserTagArray(tagNames []string, userName string) []data.Tag {
	tagDatas := []data.Tag{}

	for _, tagName := range tagNames {
		trimName := strings.TrimSpace(tagName)
		tagData := data.Tag{
			UserId:  userName,
			TagName: trimName,
		}
		tagDatas = append(tagDatas, tagData)
	}

	return tagDatas
}

type apiMemoParams struct {
	userName    string
	memoTitle   string
	memoContent string
	memoId      int
	tags        []string
	date        *time.Time
	thumbnail   *lib.GoImg
}

func (params *apiMemoParams) print() {
	fmt.Println("userName:", params.userName)
	fmt.Println("memoTitle:", params.memoTitle)
	fmt.Println("memoContent:", params.memoContent)
	fmt.Println("memoId:", params.memoId)
	fmt.Println("tagsId:", params.tags)
	if params.date != nil {
		fmt.Println("date:", *params.date)
	}
	if params.thumbnail != nil {
		fmt.Println("thumbnail:", *params.thumbnail)
	}
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
	var tags []string
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
		trimtag := strings.TrimSpace(value)
		tags = append(tags, trimtag)
	}

	// for _, value := range tagsIdStr {
	// 	ivalue, err := strconv.Atoi(value)
	// 	if err != nil {
	// 		w.WriteHeader(http.StatusBadRequest)
	// 		w.Write([]byte("`tags`に不正な値が存在します"))
	// 		isCollectParams = false
	// 		return
	// 	}
	// 	tagsId = append(tagsId, ivalue)
	// }

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
	params.tags = tags
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
	userName := params.userName
	memoTitle := params.memoTitle
	memoContent := params.memoContent
	tags := params.tags
	date := params.date
	thumbnail := params.thumbnail

	gbsession := lib.GetGlobalSessions()
	sess := gbsession.SessionStart(w, r)
	sessUser := lib.GetSessionUser(&sess)
	var imgpath string
	//-------variable region-------->

	if sessUser == nil || sessUser.Id != params.userName {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("不正なPostリクエストです"))
		return
	}

	err = makeUserImageFolda(params.userName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Imageフォルダの作成を作成できませんでした"))
		return
	}

	if thumbnail != nil {
		dir := makeUserImageFokdaPath(params.userName)
		fname := makePostImageFname()
		imgpath, err = thumbnail.Save(dir, fname)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Imageを保存できませんでした"))
			return
		}
	} else {
		imgpath = PIC_PATH_UNDFINED_VALUE
	}

	//<--------投稿のデータベースクリエイト領域----------
	memoData := data.Memo{
		Title:     memoTitle,
		UserId:    userName,
		Content:   memoContent,
		CreatedAt: *date,
		PicPath:   imgpath,
	}

	tagDatas := makeUserTagArray(tags, userName)

	memoId, err := memoData.CreateMemo(tagDatas)
	memoData.Id = memoId

	if err != nil {
		lib.RemoveFile(imgpath)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Memoデータを保存できませんでした"))
		return
	}
	//---------投稿のデータベースクリエイト領域--------->

	w.WriteHeader(http.StatusOK)
}

// memoの更新API
// memoデータベースクラスができてから
func memoPutHandle(w http.ResponseWriter, r *http.Request) {
	// var err error
	params, isCollectParams := parseMemoRequestParams(w, r)
	if !isCollectParams {
		return
	}

	//<------variable region---------
	memoTitle := params.memoTitle
	memoContent := params.memoContent
	// tagsId := params.tagsId
	thumbnail := params.thumbnail
	memoId := params.memoId

	gbsession := lib.GetGlobalSessions()
	sess := gbsession.SessionStart(w, r)
	sessUser := lib.GetSessionUser(&sess)
	//-------variable region-------->

	//<--------投稿のデータベース取得領域---------------
	memoData, err := data.MemoByID(memoId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Memoデータが存在しません"))
		return
	}

	if sessUser == nil || sessUser.Id != memoData.UserId {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("不正なPUTリクエストです"))
		return
	}

	//---------投稿のデータベース取得領域-------------->

	//<--------投稿のデータベースアップデート領域----------
	memoData.Title = memoTitle
	memoData.Content = memoContent

	if thumbnail != nil {
		if memoData.PicPath == PIC_PATH_UNDFINED_VALUE {
			dir := makeUserImageFokdaPath(params.userName)
			fname := makePostImageFname()
			imgpath, err := thumbnail.Save(dir, fname)

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("不正なPUTリクエストです"))
				return
			}

			memoData.PicPath = imgpath
		} else {
			imgpath := memoData.PicPath
			err = lib.RemoveFile(imgpath)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("サムネイル画像の削除に失敗しました"))
				return
			}

			dir, fname := filepath.Split(imgpath)
			fname = lib.RemoveExtension(fname)

			imgpath, err = thumbnail.Save(dir, fname)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("サムネイル画像の保存に失敗しました"))
				return
			}
			memoData.PicPath = imgpath
		}
	}

	err = memoData.UpdateMemo()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Memoデータの更新に失敗しました"))
		return
	}

	//---------投稿のデータベースアップデート領域--------->

	//<--------タグのデータベースアップデート領域----------

	//---------タグのデータベースアップデート領域--------->

	w.WriteHeader(http.StatusOK)
	return
}

// 未完成
func memoDeleteHandle(w http.ResponseWriter, r *http.Request) {
	var err error
	params, isCollectParams := parseMemoRequestParams(w, r)
	if !isCollectParams {
		return
	}

	// <------variable region---------
	memoId := params.memoId

	gbsession := lib.GetGlobalSessions()
	sess := gbsession.SessionStart(w, r)
	sessUser := lib.GetSessionUser(&sess)
	// -------variable region-------->

	//<--------投稿のデータベース取得&削除領域---------------
	memoData, err := data.MemoByID(memoId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("該当のメモは存在しません"))
		return
	}

	if sessUser == nil || sessUser.Id != memoData.UserId {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("不正なDELETEリクエストです"))
		return
	}

	if memoData.PicPath != PIC_PATH_UNDFINED_VALUE {
		err = lib.RemoveFile(memoData.PicPath)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("サムネイル画像の削除に失敗しました"))
			return
		}
	}

	err = memoData.DeleteMemo()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Memoデータの削除に失敗しました"))
		return
	}
	//---------投稿のデータベース取得&削除領域-------------->

	w.WriteHeader(http.StatusOK)
	return
}

func memoGetHandle(w http.ResponseWriter, r *http.Request) {
	type memoJsonStruct struct {
		Memo data.Memo `json:"memo"`
		Tags []string  `json:"tags"`
	}

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
	memoData, err := data.MemoByID(memoid)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("該当のメモは存在しません"))
		return
	}
	//---------投稿のデータベース取得領域-------------->

	//<--------タグのデータベース取得領域---------------
	tagNames, err := data.TagNameByMemo(memoData.Id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("タグを取得することができませんでした"))
		return
	}
	fmt.Println("tagName=", tagNames)

	//--------タグのデータベース取得領域--------------->

	memoJson := memoJsonStruct{
		Memo: memoData,
		Tags: tagNames,
	}

	err = setJsonData(w, r, memoJson)
	if err != nil {
		return
	}

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
	case http.MethodDelete:
		memoDeleteHandle(w, r)
	case http.MethodPut:
		memoPutHandle(w, r)
	default:
		memoGetHandle(w, r)
	}
}
