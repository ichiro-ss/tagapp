import Header from "./components/header";
import { useEffect, useState } from "react";
import { Back_Index } from "./constants";
import { LeftSideComponent } from "./components/leftsideComponent";
import MemoList from "./components/memoList";
import { useRouter } from 'next/router'
import { useCookies } from "react-cookie";
import { useForm , SubmitHandler} from "react-hook-form";

export default function login() {
  const [isLoggedIn, setIsLoggedIn]=useState<boolean|undefined>(undefined);
  const [cookies, setCookie, removeCookie]=useCookies(["userid","password"]); 
  const router=useRouter();

  const { register, handleSubmit, setValue , reset} = useForm<{
    uid:string;
    pw:string;
    btn:string;
  }>();
  const {name:uid} = register('uid');
  const {name:pw} = register('pw');
  useEffect( ()=>{
    if(!!isLoggedIn){
      setCookie("userid",uid);
      setCookie("password",pw);
      router.push("/");
    }
  }, [isLoggedIn]
  );


  const config={
  }

  const onSubmit:SubmitHandler<{
    uid:string;
    pw:string;
    btn:string;
  }> =(data)=>{
    const axios = require('axios').default;
    if( data.btn==='Submit'){
      axios.post();
    }
    if( data.btn==='Login'){
      axios.put();
    }
    else{
      console.log("error");
      console.log(data);
    }
  }

  return (
    <>
      <Header title="login"/>
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <form className="w-50"  onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group mb-3">
            <span className="input-group-text" id="userIDForm">UserID</span>
            <input type="text" {...register('uid')} className="form-control" aria-label="userid" aria-describedby="userIDform"/>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="pwForm">Password</span>
            <input type="password" {...register('pw')} className="form-control"  aria-describedby="pwForm"/>
          </div>
          <div className="btn-toolbar d-flex justify-content-center">
            <button type="submit" value="submit" className="btn btn-primary me-2" onClick={ ()=>(setValue('btn','Submit') )}>Submit</button>
            <button type="submit" value="login" className="btn btn-primary me-2" onClick={ ()=>(setValue('btn','Login') )}>Login</button>
            <button type="reset" className="btn btn-primary" onClick={()=>reset()}>Reset</button>
          </div>
        </form>
      </div>
    </>
  );
}
