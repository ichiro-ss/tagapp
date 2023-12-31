import Header from "./components/header";
import { useState } from "react";
import { Back_Index } from "./constants";
import { useRouter } from 'next/router'
import { useForm , SubmitHandler} from "react-hook-form";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


const makeCROSRequest = (request : any) => {
  request.credentials = "include"
  request.headers = {
      "Access-Control-Allow-Credentials": "true",
  }
  return request
}

export default function login() {
  const [isLoggedIn, setIsLoggedIn]=useState<boolean|undefined>(undefined);
  const [submitResult, setSubmitResult]=useState<boolean|undefined>(undefined);
  const router=useRouter();
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const handleCloseLogout = () => setShowLogout(false);
  const handleShowLogout = () => setShowLogout(true);
  const [showSubmit, setShowSubmit] = useState<boolean>(false);
  const handleCloseSubmit = () => setShowSubmit(false);
  const handleShowSubmit = () => setShowSubmit(true);

  const { register, handleSubmit, setValue , reset} = useForm<{
    uid:string;
    pw:string;
    btn:string;
  }>();

  const onSubmit:SubmitHandler<{
    uid:string;
    pw:string;
    btn:string|undefined;
  }> =(data)=>{
    const url=Back_Index+'/api/login';
    const req ={
      method:'GET',
      body: new URLSearchParams(
        { username:data.uid, password:data.pw, }
      ),
    };

    if( data.btn==='Submit'){
      req.method='POST';
      fetch(url,makeCROSRequest(req))
        .then( (res:Response)=>{
          if(!res.ok){
            console.log("Submittion fail");
            res.json().then((data) => (console.log(data)));
          }
          else{
            console.log("Submittion success");
            handleShowSubmit();
          }
        })
        .catch( (error:Error) =>{
          console.log("Error occurs in submit");
          console.log(error);
      });
    }
    else if( data.btn==='Login'){
      req.method='PUT';
      fetch(url,makeCROSRequest(req))
        .then( (res:any)=>{
          if(res.status!==200){
            console.log("Login fail");
            console.log(res.data);
          }
          else{
            console.log("Login success");
            router.push("/");
          }
        })
        .catch( (error:Error) =>{
          console.log("Error occurs in login");
          console.log(error);
      });
    }
    else{
      console.log("strange request" + data.btn);
      console.log(data);
    }
    data.btn=undefined;
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
            <button type="submit" className="btn btn-primary me-2" onClick={ ()=>(setValue('btn','Submit') )}>Submit</button>
            <button type="submit" className="btn btn-primary me-2" onClick={ ()=>(setValue('btn','Login') )}>Login</button>
            <button type="reset" className="btn btn-primary me-2" onClick={()=>reset()}>Reset</button>
            <button type="button" className="btn btn-primary me-2" onClick={ ()=>{
              fetch(Back_Index+'/api/login',makeCROSRequest({method:"GET"})).then( (res:any)=>{
                if(res.status!==200){ console.log("get fail"); }
                res.json().then( (data:any)=>console.log(data) )
            })}}>GET</button>
            <button type="button" className="btn btn-primary me-2" onClick={ ()=>{
              fetch(Back_Index+'/api/logout',makeCROSRequest({method:"GET"})).then( (res:any)=>{
                if(res.status!==200){ console.log("logout fail"); }
                else{ handleShowLogout(); }
            })}}>Logout</button>
          </div>
        </form>
      </div>
      <Modal show={showLogout}>
          {/* <Modal.Header closeButton>
            <Modal.Title>Notice</Modal.Title>
          </Modal.Header> */}
        <Modal.Body>
          <h3>Logout</h3><br/>
          <Button variant="secondary" onClick={handleCloseLogout}>
              Close
          </Button>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogout}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
      <Modal show={showSubmit}>
        <Modal.Body>
          <h3>Submit success!!</h3><br/>
          <Button variant="primary" onClick={handleCloseSubmit}>
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
