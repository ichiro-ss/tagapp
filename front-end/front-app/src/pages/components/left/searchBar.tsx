import React, { useState, useEffect } from "react";
import Header from "../header";
import { Back_Index } from "../../constants";
import Link from "next/link";
import { MemoData, convertMemoJsonArrayToMemoDataArray } from "../memoData";
import styles from '../../../styles/leftside.module.css';
import { makeCROSRequest } from "@/lib/helper";

interface searchBarProps{
  username: string;
  setMemos: any
}

// type SearchBarProps = {
//   onSearch: (searchTerm: string, tagOnly: boolean, andOperator: boolean) => void;
// };

const SearchBar: React.FC<searchBarProps> = (props) => {
  const [searchTerm, setSearchTerm] = useState<string[]>([]);
  const [tagOnly, setTagOnly] = useState(false);
  const [andOperator, setAndOperator] = useState(true);
  const searchTermCondition = `検索条件: ${searchTerm}`
  const searchTagonlyCondition = `タグのみ: ${tagOnly}`
  const searchAndoperatorCondition = `AND検索: ${andOperator}`;

  const [memoTags, setTags] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [startDate, setStratDate] = useState<Date>();


  // すべてのメモを検索する関数
  const OnSearchAllMemo= () => {
    const url = Back_Index+`/api/memosearch`

    const form = new FormData()

    const pageidx = 1
    const pageAmount = 1000

    form.append("username", props.username)
    form.append("pageidx", pageidx.toString())
    form.append("pageItemAmount", pageAmount.toString())

    const req = {
        method: "PUT",
        body : form,
    }

    fetch( url, makeCROSRequest(req))
    .then(res => {
        if ( !res.ok ) {
            res.text().then( text => {
                console.log(text)
            })
            return
        } else {
            res.json().then( data => {
                console.log("検索に成功しました")
                console.log(data)
                const memos = convertMemoJsonArrayToMemoDataArray(data)
                props.setMemos(memos)
            })
        }
    })
    .catch( err => {
        console.error(err)
    })
  }
  // オプションを指定してメモを検索する関数
  const OnSearchOption= (e : any ) => {
    e.preventDefault()
    const url = Back_Index+`/api/memosearch`

    const form = new FormData()

    const pageidx = 1
    const pageAmount = 1000

    // tagOnlyの真偽によって，タグのみ検索か全文かを決定.
    if(tagOnly){
      for ( const tag of searchTerm) {
        form.append("tags", tag)
        console.log(tag)
      }
    }else{
      for ( const keyword of searchTerm ) {
        form.append("keywords", keyword)
      }
    }
    // andOperatorの真偽によって，AND検索かOR検索かを決定.
    if(andOperator){
      form.append("keywordoption", "and")
      form.append("tagoption", "and")
    }else{
      form.append("keywordoption", "or")
      form.append("tagoption", "or")
    }
    console.log(searchTerm)



    form.append("username", props.username)
    form.append("pageidx", pageidx.toString())
    form.append("pageItemAmount", pageAmount.toString())
    if ( typeof(startDate) !== "undefined" ) {
        form.append("startdate", (startDate).toISOString())
    }

    const req = {
        method: "PUT",
        body : form,
    }

    fetch( url, makeCROSRequest(req))
    .then(res => {
        if ( !res.ok ) {
            res.text().then( text => {
                console.log(text)
            })
            return
        } else {
            res.json().then( data => {
                console.log("検索に成功しました")
                console.log(data)
                const memos = convertMemoJsonArrayToMemoDataArray(data)
                props.setMemos(memos)
            })
        }
    })
    .catch( err => {
        console.error(err)
    })
  }


  return (
    <form>
      <div className={styles["search-bar-container"]}>
        <div>
          <input
            type="text"
            placeholder="ワードを入力..."
            value={searchTerm.join(' ')}
            onChange={(e) => {setSearchTerm(e.target.value.split(' '));}}
          />
          <button onClick={OnSearchOption}>検索</button>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={tagOnly}
              onChange={() => setTagOnly(!tagOnly)}
            />
            タグのみ検索
          </label>
          <label>
            <input
              type="checkbox"
              checked={andOperator}
              onChange={() => setAndOperator(!andOperator)}
            />
            AND検索
          </label>
        </div>
        <div>
          {/* 検索条件の表示 */}
          <p> {searchTermCondition}</p>
          <p> {searchTagonlyCondition}</p>
          <p> {searchAndoperatorCondition}</p>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
