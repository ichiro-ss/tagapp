import Header from "./components/header";
import { useState } from "react";
import { Back_Index } from "./constants";
import { LeftSideComponent } from "./components/leftsideComponent";
import MemoList from "./components/memoList";
import { useRouter } from 'next/router'

export default function Home() {
  const title = "TestApp"
  const [isLoggedIn , setIsLoggedIn]=useState<boolean|undefined>(undefined);
  const axios = require('axios').default;
  const router = useRouter();

  axios.get('__/api/login__')
    .then(
      function (r:any):void{
        if(r.status===200){
          setIsLoggedIn(true);
        }
        else router.push("./login");
      }
    ).catch( (error:any) =>{ 
      console.log("error");
      router.push("./login");
    }
  )
  
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
      
      //</div>
    );
  }
  else{
    return <></>;
  }

}
