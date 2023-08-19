package data

import (
	"database/sql"
	"fmt"
	"time"
)

//-------Memoテーブルのテーブル名+各カラム名----->

// <-------Memoオブジェクト-----
type Memo struct {
	Id        int `json:"id"`
	Title     string
	UserId    string
	Content   string
	CreatedAt time.Time
	PicPath   string
}

// Memoのデータベースへ作成
func (memo *Memo) CreateMemo(tags []Tag) (int, error) {
	fmt.Println("CreateMmemo: tags", tags)
	result, err := db.Exec(
		"INSERT INTO memo (title, userid, content, createdAt, picPath) VALUES (?, ?, ?, ?, ?)",
		memo.Title, memo.UserId, memo.Content, memo.CreatedAt, memo.PicPath,
	)
	if err != nil {
		return 0, fmt.Errorf("createMemo: %v", err)
	}
	created_id, err := result.LastInsertId()
	memo.Id = int(created_id)
	if err != nil {
		return 0, fmt.Errorf("createMemo: %v", err)
	}

	for _, tag := range tags {
		tag_id, err := tag.CreateTag()
		if err != nil {
			return 0, fmt.Errorf("createTag: %v", err)
		}
		_, _ = CreateTagMap(tag_id, memo.Id)

	}
	return memo.Id, nil
}

// Memoのidによる取得関数
func MemoByID(id int) (Memo, error) {
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
func MemoByUser(user_id string) ([]Memo, error) {
	var memos []Memo

	rows, err := db.Query("SELECT * FROM memo WHERE userId = ?", user_id)
	if err != nil {
		return nil, fmt.Errorf("memosByUser %q: %v", user_id, err)
	}
	defer rows.Close()
	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var memo Memo
		if err := rows.Scan(&memo.Id, &memo.Title, &memo.UserId, &memo.Content, &memo.CreatedAt, &memo.PicPath); err != nil {
			return nil, fmt.Errorf("memosByUser %q: %v", user_id, err)
		}
		memos = append(memos, memo)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("memosByUser %q: %v", user_id, err)
	}
	return memos, nil
}

// MemoのTagNameによる取得関数
func MemoByTag(tag_name string, user_id string) ([]Memo, error) {
	var memos []Memo
	rows, err := db.Query("SELECT memo.id, memo.title, memo.userId, memo.content, memo.createdAt, memo.picPath FROM memo INNER JOIN tag_map ON memo.id = tag_map.memoId INNER JOIN tag ON tag_map.tagId = tag.id WHERE tagName=? and memo.userId=?", tag_name, user_id)
	if err != nil {
		return nil, fmt.Errorf("memosByTag %s: %v", tag_name, err)
	}
	defer rows.Close()

	for rows.Next() {
		var memo Memo
		if err := rows.Scan(&memo.Id, &memo.Title, &memo.UserId, &memo.Content, &memo.CreatedAt, &memo.PicPath); err != nil {
			return nil, fmt.Errorf("memosByTag %s: %v", tag_name, err)
		}
		memos = append(memos, memo)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("memosByTag %s: %v", tag_name, err)
	}
	return memos, nil
}

func MemoByTagAND(tag_names []string, user_id string) ([]Memo, error) {
	var memos []Memo
	and_tags := "('" + tag_names[0] + "'"
	for i := 1; i < len(tag_names); i++ {
		and_tags += (", '" + tag_names[i] + "'")
	}
	and_tags += ")"
	rows, err := db.Query("SELECT m.* FROM tag_map mt, memo m, tag t WHERE mt.tagId = t.id AND (t.tagName IN "+and_tags+") AND m.id = mt.memoId GROUP BY m.id HAVING COUNT( m.id )=?", len(tag_names))
	fmt.Println("SELECT m.* FROM tag_map mt, memo m, tag t WHERE mt.tagId = t.id AND (t.tagName IN " + and_tags + ") AND m.id = mt.memoId GROUP BY m.id HAVING COUNT( m.id )=?")
	if err != nil {
		return nil, fmt.Errorf("memosByTagAND %s: %v", tag_names, err)
	}
	defer rows.Close()

	for rows.Next() {
		var memo Memo
		if err := rows.Scan(&memo.Id, &memo.Title, &memo.UserId, &memo.Content, &memo.CreatedAt, &memo.PicPath); err != nil {
			return nil, fmt.Errorf("memosByTag %s: %v", tag_names, err)
		}
		memos = append(memos, memo)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("memosByTag %s: %v", tag_names, err)
	}
	return memos, nil
}

func (memo *Memo) CreateMemoTag(tag Tag) error {
	tag_id, err := tag.CreateTag()
	if err != nil {
		return fmt.Errorf("createTag: %v", err)
	}
	tag.Id = int(tag_id)
	_, _ = CreateTagMap(tag.Id, memo.Id)

	return nil
}

func (memo *Memo) DeleteMemoTag(tag Tag) error {
	tag.MemoNum--
	err := tag.UpdateTag()
	if err != nil {
		return fmt.Errorf("DeleteMemoTag: %v", err)
	}
	_, err = mydb.Exec(
		"DELETE FROM tag_map WHERE tagId=? and memoId=?", tag.Id, memo.Id,
	)
	if err != nil {
		return fmt.Errorf("deleteMemoTag: %v", err)
	}
	return nil
}

// Memoの更新関数
func (memo *Memo) UpdateMemo() error {
	_, err := mydb.Exec(
		"UPDATE memo SET title=?, userId=?, content=?, createdAt=?, picPath=? WHERE id = ?", memo.Title, memo.UserId, memo.Content, memo.CreatedAt, memo.PicPath, memo.Id,
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

// --------Memoオブジェクト----->
func init() {
	db = GetMydb()
}
