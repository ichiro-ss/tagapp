package data

import (
	"database/sql"
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
	result, err := mydb.Exec(
		"INSERT INTO memo (title, user_id, content, created_at, pic_path) VALUES (?, ?, ?)",
		memo.Title, memo.UserId, memo.Content, memo.CreatedAt, memo.PicPath,
	)
	if err != nil {
		return 0, fmt.Errorf("createMemo: %v", err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("createMemo: %v", err)
	}
	return id, nil
}

// Memoのidによる取得関数
func MemoByID(id int64) (Memo, error) {
	var memo Memo

	row := db.QueryRow("SELECT * FROM memo WHERE id = ?", id)
	if err := row.Scan(&memo.Id, &memo.Title, &memo.UserId, &memo.Content, &memo.CreatedAt, &memo.PicPath); err != nil {
		if err == sql.ErrNoRows {
			return memo, fmt.Errorf("memosById %d: no such memo", id)
		}
		return memo, fmt.Errorf("memosById %d: %v", id, err)
	}
	return memo, nil
}

// MemoのUserIdによる取得関数
func MemoByUser(user_id int64) ([]Memo, error) {
	var memos []Memo

	rows, err := db.Query("SELECT * FROM memo WHERE artist = ?", user_id)
	if err != nil {
		return nil, fmt.Errorf("emosByArtist %q: %v", user_id, err)
	}
	defer rows.Close()
	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var memo Memo
		if err := rows.Scan(&memo.Id, &memo.Title, &memo.UserId, &memo.Content, &memo.CreatedAt, &memo.PicPath); err != nil {
			return nil, fmt.Errorf("memosByArtist %q: %v", user_id, err)
		}
		memos = append(memos, memo)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("memosByArtist %q: %v", user_id, err)
	}
	return memos, nil
}

// Memoの更新関数
func (memo *Memo) UpdateMemo() error {
	_, err := mydb.Exec(
		"UPDATE memo SET 'title'=?, 'user_id'=?, 'content'=?, 'created_at'=?, 'pic_path'=? WHERE id = ?", memo.Title, memo.UserId, memo.Content, memo.CreatedAt, memo.PicPath, memo.Id,
	)
	if err != nil {
		return fmt.Errorf("updateMemo: %v", err)
	}
	return nil
}

// Memoの削除関数
func (memo *Memo) DeleteMemo() error {
	_, err := mydb.Exec(
		"DELETE FROM memo WHERE id = ?", memo.Id,
	)
	if err != nil {
		return fmt.Errorf("deleteMemo: %v", err)
	}
	return nil
}

//--------Memoオブジェクト----->

func init() {
	db = GetMydb()
}
