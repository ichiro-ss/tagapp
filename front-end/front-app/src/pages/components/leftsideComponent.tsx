import { useState } from "react";
import Memo from "./memoTypeDef"
import { memos } from "./memoData";
import { sortedTags, tagCountMap } from "./tagCount";
import TagToggle from "./tagToggle";
import SearchBar from "./searchBar";
import { handleSearch } from "./searchUtils";
import PopupForm from "./popUpForm";

export const LeftSideComponent = () => {
    const [showTags, setShowTags] = useState(false); // 初期値をfalseに設定
  const handleToggleTags = () => {
    setShowTags(!showTags);
  };

  const [searchResults, setSearchResults] = useState<Memo[]>([]);
  
  const onSearch = (
    searchTerm: string,
    tagOnly: boolean,
    andOperator: boolean
  ) => {
    handleSearch(searchTerm, tagOnly, andOperator, memos, setSearchResults);
  };

  const [showPopup, setShowPopup] = useState(false);
  const handleOpenPopup = () => {
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleCreateMemo = (memo: Memo) => {
    // 新しいメモの作成処理を実装
    console.log("新しいメモを作成:", memo);
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
              <p>タグ: {comment.tags.join(", ")}</p>
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
    
    {/* 新規メモ作成画面 */}
    <div>
      <button onClick={handleOpenPopup}>新しいメモを作成</button>
      {showPopup && (
        <PopupForm onClose={handleClosePopup} onCreateMemo={handleCreateMemo} />
      )} 
      </div>
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
  

