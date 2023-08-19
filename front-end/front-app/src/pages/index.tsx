import Header from "./components/header";
import { useState, useEffect } from "react";
import { Back_Index } from "./constants";
import { LeftSideComponent } from "./components/leftsideComponent";
import MemoList from "./components/memoList";
import { useRouter } from 'next/router'

export default function Home() {
  const title = "TestApp"
  const [isLoggedIn , setIsLoggedIn]=useState<boolean|undefined>(undefined);
  const axios = require('axios').default;
  const router = useRouter();

  const url=Back_Index+'/api/login';
  const req ={
    method:'GET',
    creadentials:"include",
    headers: {
      "Access-Control-Allow-Credentials": "true",
    },
  };

  fetch(url,req)
    .then( (res:Response)=>{
      if(!res.ok){
        console.log(req);
        console.log(res);
        setIsLoggedIn(false);
      }
      else{
        setIsLoggedIn(true);
      }
      res.json().then((data) => (console.log(data)));
    })
    .catch( (error:Error) =>{
      console.log("Error occurs in API call");
      console.log(error);
      setIsLoggedIn(false);
  });

  /* ↓ こっちはうごく */
  // axios.get(Back_Index+"/api/login",{
  //   withCredentials:true,
  //   creadentials:"include",
  //   headers: {
  //     "Access-Control-Allow-Credentials": "true",
  //   }
  // })
  //   .then(
  //     function (r:any):void{
  //       if(r.status===200){
  //         setIsLoggedIn(true);
  //       }else{
  //         setIsLoggedIn(false);
  //       }
  //     }
  //   ).catch( (error:any) =>{
  //     setIsLoggedIn(false);
  //     console.log("wrong api request");
  //   }
  // )

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
    return <>Failed</>;
  }

}
