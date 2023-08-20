import Header from "./components/header";
import Footer from "./components/footer";
import { useState, useEffect } from "react";
import { Back_Index } from "./constants";
import { LeftSideComponent } from "./components/leftsideComponent";
import MemoList from "./components/memoList";
import MemoDetailedView from "./components/memoDetailedView";
import { MemoData } from "./components/memoData";
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';

const makeCROSRequest = (request : any) => {
  request.credentials = "include"
  request.headers = {
      "Access-Control-Allow-Credentials": "true",
  } 
  return request
}



export default function Home() {
  const title = "TagApp"
  const [isLoggedIn , setIsLoggedIn]=useState<boolean|undefined>(undefined);
  const [username , setUsername]=useState<string>("");
  const [memos, setMemos]=useState<MemoData[]>([]);
  const [selectedMemo, setSelectedMemo] = useState<MemoData | undefined>(undefined);
  const axios = require('axios').default;
  const router = useRouter();

  const url=Back_Index+'/api/login';

  const logoutHandler= ()=>{
    fetch(Back_Index+'/api/logout',makeCROSRequest({method:"GET"})).then( (res:any)=>{
      if(res.status!==200){ console.log("logout fail"); }
      else{ setIsLoggedIn(false); }
  })}
  
  fetch(url,makeCROSRequest({method:'GET'}))
    .then( (res:Response)=>{
      let resData;
      if(!res.ok){
        console.log("ng");
        setIsLoggedIn(false);
      }
      else{
        console.log("ok");
        setIsLoggedIn(true);
        res.json().then( data=>{ console.log(data); setUsername(data.id);} );
      }
    })
    .catch( (error:Error) =>{
      console.log("Error occurs in API call");
      console.log(error);
      setIsLoggedIn(false);
  });

  // 開発中は無効化
  useEffect( ()=>{
    // if(isLoggedIn!=null && !isLoggedIn) router.push("/login");
  }, [isLoggedIn]
  );

  if(isLoggedIn==undefined){
    return <>Loading...</>;
  }

  if(!isLoggedIn){
    //開発中につき無効化
    // router.replace("/login")
    // return <>Failed</>;
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
  const memoArray = (data :any): MemoData[] => {
    const memos:MemoData[] = [];
    // console.log("data=",data.length)
    if(data===null){
      return memos;
    }
    for(let i = 0;i<data.length;i++){
      memos.push(convertJsonToMemoData(data[i]));
    }
    return memos;
  }
  // すべてのメモを検索する関数
  const OnSearchAllMemo= () => {
    const url = Back_Index+`/api/memosearch`

    const form = new FormData()

    const pageidx = 1
    const pageAmount = 1000

    form.append("username", username)
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
                const memos = memoArray(data)
                setMemos(memos)
            })
        }
    })
    .catch( err => {
        console.error(err)
    })

    useEffect(() => {
      OnSearchAllMemo();
    },[]);
  }
  


  return (
    <div>
      <div className="container-fluid content">
          <div className="row vh-100">
            <Header title={title} className="fixed-top"/>
            <div className="left-column col-md-auto h-75 border-0 overflow-auto">
              <LeftSideComponent setMemos={setMemos}/>
            </div>
            <div className="center-column col h-75 border-0 overflow-auto">
              <MemoList memos={memos} setSelectedMemo={setSelectedMemo}/>
            </div>
            <div className="right-column col h-75 border-0 overflow-auto">
              <MemoDetailedView memo={selectedMemo}/>
            </div>
            <Footer className="fixed-bottom"/>
          </div>
        </div>
    </div>
  );
}
