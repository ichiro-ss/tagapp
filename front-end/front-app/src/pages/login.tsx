import Header from "./components/header";
import { useState } from "react";
import { Back_Index } from "./constants";
import { LeftSideComponent } from "./components/leftsideComponent";
import MemoList from "./components/memoList";
import { useRouter } from 'next/router'

export default function login() {
  
  return (
    <>
      <Header title="login"/>
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div className="w-50 ">
          <div className="input-group mb-3">
            <span className="input-group-text" id="userIDForm">UserID</span>
            <input type="text" className="form-control" aria-label="userid" aria-describedby="userIDform"/>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="pwForm">Password</span>
            <input type="password" className="form-control"  aria-describedby="pwForm"/>
          </div>
          <div className="btn-toolbar d-flex justify-content-center">
            <button type="button" className="btn btn-primary me-2">Submit</button>
            <button type="button" className="btn btn-primary">Login</button>
          </div>
        </div>
      </div>
    </>
  );
}
