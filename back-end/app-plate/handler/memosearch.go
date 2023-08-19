package handler

import (
	"net/http"
	"time"
)

type option struct {
	value int
}

var andOption = option{value: 0}
var orOption = option{value: 1}
var notOption = option{value: 2}

func makeAndOption() option {
	return option{value: 0}
}

func makeOrOption() option {
	return option{value: 1}
}

func makeNotOption() option {
	return option{value: 2}
}

func (opt *option) isSame(opt2 *option) bool {
	return opt.value == opt2.value
}

type apiMemoSearchParams struct {
	searchType     string
	userId         string
	keywords       []string
	tags           []string
	keywordOption  option
	tagOption      option
	startDate      time.Time
	endDate        time.Time
	pageIdx        int
	pageItemAmount int
}

func parseMemoSearchParams(w http.ResponseWriter, r *http.Request) (params apiMemoSearchParams) {
	params = apiMemoSearchParams{}
	parseSize := 10 << 20

	r.ParseMultipartForm(int64(parseSize))

	return
}

func MemoSearchHanlder(w http.ResponseWriter, r *http.Request) {
	if SetCrosOptions(w, r) {
		return
	}

	switch r.Method {

	}
}
