package data

import (
	"fmt"
	"time"
)

//-------Memoテーブルのテーブル名+各カラム名----->

// <-------Memoオブジェクト-----
type Memo struct {
	Id        string `json:"id"`
	Title     string
	UserId    int64
	Content   string
	CreatedAt time.Time
	PicPath   string
}

// Memoのデータベースへ作成
func (memo *Memo) CreateMemo() (int64, error) {
	//Cretae操作の実行SQL文
	result, err := mydb.Exec("INSERT INTO album (title, user_id, content, created_at, pic_path) VALUES (?, ?, ?)", memo.Title, memo.UserId, memo.Content, memo.CreatedAt, memo.PicPath)
	if err != nil {
		return 0, fmt.Errorf("createAlbum: %v", err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("createAlbum: %v", err)
	}
	return id, nil
}

// Memoのidによる取得関数

// Memoの削除関数

//--------Memoオブジェクト----->

func init() {
	db = GetMydb()
}
