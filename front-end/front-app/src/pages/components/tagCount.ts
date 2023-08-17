import Memo from "./memoTypeDef"
import { memos } from "./memoData";

export const tagCountMap: { [tag: string]: number } = {};

// タグの出現回数を集計
memos.forEach((comment) => {
    comment.tags.forEach((tag) => {
      tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
    });
});

// タグの出現回数で降順にソート
export const sortedTags = Object.keys(tagCountMap).sort(
    (a, b) => tagCountMap[b] - tagCountMap[a]
);