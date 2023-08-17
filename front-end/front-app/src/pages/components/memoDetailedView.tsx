import Head from 'next/head'
import { useState } from 'react';
import useSWR from 'swr';
import Memo from './memoTypeDef';

export default function MemoDetailedView({memo}: {memo?:Memo}): JSX.Element{
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
        { memo.tags.map((tag) => "#"+tag+" ") }
      </div>
    </div>
  );
}

function PreviewDoc({filepath}:{filepath:string}): JSX.Element{
  if(filepath===""){ return <></>; }

  const fetcher = (url:string) => fetch(url).then(r => r.blob())
  const {data, error, isLoading}=useSWR(filepath, fetcher);

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
