package handler

import (
	"app-plate/data"
	"net/http"
	"strconv"
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

func convertOption(str string) option {

	switch str {
	case "and":
		return makeAndOption()
	case "not":
		return makeNotOption()
	case "or":
		return makeOrOption()
	default:
		return makeAndOption()
	}
}

func (opt *option) isSame(opt2 *option) bool {
	return opt.value == opt2.value
}

type apiMemoSearchJsonMemo struct {
	memo data.Memo
	tags []string
}

func makeMemoSearchJsonMemoStruct(memo data.Memo) (apiMemoSearchJsonMemo, error) {
	memoJson := apiMemoSearchJsonMemo{}
	tagNames, err := data.TagNameByMemo(memo.Id)

	if err != nil {
		return memoJson, err
	}

	memoJson.memo = memo
	memoJson.tags = tagNames

	return memoJson, err
}

func isMatchTags(targets, matcher []string, opt option) bool {
	and := makeAndOption()
	// or := makeOrOption()
	not := makeNotOption()

	var strMap = make(map[string]bool)
	for _, value := range targets {
		strMap[value] = true
	}

	if opt.isSame(&and) {
		for _, matchtag := range matcher {
			_, exists := strMap[matchtag]
			if !exists {
				return false
			}
		}
		return true
	}

	if opt.isSame(&and) {
		for _, matchtag := range matcher {
			_, exists := strMap[matchtag]
			if exists {
				return true
			}
		}
		return false
	}

	if opt.isSame(&not) {
		for _, matchtag := range matcher {
			_, exists := strMap[matchtag]
			if exists {
				return false
			}
		}
		return true
	}

	return false
}

type apiMemoSearchParams struct {
	SearchType     string
	UserName       string
	Keywords       []string
	Tags           []string
	KeywordOption  option
	TagOption      option
	StartDate      *time.Time
	EndDate        *time.Time
	PageIdx        int
	PageItemAmount int
}

func parseMemoSearchParams(w http.ResponseWriter, r *http.Request) (params apiMemoSearchParams, isCollectParams bool) {
	params = apiMemoSearchParams{}
	parseSize := 10 << 20
	isCollectParams = true

	r.ParseMultipartForm(int64(parseSize))

	userName := r.FormValue("username")
	keywordsNameStr := r.Form["keywords"]
	tagsNameStr := r.Form["tags"]
	keywordOptionStr := r.FormValue("keywordoption")
	tagOptionStr := r.FormValue("tagoption")
	startDateIso := r.FormValue("startdate")
	endDateIso := r.FormValue("enddate")
	pageIdxStr := r.FormValue("pageidx")
	pageItemAmountStr := r.FormValue("pageItemAmount")

	var tags []string
	var keywords []string
	var keywordOption option
	var tagOption option
	var startDate *time.Time
	var endDate *time.Time
	var pageIdx int
	var pageItemAmount int

	keywords = validTagNames(keywordsNameStr)
	tags = validTagNames(tagsNameStr)
	keywordOption = convertOption(keywordOptionStr)
	tagOption = convertOption(tagOptionStr)

	startDate = nil
	if startDateIso != "" {
		tmpDate, err := time.Parse(time.RFC3339, startDateIso)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("`startdate`に不正な値が存在します"))
			isCollectParams = false
			return
		}
		startDate = &tmpDate
	}

	endDate = nil
	if endDateIso != "" {
		tmpDate, err := time.Parse(time.RFC3339, endDateIso)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("`startdate`に不正な値が存在します"))
			isCollectParams = false
			return
		}
		startDate = &tmpDate
	}

	pageIdx = 1
	pageIdx, err := strconv.Atoi(pageIdxStr)
	if pageIdxStr == "" && err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("`pgeIdx`に不正な値が存在します"))
		isCollectParams = false
		return
	}

	pageItemAmount, err = strconv.Atoi(pageItemAmountStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("`pageItemAmount`に不正な値が存在します"))
		isCollectParams = false
		return
	}

	params.UserName = userName
	params.Keywords = keywords
	params.Tags = tags
	params.KeywordOption = keywordOption
	params.TagOption = tagOption
	params.StartDate = startDate
	params.EndDate = endDate
	params.PageIdx = pageIdx
	params.PageItemAmount = pageItemAmount

	return
}

func memoSearchByUserName(userName string) ([]apiMemoSearchJsonMemo, error) {
	var results []apiMemoSearchJsonMemo
	var err error

	memoDatas, err := data.MemoByUser(userName)
	if err != nil {
		return results, err
	}

	for _, value := range memoDatas {
		jsonStruct, err := makeMemoSearchJsonMemoStruct(value)
		if err != nil {
			return results, err
		}
		results = append(results, jsonStruct)
	}

	return results, nil
}

func memoSearchByTagName()

// func memoSearch
// 全文検索は、タグの一部も引っかかる
func MemoSearchHanlder(w http.ResponseWriter, r *http.Request) {
	if SetCrosOptions(w, r) {
		return
	}

	switch r.Method {

	}
}
