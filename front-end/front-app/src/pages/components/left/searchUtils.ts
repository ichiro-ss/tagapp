import { MemoData, memos } from "../memoData";

export const handleSearch = (
  searchTerm: string,
  tagOnly: boolean,
  andOperator: boolean,
  memos: MemoData[],
  setSearchResults: React.Dispatch<React.SetStateAction<MemoData[]>>
) => {
  const searchTerms = searchTerm.trim().toLowerCase().split(/\s+/);

  const searchList = memos.map((memo) => {
    let content: string[] = []; // 初期化

    if (tagOnly) {
      content = memo.tag.map((tag) => tag.toLowerCase());
    } else {
      content = [
        memo.title.toLowerCase(),
        memo.comment.toLowerCase(),
        ...memo.tag.map((tag) => tag.toLowerCase()),
      ];
    }

    return content;
  });

  const filteredMemos = memos.filter((memo, index) => {
    const matchesAllTerms = searchTerms.every((term) =>
    searchList[index].some((content) => content.includes(term))
  );
  
  const matchesAnyTerm = searchTerms.some((term) =>
    searchList[index].some((content) => content.includes(term))
  );

    return andOperator ? matchesAllTerms : matchesAnyTerm;
  });


//   console.log("searchTerm:", searchTerm);
//   console.log("searchList:");
//   searchList.forEach((content, index) => {
//     console.log(`Memo ${index}:`, content);
//   });
  
  setSearchResults(filteredMemos);
};
