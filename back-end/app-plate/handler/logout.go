package handler

import (
	"app-plate/lib"
	"net/http"
)

func logoutGetHandler(w http.ResponseWriter, r *http.Request) {

	gbsession := lib.GetGlobalSessions()
	gbsession.SessionDestroy(w, r)

	w.WriteHeader(http.StatusOK)
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if SetCrosOptions(w, r) {
		return
	}

	switch r.Method {
	case http.MethodGet:
		logoutGetHandler(w, r)
	default:
		logoutGetHandler(w, r)
	}
}
