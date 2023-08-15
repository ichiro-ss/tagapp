package gotest

import (
	"app-plate/data"
	"fmt"
	"log"
	"time"
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

func TestMemoData() {
	id := 1
	title := "memoTitle"
	userId := "userid"
	content := "content"
	createdAt := time.Now()
	picPath := "aaa/bb"

	memo := data.Memo{
		Id: id, Title: title, UserId: userId, Content: content, CreatedAt: createdAt, PicPath: picPath,
	}

	var err error

	fmt.Println("id:", memo.Id, ", title:", memo.Title, ", userId:", memo.UserId, ", content:", memo.Content, ", createdAt:", memo.CreatedAt, ", picPath:", memo.PicPath)
	fmt.Println("Memoの作成開始")
	addedid, err := memo.CreateMemo()
	memo.Id = addedid
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Printf("Memo%dの作成に成功しました", addedid)

	fmt.Println("Tagの取得開始")
	new_memo, err := data.MemoByID(id)
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("Memoの取得に成功しました")
	fmt.Println("id:", new_memo.Id, ", title:", new_memo.Title, ", userId:", new_memo.UserId, ", content:", new_memo.Content, ", createdAt:", new_memo.CreatedAt, ", picPath:", new_memo.PicPath)

	fmt.Println("Memoの更新開始")
	memo.Content = "updated"
	err = memo.UpdateMemo()
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("Memoの更新に成功しました")
	fmt.Println("id:", new_memo.Id, ", title:", new_memo.Title, ", userId:", new_memo.UserId, ", content:", new_memo.Content, ", createdAt:", new_memo.CreatedAt, ", picPath:", new_memo.PicPath)

	fmt.Println("Memoの削除開始")
	err = memo.DeleteMemo()
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("Memoの削除に成功しました")
}

func TestTagData() {
	id := 1
	tagName := "tagName"
	userId := "userid"
	memoNum := 1

	tag := data.Tag{
		Id: id, TagName: tagName, UserId: userId, MemoNum: memoNum,
	}

	var err error

	fmt.Println("id:", tag.Id, ", tagName:", tag.TagName, ", userId:", tag.UserId, ", memoNum:", tag.MemoNum)
	fmt.Println("Tagの作成開始")
	addedid, err := tag.CreateTag()
	tag.Id = addedid
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Printf("Tag%dの作成に成功しました", addedid)

	fmt.Println("Tagの取得開始")
	new_tag, err := data.TagByID(id)
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("Tagの取得に成功しました")
	fmt.Println("id:", new_tag.Id, ", tagName:", new_tag.TagName, ", userId:", new_tag.UserId, ", memoNum:", new_tag.MemoNum)

	fmt.Println("Tagの更新開始")
	tag.TagName = "updated"
	err = tag.UpdateTag()
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("Tagの更新に成功しました")
	fmt.Println("id:", new_tag.Id, ", tagName:", new_tag.TagName, ", userId:", new_tag.UserId, ", memoNum:", new_tag.MemoNum)

	fmt.Println("Tagの削除開始")
	err = tag.DeleteTag()
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("Tagの削除に成功しました")
}
