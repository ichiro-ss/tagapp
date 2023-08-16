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

export default function Home() {
    const title = "Memo Test Page"
    const url = Back_Index + "/api/memo"
    const [memoTitle, setMemoTitle] = useState("") 
    const [memoMain, setMemoMain] = useState("")
    const [userId, setUserId] = useState("")

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

    const OnSubmitEvent = (e : any ) => {
        e.preventDefault()
        const date : Date = new Date()

        const form: HTMLFormElement = e.target.closest("form") as HTMLFormElement;
        const formData: FormData = new FormData(form)

        formData.append("tags", "125")
        formData.append("tags", "1356")
        formData.append("username", userId)
        formData.append("dateiso", date.toISOString())
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

    const onGetBtn = () => {
        const memoId = 125
        const url = `${Back_Index}/api/memo?memoid=${memoId}`

        fetch ( url, makeCROSRequest({}))
        .then( res => 
            console.log(res))
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
                    <label >Memotitle</label>
                    <textarea className="ml-3 form-control" placeholder="MemoMain" rows={3} name="memomain" onChange={ (e) => handleInputChange(e, setMemoMain)} />
                </div>

                <p>MemoTitle : {memoTitle}</p>
                <p>MemoMain : {memoMain}</p>
                <button type="button" className="btn btn-primary" onClick={OnSubmitEvent}>Submit</button>
                <button type="button" className="btn btn-primary" onClick={onGetBtn}>GetMemo</button>
            </form>
            <Link href="/tests/login">
                <p>move to login page →</p>
            </Link>
        </div>
    )
}