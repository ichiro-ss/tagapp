import Header from "./components/header";
import Footer from "./components/footer";
import { useState } from "react";
import { Back_Index } from "./constants";
import { LeftSideComponent } from "./components/leftsideComponent";
import MemoList from "./components/memoList";
import MemoDetailedView from "./components/memoDetailedView";
import { MemoData } from "./components/memoData";
//import '../styles/index.module.css';


export default function Home() {

  const title = "TagApp"
  const [selectedMemo, setSelectedMemo] = useState<MemoData | undefined>(undefined);

  return (
    <div>
      <div className="container-fluid content">
          <div className="row vh-100">
            <Header title={title} className="fixed-top"/>
            <div className="left-column col-md-auto h-75 border-0 overflow-auto">
              <LeftSideComponent />
            </div>
            <div className="center-column col h-75 border-0 overflow-auto">
              <MemoList setSelectedMemo={setSelectedMemo}/>
            </div>
            <div className="right-column col h-75 border-0 overflow-auto">
              <MemoDetailedView memo={selectedMemo}/>
            </div>
            <Footer className="fixed-bottom"/>
          </div>
        </div>  
    </div>
  );
}
