package data

import (
	"database/sql"
	"fmt"
)

//-------Tagテーブルのテーブル名+各カラム名----->

// <-------Tagオブジェクト-----
type Tag struct {
	Id      string `json:"id"`
	TagName string
	UserId  int64
	MemoNum int64
}

// Tagのデータベースへ作成
func (tag *Tag) CreateTag() (int64, error) {
	result, err := mydb.Exec(
		"INSERT INTO tag (tag_name, user_id, memo_num) VALUES (?, ?, ?)",
		tag.TagName, tag.UserId, tag.MemoNum,
	)
	if err != nil {
		return 0, fmt.Errorf("createTag: %v", err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("createTag: %v", err)
	}
	return id, nil
}

// Tagのidによる取得関数
func TagByID(id int64) (Tag, error) {
	var tag Tag

	row := db.QueryRow("SELECT * FROM tag WHERE id = ?", id)
	if err := row.Scan(&tag.Id, &tag.TagName, &tag.MemoNum); err != nil {
		if err == sql.ErrNoRows {
			return tag, fmt.Errorf("tagsById %d: no such tag", id)
		}
		return tag, fmt.Errorf("tagsById %d: %v", id, err)
	}
	return tag, nil
}

// TagのUserIdによる取得関数
func TagByUser(user_id int64) ([]Tag, error) {
	var tags []Tag

	rows, err := db.Query("SELECT * FROM tag WHERE artist = ?", user_id)
	if err != nil {
		return nil, fmt.Errorf("emosByArtist %q: %v", user_id, err)
	}
	defer rows.Close()
	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var tag Tag
		if err := rows.Scan(&tag.Id, &tag.TagName, &tag.UserId, &tag.MemoNum); err != nil {
			return nil, fmt.Errorf("tagsByArtist %q: %v", user_id, err)
		}
		tags = append(tags, tag)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("tagsByArtist %q: %v", user_id, err)
	}
	return tags, nil
}

// Tagの更新関数
func (tag *Tag) UpdateTag() error {
	_, err := mydb.Exec(
		"UPDATE tag SET 'tag_name'=?, 'user_id'=?, 'memo_num'=? WHERE id = ?", tag.TagName, tag.UserId, tag.MemoNum,
	)
	if err != nil {
		return fmt.Errorf("updateTag: %v", err)
	}
	return nil
}

// Tagの削除関数
func (tag *Tag) DeleteTag() error {
	_, err := mydb.Exec(
		"DELETE FROM tag WHERE id = ?", tag.Id,
	)
	if err != nil {
		return fmt.Errorf("deleteTag: %v", err)
	}
	return nil
}

// --------Tagオブジェクト----->
func init() {
	db = GetMydb()
}
