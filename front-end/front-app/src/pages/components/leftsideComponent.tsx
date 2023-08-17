import { useState } from "react";
import { MemoData, memos } from "./memoData";
import { sortedTags, tagCountMap } from "./left/tagCount";
import TagToggle from "./left/tagToggle";
import SearchBar from "./left/searchBar";
import { handleSearch } from "./left/searchUtils";
//import PopupForm from "./left/popUpForm";
//import 'bootstrap/dist/css/bootstrap.min.css';
import OpenModalButton from "./left/openModalButton";
import MemoModal from "./left/memoModal";


export const LeftSideComponent = () => {

  // メモ検索画面
  const [searchResults, setSearchResults] = useState<MemoData[]>([]);
  const onSearch = (
    searchTerm: string,
    tagOnly: boolean,
    andOperator: boolean
  ) => {
    handleSearch(searchTerm, tagOnly, andOperator, memos, setSearchResults);
  };

  // タグ一覧
  const [showTags, setShowTags] = useState(false); // 初期値をfalseに設定
  const handleToggleTags = () => {
    setShowTags(!showTags);
  };

  const [showPopup, setShowPopup] = useState(false);
  const handleOpenPopup = () => {
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  // const handleCreateMemo = (memo: MemoData) => {
  //   // 新しいメモの作成処理を実装
  //   console.log("新規メモを作成:", memo);
  // };

  // 新規メモを作成するポップアップ画面
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleCreateMemo = (memo: MemoData) => {
    // 新しいメモの作成処理を実装
    console.log('新しいメモを作成:', memo);
  };

  return (
    <div>
      {/* 検索バーの配置 */}
      <SearchBar onSearch={onSearch} /> 
      {searchResults.length > 0 && (
        <div>
          <h4>検索結果</h4>
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
      )}

      {/* タグ一覧を表示 */}
      <div>
        <h4><TagToggle onToggle={handleToggleTags} showTags={showTags} /></h4>
        {showTags && (
        <div>
          <ul>
            {sortedTags.map((tag, index) => (
              <li key={index}>
                <p>{tag}({tagCountMap[tag]})</p>
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
  

