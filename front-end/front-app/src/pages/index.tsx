import Header from "./components/header";
import { useState, useEffect } from "react";
import { Back_Index } from "./constants";
import { LeftSideComponent } from "./components/leftsideComponent";
import MemoList from "./components/memoList";
import { useRouter } from 'next/router'

const makeCROSRequest = (request : any) => {
  request.credentials = "include"
  request.headers = {
      "Access-Control-Allow-Credentials": "true",
  } 
  return request
}

export default function Home() {
  const title = "TestApp"
  const [isLoggedIn , setIsLoggedIn]=useState<boolean|undefined>(undefined);
  const axios = require('axios').default;
  const router = useRouter();

  const url=Back_Index+'/api/login';
  
  fetch(url,makeCROSRequest({method:'GET'}))
    .then( (res:Response)=>{
      if(!res.ok){
        console.log("ng");
        setIsLoggedIn(false);
      }
      else{
        console.log("ok");
        setIsLoggedIn(true);
      }
      res.json().then((data) => (console.log(data)));
    })
    .catch( (error:Error) =>{
      console.log("Error occurs in API call");
      console.log(error);
      setIsLoggedIn(false);
  });

  useEffect( ()=>{
    if(isLoggedIn!=null && !isLoggedIn) router.push("/login");
  }, [isLoggedIn]
  );

  if(isLoggedIn==undefined){
    return <>Loading...</>;
  }

  if(isLoggedIn){
    return (
      <div>
        <Header title={title} />
        {/* 左側表示 */}
        <div>
        <LeftSideComponent />
        </div>
        {/* メモ表示 */}
        <div>
          <MemoList />
        </div>
      </div>
    );
  }
  else{
    router.replace("/login")
    return <>Failed</>;
  }

}
