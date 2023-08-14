import { error } from "console"
import Header from "../components/header"
import { Back_Index } from "../constants"
import { FormEvent } from "react"

const formDatatoURLSerachParams = (formData : FormData) : URLSearchParams => {
     const params :[string, string][]= []

     for ( const [key, value] of formData.entries() ) {
        params.push([key.toString(), value.toString()])
     }

     return new URLSearchParams(params)
}

export default function Home() {
    const title = "Test Page"
    const url = Back_Index+"/api/login"

    const onCreateBtn = ( e : any )  => {
        
        e.preventDefault()
        const form : HTMLFormElement = e.target.closest("form") as HTMLFormElement; 

        const formData : FormData = new FormData(form)
        const urlParams = formDatatoURLSerachParams(formData)


        fetch(url , {
            method: "POST",
            body: urlParams,
        })
        .then( (res : Response) => {
            if ( !res.ok ) {
                res.json().then((data)=>(console.log(data)))
                return;
            }
            console.log("アカウントの作成に成功しました")
        })
        .catch(error => {
            console.log("Error")
            console.error(error)
        })
    }

    const onLoginBtn = ( e : any) => {
        e.preventDefault()

        const form : HTMLFormElement = e.target.closest("form") as HTMLFormElement; 

        const formData : FormData = new FormData(form)
        const urlParams = formDatatoURLSerachParams(formData)
        console.log(urlParams.toString())

        fetch(url , {
            method: "PUT",
            body: urlParams,
        })
        .then( (res : Response) => {
            if ( !res.ok ) {
                res.json().then((data)=>(console.log(data)))
                return;
            }
            console.log("Loginに成功しました")
            return res.json()
        })
        .then( (data) => {
            console.log("josn:", data)
        })
        .catch(error => {
            console.log("Error")
            console.error(error)
        })
    }
    
    return (
        <div>
            <Header title={title}/>
            <h1 className="bg-primar">Test Page</h1>
            <form>
            <div className="form-group mb-3">
                <label >Username</label>
                <input type="text" className="ml-3 form-control" placeholder="Username" name="username" aria-label="Username"/>
            </div>
            <div className="form-group mb-3">
                <label >Password</label>
                <input type="text" className="ml-3 form-control" placeholder="Password" name="password" aria-label="Username"/>
            </div>
            <button type="submit" className="btn btn-primary"  onClick={onCreateBtn}>Create</button>
            <button type="submit" className="btn btn-primary"  onClick={onLoginBtn}>Login</button>
            </form>
        </div>

    )
}