package data

import (
	"database/sql"
	"fmt"
)

//-------Tagテーブルのテーブル名+各カラム名----->

// <-------Tagオブジェクト-----
type Tag struct {
	Id      int    `json:"id"`
	TagName string `json:"name"`
	UserId  string
	MemoNum int `json:"memoNum"`
}

type TagMap struct {
	Id     int `json:"id"`
	TagId  int
	MemoId int
}

// Tagのデータベースへ作成
func (tag *Tag) CreateTag() (int, error) {
	row := db.QueryRow("SELECT * FROM tag WHERE tagName = ? and userId = ?", tag.TagName, tag.UserId)
	if err := row.Scan(&tag.Id, &tag.TagName, &tag.UserId, &tag.MemoNum); err != nil {
		if err == sql.ErrNoRows {
			result, err := mydb.Exec(
				"INSERT INTO tag (tagName, userId, memosNum) VALUES (?, ?, ?)",
				tag.TagName, tag.UserId, 1,
			)
			if err != nil {
				return 0, fmt.Errorf("createTag: %v", err)
			}
			created_id, err := result.LastInsertId()
			id := int(created_id)
			if err != nil {
				return 0, fmt.Errorf("createTag: %v", err)
			}
			return id, nil
		}
	}
	tag.MemoNum++
	err := tag.UpdateTag()
	if err != nil {
		return tag.Id, fmt.Errorf("CreateTag: %v", err)
	}
	fmt.Printf("Tag%dを作成", tag.Id)
	return tag.Id, nil
}

func CreateTagMap(tag_id int, memo_id int) (int, error) {
	result, err := mydb.Exec(
		"INSERT INTO tag_map (tagId, memoId) VALUES (?, ?)",
		tag_id, memo_id,
	)
	if err != nil {
		return 0, fmt.Errorf("createTagMap: %v", err)
	}
	created_id, err := result.LastInsertId()
	id := int(created_id)
	if err != nil {
		return 0, fmt.Errorf("createTagMap: %v", err)
	}
	return id, nil
}

// Tagのidによる取得関数
func TagByID(id int) (Tag, error) {
	var tag Tag

	row := db.QueryRow("SELECT * FROM tag WHERE id = ?", id)
	if err := row.Scan(&tag.Id, &tag.TagName, &tag.UserId, &tag.MemoNum); err != nil {
		if err == sql.ErrNoRows {
			return tag, fmt.Errorf("tagsById %d: no such tag", id)
		}
		return tag, fmt.Errorf("tagsById %d: %v", id, err)
	}
	return tag, nil
}

// TagのUserIdによる取得関数
func TagByUser(user_id string) ([]Tag, error) {
	var tags []Tag

	rows, err := db.Query("SELECT * FROM tag WHERE userId = ?", user_id)
	if err != nil {
		return nil, fmt.Errorf("tagsByUser %q: %v", user_id, err)
	}
	defer rows.Close()
	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var tag Tag
		if err := rows.Scan(&tag.Id, &tag.TagName, &tag.UserId, &tag.MemoNum); err != nil {
			return nil, fmt.Errorf("tagsByUser %q: %v", user_id, err)
		}
		tags = append(tags, tag)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("tagsByUser %q: %v", user_id, err)
	}
	return tags, nil
}

func TagNameByMemo(memo_id int) ([]string, error) {
	var tag_names []string

	rows, err := db.Query("SELECT tagName FROM tag INNER JOIN tag_map ON tag.id=tag_map.tagId WHERE memoId = ?", memo_id)
	if err != nil {
		return nil, fmt.Errorf("tagNameByUser %q: %v", memo_id, err)
	}
	defer rows.Close()
	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var tag_name string
		if err := rows.Scan(&tag_name); err != nil {
			return nil, fmt.Errorf("tagNameByUser %q: %v", memo_id, err)
		}
		tag_names = append(tag_names, tag_name)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("tagNameByUser %q: %v", memo_id, err)
	}
	return tag_names, nil
}

// メモのIdからタグオブジェクトの配列を取得
func TagsByMemo(memo_id int) ([]Tag, error) {
	var tags []Tag

	rows, err := db.Query("SELECT tagName, tag.id, userId, memosNum FROM tag INNER JOIN tag_map ON tag.id=tag_map.tagId WHERE memoId = ?", memo_id)
	if err != nil {
		return nil, fmt.Errorf("tagNameByUser %q: %v", memo_id, err)
	}
	defer rows.Close()
	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		tag := Tag{}
		if err := rows.Scan(&tag.TagName, &tag.Id, &tag.UserId, &tag.MemoNum); err != nil {
			return nil, fmt.Errorf("tagNameByUser %q: %v", memo_id, err)
		}
		tags = append(tags, tag)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("tagNameByUser %q: %v", memo_id, err)
	}
	return tags, nil
}

// Tagの更新関数
func (tag *Tag) UpdateTag() error {
	_, err := db.Exec(
		"UPDATE tag SET tagName=?, userId=?, memosNum=? WHERE id = ?", tag.TagName, tag.UserId, tag.MemoNum, tag.Id,
	)
	if err != nil {
		return fmt.Errorf("updateTag: %v", err)
	}
	return nil
}

// Tagの削除関数
func (tag *Tag) DeleteTag() error {
	_, err := db.Exec(
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
