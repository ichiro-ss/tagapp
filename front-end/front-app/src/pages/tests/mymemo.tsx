import Header from "../components/header"
import { Back_Index } from "../constants"
import { useEffect, useState } from "react"
import Link from "next/link"

const makeCROSRequest = (request : any) => {
    request.credentials = "include"
    request.headers = {
        "Access-Control-Allow-Credentials": "true",
    } 
    return request
}

const makeMemoTags = ( str : string ) : string[] => {
    let tags : string[] = str.split(" ")
    const tagNames = []
    for ( const value of tags ) {
        tagNames.push(value.trim())
    }

    return  tagNames
}

export default function Home() {
    const title = "Memo Test Page"
    const url = Back_Index + "/api/memo"
    const [memoTitle, setMemoTitle] = useState("") 
    const [memoMain, setMemoMain] = useState("")
    const [userId, setUserId] = useState("")
    const [memoId, setMemoId] = useState(0)
    const [memoTags, setTags] = useState<string[]>([])

    const getUser = useEffect( () => {
        console.log("GetUser")
        fetch(Back_Index+"/api/login", makeCROSRequest({}))
        .then( res => res.json() )
        .then( data => {
            setUserId(data.id)
            console.log("userId:", userId) })
        }, []);

    const handleInputChange = (event : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setFunc : any) => {
        setFunc(event.target.value)
    }

    const handleInputCahngeTags = ( event : React.ChangeEvent<HTMLInputElement>) => {
        const tagNames = makeMemoTags(event.target.value)
        setTags(tagNames)
    }

    const OnSubmitEvent = (e : any ) => {
        e.preventDefault()
        const date : Date = new Date()

        const form: HTMLFormElement = e.target.closest("form") as HTMLFormElement;
        const formData: FormData = new FormData(form)

        for ( const tag  of memoTags ) {
            formData.append("tags", tag)
        }
        formData.append("username", userId)
        formData.append("dateiso", date.toISOString())
        console.log("username:",userId)

        const req = {
            method: "POST",
            body: formData,
        }

        fetch( url, makeCROSRequest(req))
        .then(res => {
            if ( !res.ok ) {
                res.text().then( text => {
                    console.log(text)
                })
                return
            }
            console.log("Fetch Finished")
        })
        .catch( err => {
            console.error(err)
        })
    }

    const onDeleteBtn = ( e : any) => {
        const form: HTMLFormElement = e.target.closest("form") as HTMLFormElement;
        const formData: FormData = new FormData(form)
        const url = `${Back_Index}/api/memo`
        const req = {
            method : "DELETE",
            body : formData
        }

        fetch ( url, makeCROSRequest(req))
        .then( res => {
            if ( res.ok ) {
                console.log("メモの削除に成功しました")
                return;
            } else {
                res.text().then(data => {
                    console.log(data)
                })
                return;
            }
        })
        .catch( err => {
            console.error(err)
        })
    }

    const onGetBtn = () => {
        const url = `${Back_Index}/api/memo?memoid=${memoId}`

        fetch ( url, makeCROSRequest({}))
        .then( res => {
            if ( res.ok ) {
                return res.json()
            } else {
                return;
            }
            
        })
        .then( data => {
            console.log("メモの取得に成功しました")
            console.log(data)
        })
        .catch( err => {
            console.error(err)
        })
    }

    const OnPutEvent = (e : any ) => {
        e.preventDefault()

        const form: HTMLFormElement = e.target.closest("form") as HTMLFormElement;
        const formData: FormData = new FormData(form)

        for ( const tag  of memoTags ) {
            formData.append("tags", tag)
        }
        formData.append("username", userId)
        console.log("username:",userId)

        const req = {
            method: "PUT",
            body: formData,
        }

        fetch( url, makeCROSRequest(req))
        .then(res => {
            if ( !res.ok ) {
                res.text().then( text => {
                    console.log(text)
                })
                return
            }
            console.log("Fetch Finished")
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
                <label>サムネイル画像</label>
                <input type="file" className="form-control" name="thumbnail"/>
                </div>
                <div className="form-group mb-3">
                    <label >Memotitle</label>
                    <input type="text" className="ml-3 form-control" placeholder="MemoTitle" name="memotitle" onChange={ (e) => handleInputChange(e, setMemoTitle)} />
                </div>
                <div className="form-group mb-3">
                    <label >Memocontent</label>
                    <textarea className="ml-3 form-control" placeholder="MemoMain" rows={3} name="memocontent" onChange={ (e) => handleInputChange(e, setMemoMain)} />
                </div>
                <div className="form-group mb-3">
                    <label >MemoId</label>
                    <input type="number" className="ml-3 form-control" placeholder="MemoId" name="memoid" onChange={ (e) => handleInputChange(e, setMemoId)} />
                </div>
                <div className="form-group mb-3">
                    <label >MemoTags</label>
                    <input className="ml-3 form-control" placeholder="Memo" name="memotitle" onChange={ handleInputCahngeTags } />
                </div>

                <p>MemoTitle : {memoTitle}</p>
                <p>MemoMain : {memoMain}</p>
                <p>MemoID : {memoId} </p>
                <div>
                    {
                        memoTags.map( (item, index) => 
                            <p>Tag No{index}. {item}</p>
                        )
                    }
                </div>
                <button type="button" className="btn btn-primary" onClick={OnSubmitEvent}>CreateMemo</button>
                <button type="button" className="btn btn-primary" onClick={OnPutEvent}>UpdateMemo</button>
                <button type="button" className="btn btn-primary" onClick={onDeleteBtn}>DeleteMemo</button>
                <button type="button" className="btn btn-primary" onClick={onGetBtn}>GetMemo</button>
            </form>
            <Link href="/tests/login">
                <p>move to login page →</p>
            </Link>
        </div>
    )
}