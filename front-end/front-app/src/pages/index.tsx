import Header from "./components/header";
import Footer from "./components/footer";
import { useState, useEffect } from "react";
import { Back_Index } from "./constants";
import { LeftSideComponent } from "./components/leftsideComponent";
import MemoList from "./components/memoList";
import MemoDetailedView from "./components/memoDetailedView";
import { MemoData, convertMemoJsonArrayToMemoDataArray } from "./components/memoData";
import { useRouter } from 'next/router';
import { error } from "console";
import { makeCROSRequest } from "@/lib/helper";

const setInitMemoMemos = async (username : string, setFunc : ( x : MemoData[])=>void ) => {

  const pageIdx = 1
  const pageAmount = 100
  const url = Back_Index+`/api/memosearch?username=${username}&pageidx=${pageIdx}&pageItemAmount=${pageAmount}`
  let result : MemoData[] = [] 

  fetch(url, makeCROSRequest({}))
  .then( (res:Response) => {
    if (res.ok ) {
      res.json()
      .then( data => {
        console.log(data)
        result = convertMemoJsonArrayToMemoDataArray(data)
        setFunc(result)
      })
    } 
  })
  .catch( err => {
    console.error(err)
  })

  return result
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
    
    useEffect( () => {
      const loginURL=Back_Index+"/api/login"
      fetch(loginURL, makeCROSRequest({}))
      .then( (res : Response) => {
        if ( res.ok ) {
  
          res.json()
          .then( async (data) => {
            console.log("userData=", data)
            console.log("id=", data.id)
            setUsername(data.id)
            await setInitMemoMemos(data.id, setMemos)
          })
        }
      })
      console.log("initMount")
  
    }, [])
  
  fetch(url,makeCROSRequest({method:'GET'}))
  .then( (res:Response)=>{
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
      if(isLoggedIn!=null && !isLoggedIn) router.push("/login");
  }, [isLoggedIn]
  );
  
  if(isLoggedIn==undefined){
    return <>Loading...</>;
  }
  
  if(!isLoggedIn){
    //開発中につき無効化
    router.replace("/login")
    return <>Failed</>;
  }
  
  
  return (
    <div>
      <div className="container-fluid content">
          <div className="row vh-100">
            <Header title={title} className="fixed-top"/>
            <div className="left-column col-md-auto h-75 border-0 overflow-auto">
              <LeftSideComponent memos={memos} setMemos={setMemos}/>
            </div>
            <div className="center-column col h-75 border-0 overflow-auto">
              <MemoList memos={memos} setSelectedMemo={setSelectedMemo}/>
            </div>
            <div className="right-column col h-75 border-0 overflow-auto">
              <MemoDetailedView memo={selectedMemo}/>
            </div>
            <Footer username={username} className="fixed-bottom"/>
          </div>
        </div>
    </div>
  );
}
