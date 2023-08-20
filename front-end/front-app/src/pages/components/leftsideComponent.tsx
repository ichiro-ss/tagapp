import { useState, useEffect } from "react";
import { MemoData, memos } from "./memoData";
import TagToggle from "./left/tagToggle";
import SearchBar from "./left/searchBar";
import { handleSearch } from "./left/searchUtils";
import OpenModalButton from "./left/openModalButton";
import MemoModal from "./left/memoModal";
import styles from '../../styles/leftside.module.css';
import useSWR from 'swr';
import { Back_Index } from "../constants";

interface Props {
  memos:MemoData[],
  username:string
};

export const LeftSideComponent = ( props:Props ) => {

  const tempMemos:MemoData[]=memos;
  // メモ検索画面
  const [searchResults, setSearchResults] = useState<MemoData[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const onSearch = (
    searchTerm: string,
    tagOnly: boolean,
    andOperator: boolean
  ) => {
    const actualSearchTerm = selectedTag !== null ? selectedTag : searchTerm;
    handleSearch(actualSearchTerm, tagOnly, andOperator, tempMemos, setSearchResults);
  };
  // タグ一覧
  const handleTagClick = (tag: string) => {
    setSearchTerm(tag); // タグを検索バーに表示
    setSelectedTag(tag); // タグがクリックされたら検索バーにタグをセットする
    setSearchResults([]); // タグをクリックしたら検索結果をリセット
    onSearch(tag, false, true); // 検索バーの内容も更新するために onSearch を呼び出す
  };

  const [showTags, setShowTags] = useState(false);
  const handleToggleTags = () => {
    setShowTags(!showTags);
  };

  interface tagsMetaData { tagsCountMap:{[tag: string]:number}, sortedTags:string[] };
  // const [tagsInfo, setTagsInfo] = useState<tagsMetaData>({tagsCountMap:{},sortedTags:new Array});
  // useEffect(()=>{
  //   const tagCount=tagCounter(props.memos);
  //   const sortedTags=tagSorter(tagCount);
  //   setTagsInfo( {tagsCountMap:tagCount, sortedTags:sortedTags} )
  //   },
  // [props.memos])

  const tagAPIUrl=Back_Index+"/api/tags";
  const fetcher = (url:string) => fetch(url).then(r => r.json())
  const {data:tmpTagData, error, isLoading}=useSWR(tagAPIUrl, fetcher);
  if(!isLoading){
    console.log("tag fetch ok:");
    console.log(tmpTagData)
  }

  let tagsInfo:tagsMetaData
  if(tmpTagData!=null){
    tagsInfo=( {tagsCountMap:tmpTagData, sortedTags:tagSorter(tmpTagData)});
  }else{
    tagsInfo=( {tagsCountMap:{"tag_is_empty":0}, sortedTags:tagSorter({"tag_is_empty":0})});
  }


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

  //ユーザー名とアイコンの表示
  const userId = 'user123';

  return (
    <div>
      {/* 検索バーの配置 */}
      <SearchBar 
        onSearch={onSearch}
        initialSearchTerm={selectedTag !== null ? selectedTag : searchTerm}
        />
      {/* {searchResults.length >= 0 && (
        <div>
          <ul>
            {searchResults.map((comment, index) => (
              <li key={index}>
                <h6>{comment.title}</h6>
                <p>タグ: {comment.tag.join(", ")}</p>
                <p>日時: {formatDate(comment.date)}</p>
                <p>コメント: {comment.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )} */}

      {/* タグ一覧を表示 */}
      <div className={styles["tag-list-container"]}>
        <h4><TagToggle onToggle={handleToggleTags} showTags={showTags} /></h4>
        {showTags && (
          <div className={styles["tag-list"]}>
            <ul>
              {tagsInfo.sortedTags.map((tag, index) => (
                <li key={index}>
                  <button
                    className={styles["tag-button"] + (selectedTag === tag ? ` ${styles.selectedTag}` : "")}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}({tagsInfo.tagsCountMap[tag]})
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

function tagCounter(memos:MemoData[]){
  const tagCountMap: { [tag: string]: number } = {};
  memos.forEach((comment) => {
    comment.tag.forEach((tag) => {
      tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
    });
  });
  return tagCountMap;
}

function tagSorter( tagCountMap:{[tag: string]:number}){
  // タグの出現回数で降順にソート
  const sortedTags = Object.keys(tagCountMap).sort(
    (a, b) => tagCountMap[b] - tagCountMap[a]
  );
  return Object.keys(tagCountMap).sort( (a, b) => tagCountMap[b] - tagCountMap[a]);
}

  
function formatDate(date: number): string {
  const year = Math.floor(date / 10000000000);
  const month = Math.floor((date % 10000000000) / 100000000);
  const day = Math.floor((date % 100000000) / 1000000);
  const hour = Math.floor((date % 1000000) / 10000);
  const minute = Math.floor((date % 10000) / 100);
  const second = date % 100;
  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}
  

