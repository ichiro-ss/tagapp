import Header from "./components/header";
import MemoView from "./memoView";
export default function Home(){
  const title = "Detailed View"

  return (
    <div>
      <Header title={title}/> 
      <MemoView/>
    </div>
  );
}