package handler

import (
	"app-plate/data"
	"net/http"
	"strconv"
	"strings"
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
	or := makeOrOption()
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

	if opt.isSame(&or) {
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

func isMatchKeyword(keywords []string, memoJson *apiMemoSearchJsonMemo, opt option) bool {
	if len(keywords) == 0 {
		return true
	}

	var targets []string
	for _, value := range memoJson.tags {
		targets = append(targets, value)
	}
	targets = append(targets, memoJson.memo.Title)
	targets = append(targets, memoJson.memo.Content)

	and := makeAndOption()
	or := makeOrOption()
	not := makeNotOption()

	if opt.isSame(&and) {
		for _, keyword := range keywords {
			isInclude := false
			for _, target := range targets {
				if strings.Contains(target, keyword) {
					isInclude = true
					break
				}
			}
			if !isInclude {
				return false
			}
		}
		return true
	}

	if opt.isSame(&or) {
		for _, keyword := range keywords {
			isInclude := false
			for _, target := range targets {
				if strings.Contains(target, keyword) {
					isInclude = true
					break
				}
			}
			if isInclude {
				return true
			}
		}
		return false
	}

	if opt.isSame(&not) {
		for _, keyword := range keywords {
			for _, target := range targets {
				if strings.Contains(target, keyword) {
					return false
				}
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

func memoSearchByTagName(tagNames []string, memoJsons []apiMemoSearchJsonMemo, tagOpt option) []apiMemoSearchJsonMemo {
	var results []apiMemoSearchJsonMemo
	if len(tagNames) == 0 {
		return memoJsons
	}

	for _, memo := range memoJsons {
		if isMatchTags(memo.tags, tagNames, tagOpt) {
			results = append(results, memo)
		}
	}
	return results
}

func memoSearchByKeywords(keywords []string, memoJsons []apiMemoSearchJsonMemo, opt option) []apiMemoSearchJsonMemo {
	var results []apiMemoSearchJsonMemo
	if len(keywords) == 0 {
		return memoJsons
	}

	for _, memo := range memoJsons {
		if isMatchKeyword(keywords, &memo, opt) {
			results = append(results, memo)
		}
	}
	return results
}

func memoSearchByDate(startDate, endDate *time.Time, memoJsons []apiMemoSearchJsonMemo) []apiMemoSearchJsonMemo {
	var results []apiMemoSearchJsonMemo

	results = memoJsons
	if startDate != nil {
		var tmp []apiMemoSearchJsonMemo
		for _, memoJson := range memoJsons {
			if startDate.Before(memoJson.memo.CreatedAt) {
				tmp = append(tmp, memoJson)
			}
		}
		results = tmp
	}

	if endDate != nil {
		var tmp []apiMemoSearchJsonMemo
		for _, memoJson := range memoJsons {
			if endDate.After(memoJson.memo.CreatedAt) {
				tmp = append(tmp, memoJson)
			}
		}
		results = tmp
	}

	return results
}

func searchMemoWithParam(params *apiMemoSearchParams) []apiMemoSearchJsonMemo {
	var err error
	var results []apiMemoSearchJsonMemo

	results, err = memoSearchByUserName(params.UserName)

	if err != nil {
		return results
	}

	//タグでの検索
	results = memoSearchByTagName(params.Tags, results, params.TagOption)
	//全文検索
	results = memoSearchByKeywords(params.Keywords, results, params.KeywordOption)

	//日付絞り込み
	results = memoSearchByDate(params.StartDate, params.EndDate, results)

	return results
}

func searchMemoByIndex(pageIndex, pageItemAmount int, memoJsons []apiMemoSearchJsonMemo) []apiMemoSearchJsonMemo {
	var results []apiMemoSearchJsonMemo
	if pageIndex <= 0 {
		return results
	}

	size := len(memoJsons)
	startIndex := (pageIndex - 1) * pageItemAmount

	if size <= startIndex {
		return results
	}

	endIndex := (pageIndex) * pageItemAmount
	if size <= endIndex {
		endIndex = size
	}

	return results[startIndex:endIndex]
}

func searchMemoHandle(w http.ResponseWriter, r *http.Request) {
	var err error
	params, isCollectParams := parseMemoSearchParams(w, r)
	if !isCollectParams {
		return
	}

	results := searchMemoWithParam(&params)
	results = searchMemoByIndex(params.PageIdx, params.PageItemAmount, results)

	err = setJsonData(w, r, results)
	if err != nil {
		return
	}

	return
}

// func memoSearch
// 全文検索は、タグの一部も引っかかる
func MemoSearchHanlder(w http.ResponseWriter, r *http.Request) {
	if SetCrosOptions(w, r) {
		return
	}

	searchMemoHandle(w, r)
}
