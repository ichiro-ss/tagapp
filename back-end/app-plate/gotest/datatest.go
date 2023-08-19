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

	err = user.Create()
	if err != nil {
		log.Fatal(err)
		return
	}
}

func TestMemoData() {
	id := 1
	title := "memoTitle"
	userId := "userid"
	content := "content"
	createdAt := time.Now()
	picPath := "aaa/bb"

	memo1 := data.Memo{
		Id: id, Title: title, UserId: userId, Content: content, CreatedAt: createdAt, PicPath: picPath,
	}
	memo2 := data.Memo{
		Id: 2, Title: "memoTitle2", UserId: userId, Content: content, CreatedAt: createdAt, PicPath: picPath,
	}
	memo1_tags := []data.Tag{
		{Id: 1, TagName: "a", UserId: userId, MemoNum: 1},
		{Id: 2, TagName: "b", UserId: userId, MemoNum: 1},
	}
	memo2_tags := []data.Tag{
		{Id: 3, TagName: "a", UserId: userId, MemoNum: 1},
		{Id: 4, TagName: "b", UserId: userId, MemoNum: 1},
	}
	var err error

	fmt.Println("id:", memo1.Id, ", title:", memo1.Title, ", userId:", memo1.UserId, ", content:", memo1.Content, ", createdAt:", memo1.CreatedAt, ", picPath:", memo1.PicPath)
	fmt.Println("Memoの作成開始")
	addedid, err := memo1.CreateMemo(memo1_tags)
	memo1.Id = addedid
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Printf("Memo%dの作成に成功しました\n", addedid)
	addedid, err = memo2.CreateMemo(memo2_tags)
	memo2.Id = addedid
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Printf("Memo%dの作成に成功しました\n", addedid)

	tag_names, err := data.TagNameByMemo(memo1.Id)
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Printf("Memo%dのtagは%sです\n", memo1.Id, tag_names)

	new_tag := data.Tag{Id: 5, TagName: "e", UserId: userId, MemoNum: 1}
	fmt.Printf("Memo%dのtagにeを追加します\n", memo1.Id)
	new_id, err := memo1.CreateMemoTag(new_tag)
	new_tag.Id = new_id
	if err != nil {
		log.Fatal(err)
		return
	}

	fmt.Printf("Memo%dのtagからeを削除します\n", memo1.Id)
	err = memo1.DeleteMemoTag(new_tag)
	if err != nil {
		log.Fatal(err)
		return
	}

	tag_names, err = data.TagNameByMemo(memo1.Id)
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Printf("Memo%dのtagは%sです\n", memo1.Id, tag_names)

	fmt.Println("Memoの取得開始")
	new_memo, err := data.MemoByID(memo1.Id)
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("Memoの取得に成功しました")
	fmt.Println("id:", new_memo.Id, ", title:", new_memo.Title, ", userId:", new_memo.UserId, ", content:", new_memo.Content, ", createdAt:", new_memo.CreatedAt, ", picPath:", new_memo.PicPath)

	fmt.Println("TagによるMemoの取得")
	memos, err := data.MemoByTag("b", userId)
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("tagがbのmemoは")
	fmt.Println(memos)

	fmt.Println("TagによるMemoのAND検索")
	memos, err = data.MemoByTagAND([]string{"a", "b"}, userId)
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("tagがaとbのmemoは")
	fmt.Println(memos)

	fmt.Println("Memoの更新開始")
	new_memo.Content = "updated"
	err = memo1.UpdateMemo()
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("Memoの更新に成功しました")
	fmt.Println("id:", new_memo.Id, ", title:", new_memo.Title, ", userId:", new_memo.UserId, ", content:", new_memo.Content, ", createdAt:", new_memo.CreatedAt, ", picPath:", new_memo.PicPath)

	fmt.Println("Memoの削除開始")
	err = new_memo.DeleteMemo()
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
	fmt.Printf("Tag%dの作成に成功しました\n", addedid)

	fmt.Println("Tagの取得開始")
	new_tag, err := data.TagByID(tag.Id)
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
