import Header from "./components/header";
import { useState } from "react";
import { Back_Index } from "./constants";
import { LeftSideComponent } from "./components/leftsideComponent";
import MemoList from "./components/memoList";
import MemoDetailedView from "./components/memoDetailedView";
import { MemoData } from "./components/memoData";

export default function Home() {

  const title = "TestApp"
  const [selectedMemo, setSelectedMemo] = useState<MemoData | undefined>(undefined);

  return (
    <div>
        <Header title={title} />
        <div className="container-fluid">
          <div className="row vh-100 overflow-auto">
            <div className="col-2 h-100 border left-column overflow-auto">
              <LeftSideComponent />
            </div>
            <div className="center-column col-5 h-100 border overflow-auto">
              <MemoList setSelectedMemo={setSelectedMemo}/>
            </div>
            <div className="right-column col-5 h-100 border overflow-auto">
              <MemoDetailedView memo={selectedMemo}/>
            </div>
          </div>
        </div>
    </div>
  );
}
