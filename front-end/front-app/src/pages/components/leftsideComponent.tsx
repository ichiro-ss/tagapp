import Header from "./header";
import { Back_Index } from "../constants";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MemoData} from "./memoData";
import TagToggle from "./left/tagToggle";
import SearchBar from "./left/searchBar";
//import { handleSearch } from "./left/searchUtils";
import OpenModalButton from "./left/openModalButton";
import MemoModal from "./left/memoModal";
import styles from '../../styles/leftside.module.css';
import { convertTagJsonArrayToTagDataArray } from "./tagData";
import { TagData } from "./tagData";

interface LeftsideComponentProps{
  setMemos: any
  memos: MemoData[]
}

// CORSリクエストを生成するヘルパー関数
const makeCROSRequest = (request: any) => {
  request.credentials = "include"
  request.headers = {
      "Access-Control-Allow-Credentials": "true",
  }
  return request
}

export const LeftSideComponent: React.FC<LeftsideComponentProps> = (props) => {
  const url = Back_Index + "/api/memo";
  const [userId, setUserId] = useState("");
  

  // ユーザー情報を取得するためのEffect
  const getUser = useEffect(() => {
    console.log("GetUser")
    fetch(Back_Index + "/api/login", makeCROSRequest({}))
        .then(res => res.json())
        .then(data => {
            setUserId(data.id)
            console.log("userId:", userId)
        })
  }, []);
  // メモ検索画面
  const [searchResults, setSearchResults] = useState<MemoData[]>([]);
  const [showTags, setShowTags] = useState(false);
  

  // 新規メモを作成するポップアップ画面
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleCreateMemo = (memo: MemoData) => {
    console.log('新しいメモを作成:', memo);
  };


  const [sortedTags, setSortedTags] = useState<TagData[]>([])

  useEffect( () => {
    const url = Back_Index+`/api/tags?username=${userId}`
    fetch(url, makeCROSRequest({}))
    .then( res => {
      if (res.ok) {
        res.json()
        .then(data=>{
          setSortedTags(convertTagJsonArrayToTagDataArray(data)) 
        })
      }
    })
  }, [props.memos])


  return (
    <div>
      {/* 検索バーの配置 */}
        <SearchBar username={userId} setMemos={props.setMemos}/>


      {/* タグ一覧を表示 */}
      <div className={styles["tag-list-container"]}>
      <h4><TagToggle onToggle={() => setShowTags(!showTags)} showTags={showTags} /></h4>
        {showTags && (
          <div className={styles["tag-list"]}>
            <ul>
              {sortedTags.map((tag, index) => (
                <li key={index}>
                  <button
                    className={styles["tag-button"]}

                  >
                    {tag.tagName}({tag.memoNum})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* メモ作成ボタン and メモ作成モーダル */}
      <OpenModalButton onOpen={handleOpenModal} />
      <MemoModal show={showModal} onClose={handleCloseModal} onCreate={handleCreateMemo} />

    </div>

  );
};

  
function formatDate(date: number): string {
  const year = Math.floor(date / 10000000000);
  const month = Math.floor((date % 10000000000) / 100000000);
  const day = Math.floor((date % 100000000) / 1000000);
  const hour = Math.floor((date % 1000000) / 10000);
  const minute = Math.floor((date % 10000) / 100);
  const second = date % 100;
  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}
  

