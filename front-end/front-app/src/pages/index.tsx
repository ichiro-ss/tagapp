import Header from "./components/header";
import { useState } from "react";
import { Back_Index } from "./constants";
import { LeftSideComponent } from "./components/leftsideComponent";
import MemoList from "./components/memoList";

export default function Home() {

  const title = "TestApp"
  const message = "TagAppの左側の実装画面"

return (
  <div>
    <Header title={title} />
    {/* 左側表示 */}
    <div>
    <LeftSideComponent />
    </div>
    {/* メモ表示 */}
    <div>
      <MemoList />
    </div>
  
  //</div>
);

}

