import { error } from "console"
import Header from "../components/header"
import { Back_Index } from "../constants"
import { FormEvent } from "react"
import  Link  from "next/link"

const formDatatoURLSerachParams = (formData: FormData): URLSearchParams => {
    const params: [string, string][] = []

    for (const [key, value] of formData.entries()) {
        params.push([key.toString(), value.toString()])
    }

    return new URLSearchParams(params)
}

const makeCROSRequest = (request : any) => {
    request.credentials = "include"
    request.headers = {
        "Access-Control-Allow-Credentials": "true",
    } 
    return request
}

export default function Home() {
    const title = "Test Page"
    const url = Back_Index + "/api/login"

    const onGetUserBtn = () => {
        fetch(url, makeCROSRequest({}) 
            )
            .then((res: Response) => {
                if (!res.ok) {
                    res.json().then((data) => (console.log(data)));
                    return;
                }
                return res.json()
            })
            .then((data) => {
                console.log("Get User : ", data)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const onCreateBtn = (e: any) => {

        e.preventDefault()
        const form: HTMLFormElement = e.target.closest("form") as HTMLFormElement;

        const formData: FormData = new FormData(form)
        const urlParams = formDatatoURLSerachParams(formData)


        fetch(url, {
            method: "POST",
            body: urlParams,
        })
            .then((res: Response) => {
                if (!res.ok) {
                    res.json().then((data) => (console.log(data)))
                    return;
                }
                console.log("アカウントの作成に成功しました")
            })
            .catch(error => {
                console.log("Error")
                console.error(error)
            })
    }

    const onLoginBtn = (e: any) => {
        e.preventDefault()

        const form: HTMLFormElement = e.target.closest("form") as HTMLFormElement;

        const formData: FormData = new FormData(form)
        const urlParams = formDatatoURLSerachParams(formData)
        console.log(urlParams.toString())
        const req = {method: "PUT", body: urlParams}

        fetch(url, makeCROSRequest(req)
        )
            .then((res: Response) => {
                if (!res.ok) {
                    res.json().then((data) => (console.log(data)))
                    return;
                }
                console.log("Loginに成功しました")
                return res.json()
            })
            .then((data) => {
                console.log("json:", data)
            })
            .catch(error => {
                console.log("Error")
                console.error(error)
            })
    }

    const onLogoutBtn = () => {
        const url = Back_Index+"/api/logout"
        fetch(url, makeCROSRequest({}))
        .then((res: Response) => {
            if ( res.ok) {
                console.log("Logoutに成功しました")
            } else {
                console.log("Logoutに失敗しました")
            }
        }).catch( err => {
            console.error(err)
        })
    }

    return (
        <div>
            <Header title={title} />
            <h1 className="bg-primar">Test Page</h1>
            <form>
                <div className="form-group mb-3">
                    <label >Username</label>
                    <input type="text" className="ml-3 form-control" placeholder="Username" name="username" aria-label="Username" />
                </div>
                <div className="form-group mb-3">
                    <label >Password</label>
                    <input type="text" className="ml-3 form-control" placeholder="Password" name="password" aria-label="Username" />
                </div>
                <button type="submit" className="btn btn-primary" onClick={onCreateBtn}>Create</button>
                <button type="submit" className="btn btn-primary" onClick={onLoginBtn}>Login</button>
                <button type="button" className="btn btn-primary" onClick={onGetUserBtn}>Get User</button>
                <button type="button" className="btn btn-primary" onClick={onLogoutBtn}>Get User</button>
            </form>
            <Link href="/tests/mymemo">
            <p>move to mymemo page →</p>
            </Link>
        </div>

    )
}