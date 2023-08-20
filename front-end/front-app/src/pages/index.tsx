import Header from "./components/header";
import Footer from "./components/footer";
import { useState, useEffect } from "react";
import { Back_Index } from "./constants";
import { LeftSideComponent } from "./components/leftsideComponent";
import MemoList from "./components/memoList";
import MemoDetailedView from "./components/memoDetailedView";
import { MemoData,memos } from "./components/memoData";
import { useRouter } from 'next/router';

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

  return (
    <div>
      <div className="container-fluid content">
          <div className="row vh-100">
            <Header title={title} className="fixed-top"/>
            <div className="left-column col-md-auto h-75 border-0 overflow-auto">
              <LeftSideComponent memos={memos} username={username}/>
            </div>
            <div className="center-column col h-75 border-0 overflow-auto">
              <MemoList setSelectedMemo={setSelectedMemo}/>
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
