import Header from "../components/header"
import { Back_Index } from "../constants"
import { useEffect, useState } from "react"
import Link from "next/link"
import { MemoData } from "../components/memoData"


// CORSリクエストを生成するヘルパー関数
const makeCROSRequest = (request: any) => {
    request.credentials = "include"
    request.headers = {
        "Access-Control-Allow-Credentials": "true",
    }
    return request
}

// スペースで区切られた文字列をタグの配列に変換するヘルパー関数
const makeMemoTags = (str: string): string[] => {
    let tags: string[] = str.split(" ")
    const tagNames = []
    for (const value of tags) {
        tagNames.push(value.trim())
    }

    return tagNames
}

const convertJsonToMemoData = (data : any) => {

    const memo = data.Memo
    const title = memo.Title
    const date = new Date(memo.CreatedAt)
    const dateStr = date.toLocaleString()
    const id = parseInt(memo.id)
    let picpath =  ""

    if ( memo.PicPath === "undefined" ) {
        picpath = ""
    } else {
        picpath = memo.PicPath.substring(1)
    }
    const comment = memo.Content
    const userid = memo.UserId

    const tags = data.Tags

    const memodata : MemoData = {
        title : title,
        userid : userid,
        comment : comment,
        filepath : picpath,
        id : id,
        date : dateStr,
        tag : tags,
    }

    return memodata
}

// メモの検索や表示を行うコンポーネント
export default function Home() {
    const title = "Memo Test Page"
    const url = Back_Index + "/api/memo"
    const [userId, setUserId] = useState("")
    const [memoTags, setTags] = useState<string[]>([])
    const [keywords, setKeywords] = useState<string[]>([])
    const [startDate, setStratDate] = useState<Date>()

    // ユーザー情報を取得するためのEffect
    const getUser = useEffect(() => {
        console.log("GetUser")
        fetch(Back_Index + "/api/login", makeCROSRequest({}))
            .then(res => res.json())
            .then(data => {
                setUserId(data.id)
                console.log("userId:", userId)
            })
            .catch( err => {
                console.log(err)
            })
    }, []);

    // メモの編集？いらない？いるかも
    // テキスト入力の変更を処理するハンドラー
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setFunc: any) => {
        setFunc(event.target.value)
    }
     // タグの入力変更を処理するハンドラー
    const handleInputCahngeTags = (event: React.ChangeEvent<HTMLInputElement>) => {
        const tagNames = makeMemoTags(event.target.value)
        setTags(tagNames)
    }
    // キーワードの入力値を更新するハンドラー関数
    const handleInputCahngeKeywords = (event: React.ChangeEvent<HTMLInputElement>) => {
        const tagNames = makeMemoTags(event.target.value)
        setKeywords(tagNames)
    }
    // 開始日の入力値を更新するハンドラー関数
    const handleInputCahngeStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const startDate = new Date(event.target.value)
        setStratDate(startDate)
    }
    // すべてのメモを検索する関数
    const OnSearchAllMemo= (e : any ) => {
        e.preventDefault()
        const url = Back_Index+`/api/memosearch`

        const form = new FormData()

        const pageidx = 1
        const pageAmount = 10

        form.append("username", userId)
        form.append("pageidx", pageidx.toString())
        form.append("pageItemAmount", pageAmount.toString())

        const req = {
            method: "PUT",
            body : form,
        }

        fetch( url, makeCROSRequest(req))
        .then(res => {
            if ( !res.ok ) {
                res.text().then( text => {
                    console.log(text)
                })
                return
            } else {
                res.json().then( data => {
                    console.log("検索に成功しました")
                    console.log(data)

                    for ( const memo of data ) {
                        console.log(convertJsonToMemoData(memo))
                    }
                })
            }
        })
        .catch( err => {
            console.error(err)
        })
    }


    // オプションを指定してメモを検索する関数
    const OnSearchOption= (e : any ) => {
        e.preventDefault()
        const url = Back_Index+`/api/memosearch`

        const form = new FormData()

        const pageidx = 1
        const pageAmount = 10

        for ( const keyword of keywords ) {
            form.append("keywords", keyword)
        }
        for ( const tag of memoTags) {
            form.append("tags", tag)
        }

        form.append("keywordoption", "and")
        form.append("tagoption", "and")
        form.append("username", userId)
        form.append("pageidx", pageidx.toString())
        form.append("pageItemAmount", pageAmount.toString())
        if ( typeof(startDate) !== "undefined" ) {
            form.append("startdate", (startDate).toISOString())
        }

        const req = {
            method: "PUT",
            body : form,
        }

        fetch( url, makeCROSRequest(req))
        .then(res => {
            if ( !res.ok ) {
                res.text().then( text => {
                    console.log(text)
                })
                return
            } else {
                res.json().then( data => {
                    console.log("検索に成功しました")
                    console.log(data)
                })
            }
        })
        .catch( err => {
            console.error(err)
        })
    }

    const onGetTags = () => {
        const url = Back_Index+`/api/tags?username=${userId}`

        fetch(url, makeCROSRequest({}))
        .then( res => {
            if (res.ok) {
                res.json().then(data => console.log(data) )
            } else {
                res.text().then(data => console.log(data) )
            }
        }) 
        .catch( err => {
            console.error(err)
        })
        
    }
    return (
        <div>
            <Header title={title} />
            <h1 className="bg-primary">Memo Test Page</h1>


            <form>
                <div className="form-group mb-3">
                    <label >MemoTags</label>
                    <input className="ml-3 form-control" placeholder="tags" name="" onChange={handleInputCahngeTags} />
                </div>
                <div className="form-group mb-3">
                    <label >Keywords</label>
                    <input className="ml-3 form-control" placeholder="Keywords" name="" onChange={handleInputCahngeKeywords} />
                </div>
                <div className="form-group mb-3">
                    <label >StartDate</label>
                    <input type="date" className="ml-3 form-control" name="" onChange={handleInputCahngeStartDate} />
                </div>

                <p>StartDate : {startDate?.toString()}</p>
                <div>
                    {
                        memoTags.map((item, index) =>
                            <p>Tag No{index}. {item}</p>
                        )
                    }
                </div>
                <div>
                    {
                        keywords.map((item, index) =>
                            <p>Key No{index}. {item}</p>
                        )
                    }
                </div>

                <button type="button" className="btn btn-primary" onClick={OnSearchAllMemo}>SearchAllMemo</button>
                <button type="button" className="btn btn-primary" onClick={OnSearchOption}>SearchMemoWithOption</button>
                <button type="button" className="btn btn-primary" onClick={onGetTags}>GetTags</button>
            </form>
            <Link href="/tests/login">
                <p>move to login page →</p>
            </Link>
        </div>
    )
}