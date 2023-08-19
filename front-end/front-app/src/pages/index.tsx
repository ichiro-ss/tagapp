import Header from "./components/header";
import Footer from "./components/footer";
import { useState } from "react";
import { Back_Index } from "./constants";
import { LeftSideComponent } from "./components/leftsideComponent";
import MemoList from "./components/memoList";
import MemoDetailedView from "./components/memoDetailedView";
import { MemoData } from "./components/memoData";
// import '../styles/index.module.css';


export default function Home() {

  const title = "TagApp"
  const [selectedMemo, setSelectedMemo] = useState<MemoData | undefined>(undefined);

  return (
    <div className="page-container">
        
        <div className="container-fluid content">
        <Header title={title} />
          <div className="row">
            <div className="left-column col-md-auto border overflow-auto">
              <LeftSideComponent />
            </div>
            <div className="center-column col border overflow-auto">
              <MemoList setSelectedMemo={setSelectedMemo}/>
            </div>
            <div className="right-column col border overflow-auto">
              <MemoDetailedView memo={selectedMemo}/>
            </div>
          </div>
          <Footer />
        </div>
        
    </div>
  );
}
