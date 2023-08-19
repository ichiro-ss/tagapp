import Header from "../components/header"
import { Back_Index } from "../constants"
import { useEffect, useState } from "react"
import Link from "next/link"

const makeCROSRequest = (request: any) => {
    request.credentials = "include"
    request.headers = {
        "Access-Control-Allow-Credentials": "true",
    }
    return request
}

const makeMemoTags = (str: string): string[] => {
    let tags: string[] = str.split(" ")
    const tagNames = []
    for (const value of tags) {
        tagNames.push(value.trim())
    }

    return tagNames
}

export default function Home() {
    const title = "Memo Test Page"
    const url = Back_Index + "/api/memo"
    const [userId, setUserId] = useState("")
    const [memoTags, setTags] = useState<string[]>([])
    const [keywords, setKeywords] = useState<string[]>([])
    const [startDate, setStratDate] = useState<Date>()

    const getUser = useEffect(() => {
        console.log("GetUser")
        fetch(Back_Index + "/api/login", makeCROSRequest({}))
            .then(res => res.json())
            .then(data => {
                setUserId(data.id)
                console.log("userId:", userId)
            })
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setFunc: any) => {
        setFunc(event.target.value)
    }

    const handleInputCahngeTags = (event: React.ChangeEvent<HTMLInputElement>) => {
        const tagNames = makeMemoTags(event.target.value)
        setTags(tagNames)
    }
    const handleInputCahngeKeywords = (event: React.ChangeEvent<HTMLInputElement>) => {
        const tagNames = makeMemoTags(event.target.value)
        setKeywords(tagNames)
    }

    const handleInputCahngeStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const startDate = new Date(event.target.value)
        setStratDate(startDate)
    }

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
                })
            }
        })
        .catch( err => {
            console.error(err)
        })
    }

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
                            <p>Tag No{index}. {item}</p>
                        )
                    }
                </div>

                <button type="button" className="btn btn-primary" onClick={OnSearchAllMemo}>SearchAllMemo</button>
                <button type="button" className="btn btn-primary" onClick={OnSearchOption}>SearchMemoWithOption</button>
            </form>
            <Link href="/tests/login">
                <p>move to login page →</p>
            </Link>
        </div>
    )
}