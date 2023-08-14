package data

import (
	"database/sql"
	"fmt"
)

// <-------Userテーブルのテーブル名+各カラム名-----
var tableName = "user"
var useridCol = "userid"
var passCol = "hashpass"

//-------Userテーブルのテーブル名+各カラム名----->

// データベース変数(*sql.DB)
var db *sql.DB

// <-------Userオブジェクト-----

type User struct {
	Id       string `json:"id"`
	Hashpass string `json:"-"`
}

// Userのデータベースへ作成
func (user *User) Create() error {
	//Cretae操作の実行SQL文
	statement := fmt.Sprintf("INSERT INTO %s (%s, %s) VALUES (?, ?)", tableName, useridCol, passCol)

	fmt.Println("statement:", statement)
	stmt, err := mydb.Prepare(statement)
	if err != nil {
		return err
	}

	defer stmt.Close()
	_, err = stmt.Exec(user.Id, user.Hashpass)
	if err != nil {
		return err
	}

	return nil
}

// Userのidによる取得関数
func GetUser(id string) (user User, err error) {
	user = User{}
	statement := fmt.Sprintf("SELECT %s, %s from %s WHERE %s = ?", useridCol, passCol, tableName, useridCol)

	stmt, err := db.Prepare(statement)
	if err != nil {
		return user, err
	}
	defer stmt.Close()

	err = stmt.QueryRow(id).Scan(&user.Id, &user.Hashpass)

	if err != nil {
		return user, err
	}

	return user, err
}

// Userの削除関数
func (user *User) Delete() error {
	statement := fmt.Sprintf("DELETE FROM %s WHERE %s = ?", tableName, useridCol)

	stmt, err := db.Prepare(statement)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(user.Id)

	if err != nil {
		return err
	}

	return nil
}

//--------Userオブジェクト----->

func init() {
	db = GetMydb()
}
