package lib

import (
	"app-plate/data"

	"github.com/astaxie/session"
	_ "github.com/astaxie/session/providers/memory"
)

var globalSessions *session.Manager

func init() {
	const sessionLimitTime = 1200
	var err error

	globalSessions, err = session.NewManager("memory", "gosessionid", sessionLimitTime)

	if err != nil {
		panic(err)
	}

	go globalSessions.GC()
}

func GetGlobalSessions() *session.Manager {
	return globalSessions
}

// セッションに登録されているユーザーの取得関数
func GetSessionUser(sess *session.Session) *data.User {
	user_i := (*sess).Get("user")

	if user_i == nil {
		return nil
	}

	user := user_i.(data.User)
	return &user
}

func SetSessionUser(sess *session.Session, user *data.User) {
	(*sess).Set("user", *user)
}
