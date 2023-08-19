import { useState, useEffect } from "react";
import { MemoData, memos } from "./memoData";
import { sortedTags, tagCountMap } from "./left/tagCount";
import TagToggle from "./left/tagToggle";
import SearchBar from "./left/searchBar";
import { handleSearch } from "./left/searchUtils";
//import PopupForm from "./left/popUpForm";
//import 'bootstrap/dist/css/bootstrap.min.css';
import OpenModalButton from "./left/openModalButton";
import MemoModal from "./left/memoModal";
import styles from '../../styles/leftside.module.css'; // スタイルを読み込む
import UserContainer from "./left/userName";




export const LeftSideComponent = () => {

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
    handleSearch(actualSearchTerm, tagOnly, andOperator, memos, setSearchResults);
  };
  // タグ一覧
  const handleTagClick = (tag: string) => {
    setSearchTerm(tag); // タグを検索バーに表示
    setSelectedTag(tag); // タグがクリックされたら検索バーにタグをセットする
    setSearchResults([]); // タグをクリックしたら検索結果をリセット
    onSearch(tag, false, true); // 検索バーの内容も更新するために onSearch を呼び出す
  };
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newSearchTerm = e.target.value;
  //   setSearchTerm(newSearchTerm);
  //   onSearch(newSearchTerm, false, false); // 検索バーの内容も更新するために onSearch を呼び出す
  // };
  const [showTags, setShowTags] = useState(false); // 初期値をfalseに設定
  const handleToggleTags = () => {
    setShowTags(!showTags);
  };

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

  //ユーザー名とアイコンの表示
  const userId = 'user123';

  return (
    <div>
      {/* 検索バーの配置 */}
      <SearchBar 
        onSearch={onSearch}
        initialSearchTerm={selectedTag !== null ? selectedTag : searchTerm}
        />
      {searchResults.length >= 0 && (
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
      <div className={styles["tag-list-container"]}>
        <h4><TagToggle onToggle={handleToggleTags} showTags={showTags} /></h4>
        {showTags && (
          <div className={styles["tag-list"]}>
            <ul>
              {sortedTags.map((tag, index) => (
                <li key={index}>
                  <button
                    className={styles["tag-button"] + (selectedTag === tag ? ` ${styles.selectedTag}` : "")}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}({tagCountMap[tag]})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ユーザー名とアイコンの表示 */}
      <div>
        <UserContainer />
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
  

