import Head from 'next/head'
import { useState } from 'react';
import useSWR from 'swr';
import Button from 'react-bootstrap/Button';
import {MemoData} from './memoData';
import { Back_Index } from '../constants';

const makeCROSRequest = (request : any) => {
  request.credentials = "include"
  request.headers = {
      "Access-Control-Allow-Credentials": "true",
  } 
  return request
}


//memoEditor, memoRemoverの実装はあと
export default function MemoDetailedView({memo, memoEditor, memoRemover}: {memo?:MemoData, memoEditor?:any, memoRemover?:any}): JSX.Element{
  if(memo == null){
    return(
      <div className='detailedView m-1'>
      </div>
    );
  }

  return(
    <div className='detailedView m-1'>
      <div className='title'>
        <h1> {memo.title} </h1>
        <Button onClick={memoRemover} variant="outline-danger" className="float-end m-2" >
        🗑
        </Button>
        <Button onClick={memoEditor} variant="outline-secondary" className="float-end m-2" >
        ⚙
        </Button>
      </div>
      { memo.userid &&
        <div className='author'>
          <h2> Author : {memo.userid} </h2>
        </div>
      }
      { memo.filepath && <PreviewDoc filepath={memo.filepath} /> }
      <div className='body'>
        { memo.comment.split("\n").map((e) => <div>{e}</div>) }
      </div>
      <br/>
      <div className='date'>
        {memo.date}
      </div>
      <div className='tags'>
        { memo.tag.map((tag:string) => "#"+tag+" ") }
      </div>
    </div>
  );
}

function PreviewDoc({filepath}:{filepath:string}): JSX.Element{
  if(filepath===""){ return <></>; }
  const  fname = Back_Index+filepath
  console.log("fname=",fname)
  const fetcher = (url:string) => fetch(url,makeCROSRequest({})).then(r => r.blob())
  const {data, error, isLoading}=useSWR(fname, fetcher);

  if(!!error) return <div>failed to load</div>;
  if(isLoading) return <div>loading...</div>;

  if(data==null) return <></>;
  // if(data.type==="application/pdf"){
  //   return(
  //     <div>
  //       <canvas id='pdf-canvas'>
  //       </canvas>
  //     </div>
  //   );
  // }
  return(
    <div>
      <iframe id='inlineDoc' title='Inline image' className='w-100' src={URL.createObjectURL(data)}/>
      {/* PDFはこのままでは見ずらい PDF.js? */}
    </div>
  );
}
