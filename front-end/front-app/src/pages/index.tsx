import Header from "./components/header";
import { useState } from "react";
import { Back_Index } from "./constants";

export default function Home() {

  const title = "TestApp"
  const message = "APIの接続を試すためのテストページ"

  const url = Back_Index+"/test"
  const [ data, setData] = useState({Name:"DefaultName", English:"DeafultEnlgish", Text:"DefaultText"})

  const onBtnClick = () => {
    fetch(url)
      .then(res=> res.json())
      .then(res=> {
        console.log(res);
        setData(res);}
        )
      .catch(err => {
        console.log("Fetch Error")
      })
  }

  return (
    <div>
      <Header title={title}/>
      <h1 className="bg-primar px-3 text-white display-4 text-right">Fetch Test App</h1>
      <div className="container">
        <div className="alert alert-primary text-left">
          <p className="h5">{message}.</p>
        </div>

        <table className="table bg-white">
          <thead className="table-dark">
          <tr><th>Name</th><th>English</th><th>Text</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.Name }</td>
              <td>{data.English}</td>
              <td>{data.Text}</td>
            </tr>
          </tbody>
        </table>
      
        <button className="btn btn-primary" onClick={onBtnClick}>GetData</button> 
      </div>
    </div>
  )
}
