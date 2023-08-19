import React, { useState } from "react";
import { memos } from "./memoData"; // ←ここをmemos全部じゃなくて，検索で引っかかったやつだけにする？
import styles from "../../styles/memoList.module.css";
import Memo from "./memoTypeDef"
 
const MemoList = ( {setSelectedMemo}:{setSelectedMemo:any}) => {
    const [sortByNewest, setSortByNewest] = useState(true); // 初期値を新しい順に設定
    const [displayInGrid, setDisplayInGrid] = useState(true); // 初期値をグリッド表示に設定

    const handleMemoClick = (memo: Memo) => {
      setSelectedMemo(memo);
    };

    // const newSortedMemos = [...memos].sort((a, b) => b.date - a.date);
    // const oldSortedMemos = [...memos].sort((a, b) => b.date - a.date);
    const sortedMemos = [...memos].sort((a, b) => {
        // ソート方法に応じて比較
        if (sortByNewest) {
          return b.date - a.date;
        } else {
          return a.date - b.date;
        }
      });

    const toggleSortOrder = () => {
        setSortByNewest((prevSort) => !prevSort); // ソート方法をトグル
    };
    const toggleDisplayFormat = () => {
        setDisplayInGrid((grid) => !grid); // 表示形式をトグル
    };


  
    return (
       // ソート方法，表示形式で変える
       <div className={styles.memoList}>
       {/* ヘッダー */}
       <div className={styles.header}>
           <div className={styles.searchResult}>ホーム：</div>
           <button className={styles.sortFormat} onClick={toggleSortOrder}>
                {sortByNewest ? "ソート：新しい順" : "ソート：古い順"}
            </button>
       </div>

          {sortedMemos.map((memo, index) => (
            <button
                key={index}
                className={`${styles.memoContainer} ${displayInGrid ? styles.memoContainerGrid : styles.memoContainerBar}`}
                onClick={() => handleMemoClick(memo)}
            >
                {/* タイトル */}
                <h3 className={`${styles.memoTitle} ${displayInGrid ? styles.memoTitleGrid : styles.memoTitleBar}`}>
                    {displayInGrid ? truncateTitle(memo.title): truncateTitleBar(memo.title)}
                </h3>
                {/* タグ */}
                <p className={`${styles.memoTags} ${displayInGrid ? styles.memoTagsGrid : styles.memoTagsBar}`}>
                    {truncateTags(renderTags(memo.tag))}
                </p>
                {/* コメント */}
                {displayInGrid && (
                    <p className={styles.memoCommentGrid}>
                        {truncateComment(memo.comment)}
                    </p>
                )}
                {/* <p className={`${styles.memoComment} ${displayInGrid ? styles.memoCommentGrid : styles.memoCommentBar}`}>
                    {truncateComment(memo.comment)}
                </p> */}
                {/* 日付 */}
                {displayInGrid && (
                    <p className={styles.memoDate}>
                        {formatDate(memo.date)}
                    </p>
                )}
            </button>
          ))}
        {/* <div className={styles.selectedMemoContainer}>
          {selectedMemo && (
            <div className={styles.selectedMemo}>
              <h3>{selectedMemo.title}</h3>
              <p>{renderTags(selectedMemo.tag)}</p>
              <p>{selectedMemo.comment}</p>
              <p>Date: {formatDate(selectedMemo.date)}</p>
            </div>
          )}
        </div> */}
        
        {/* フッター */}
        <div className={styles.footer}>
            <button className={styles.displayFormat} onClick={toggleDisplayFormat}>
                {displayInGrid ? "表示形式：グリッド" : "表示形式：横長"}
            </button>
        </div>

      </div>
    );
  };

// タイトルが11文字以上のとき，9文字目まで+"…"の形式にフォーマットする関数
const truncateTitle = (title: string) => {
    if (title.length > 10) {
        return title.substring(0, 9) + "…";
    }
    return title;
  };

// 表示形式がバーのとき，タイトルが30文字以上のとき，88文字目まで+"…"の形式にフォーマットする関数
const truncateTitleBar = (title: string) => {
    if (title.length > 30) {
        return title.substring(0, 28) + "…";
    }
    return title;
  };

// コメントが18文字以上のとき，16文字目まで+"…"の形式にフォーマットする関数
const truncateComment = (comment: string) => {
    if (comment.length > 31) {
        return comment.substring(0, 29) + "…";
    }
    return comment;
};

// タグが18文字以上のとき，16文字目まで+"…"の形式にフォーマットする関数
const truncateTags = (tags: string) => {
    if (tags.length > 18) {
        return tags.substring(0, 16) + "…";
    }
    return tags;
};

// タグの表記を "#タグ1 #タグ2" の形式にフォーマットする関数
const renderTags = (tags: string[]) => {
    const tagStrings = tags.map(tag => `#${tag}`).join(" ");
    return `${tagStrings}`;
  };

// 例: 20230816103045 を "2023/08/16 10:30:45" の形式にフォーマットする関数
const formatDate = (dateNumber: number) => {
  const dateStr = dateNumber.toString();
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const hour = dateStr.substring(8, 10);
  const minute = dateStr.substring(10, 12);
  const second = dateStr.substring(12, 14);
  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
};

export default MemoList;
