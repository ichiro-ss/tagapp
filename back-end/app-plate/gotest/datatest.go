package gotest

import (
	"app-plate/data"
	"fmt"
	"log"
)

func TestUserData() {
	id := "userid"
	pw := "password2"
	user := data.User{Id: id, Hashpass: pw}

	var err error

	fmt.Println("id:", user.Id, ", pass:", user.Hashpass)
	fmt.Println("Userの作成開始")
	err = user.Create()
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("Userの作成に成功しました")

	fmt.Println("Userの取得開始")
	user2, err := data.GetUser(id)
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("Userの取得に成功しました")
	fmt.Println("id :", user2.Id, ", hashpass :", user2.Hashpass)

	fmt.Println("Userの削除開始")
	err = user.Delete()
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("Userの削除に成功しました")

}
