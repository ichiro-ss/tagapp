package data

//データベース接続関係の関数ファイル
import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func open(path string, count uint) *sql.DB {

	if count == 0 {
		return nil
	}

	db, err := sql.Open("mysql", path)
	if err != nil {
		log.Fatal("open error:", err)
	}

	if err = db.Ping(); err != nil {
		time.Sleep(time.Second * 2)
		count--
		fmt.Printf("retry... count:%v\n", count)
		return open(path, count)
	}

	fmt.Println("db connected!")
	return db
}

// Mysqlの起動が遅いため、再帰的に接続処理を行う
func connectDB() *sql.DB {
	var path string = fmt.Sprintf("%s:%s@tcp(db:3306)/%s?charset=utf8&parseTime=true",
		os.Getenv("MYSQL_USER"), os.Getenv("MYSQL_PASSWORD"),
		os.Getenv("MYSQL_DATABASE"))
	fmt.Println("path = ", path)

	return open(path, 100)
}

var mydb *sql.DB

func init() {
	fmt.Println("Connecting Database ...")
	mydb = connectDB()
	if mydb == nil {
		panic("Can't connect Database")
	}
}

// グローバルなデータベースの取得関数
func GetMydb() *sql.DB {
	return mydb
}
