import Header from "./components/header";
import { useState } from "react";
import { Back_Index } from "./constants";
import { MemoData, memos } from "./components/memoData";
import { sortedTags, tagCountMap } from "./components/tagCount";
import TagToggle from "./components/tagToggle";
import SearchBar from "./components/searchBar";
import { handleSearch } from "./components/searchUtils";
import PopupForm from "./components/popUpForm";

export default function Home() {

  const title = "TestApp"
  const message = "TagAppの左側の実装画面"

  // const url = Back_Index+"/test"
  // const [ data, setData] = useState({Name:"DefaultName", English:"DeafultEnlgish", Text:"DefaultText"})
  const [showTags, setShowTags] = useState(false); // 初期値をfalseに設定
  const handleToggleTags = () => {
    setShowTags(!showTags);
  };

  const [searchResults, setSearchResults] = useState<MemoData[]>([]);
  
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
  const handleCreateMemo = (memo: MemoData) => {
    // 新しいメモの作成処理を実装
    console.log("新しいメモを作成:", memo);
  };




return (
  <div>
    <Header title={title} />
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

    {/* コメント一覧を表示 */}
    {/* <div>
      <h4>コメント一覧</h4>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            <h6>{comment.title}</h6>
            <p>コメント: {comment.comment}</p>
            <p>タグ: {comment.tag.join(", ")}</p>
            <p>日時: {formatDate(comment.date)}</p>
          </li>
        ))}
      </ul>
    </div> */}

    {/* タグ一覧を表示 */}
    <div>
      <h4><TagToggle onToggle={handleToggleTags} showTags={showTags} /></h4>
      {showTags && (
      <div>
        <ul>
          {sortedTags.map((tag, index) => (
            <li key={index}>
              {/* <h3>タグ: {tag}</h3> */}
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
      {/* ... 他のコンテンツ ... */}
    </div>
  
  </div>
);

  // const onBtnClick = () => {
  //   fetch(url)
  //     .then(res=> res.json())
  //     .then(res=> {
  //       console.log(res);
  //       setData(res);}
  //       )
  //     .catch(err => {
  //       console.log("Fetch Error")
  //     })
  // }

  // return (
  //   <div>
  //     <Header title={title}/>
  //     <h1 className="bg-primar px-3 text-white display-4 text-right">Fetch Test App</h1>
  //     <div className="container">
  //       <div className="alert alert-primary text-left">
  //         <p className="h5">{message}.</p>
  //       </div>

  //       <table className="table bg-white">
  //         <thead className="table-dark">
  //         <tr><th>Name</th><th>English</th><th>Text</th></tr>
  //         </thead>
  //         <tbody>
  //           <tr>
  //             <td>{data.Name }</td>
  //             <td>{data.English}</td>
  //             <td>{data.Text}</td>
  //           </tr>
  //         </tbody>
  //       </table>
      
  //       <button className="btn btn-primary" onClick={onBtnClick}>GetData</button> 
  //     </div>
  //     <h4>ここから検索画面</h4>

  //   </div>
  // )
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
