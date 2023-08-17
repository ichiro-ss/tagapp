import React, { useState } from "react";
import { memos } from "./memoData"; // ←ここをmemos全部じゃなくて，検索で引っかかったやつだけにする？
import styles from "../../styles/memoList.module.css";
import Memo from "./memoTypeDef"
 
const MemoList = ( {setSelectedMemo}:{setSelectedMemo:any}) => {
    const handleMemoClick = (memo: Memo) => {
      setSelectedMemo(memo);
    };
  
    return (
      <div className={styles.memoList}>
        <div className={styles.searchResult}>
            ホーム：
        </div>
        <div className={styles.sortFormat}>
            ソート：時刻順（昇順）
        </div>
        <div className={styles.displayFormat}>
            表示形式：
        </div>
          {memos.map((memo, index) => (
            <div className={styles.memoContainer}>
                <button
                    key={index}
                    className={styles.memoButton}
                    onClick={() => handleMemoClick(memo)}
                >
                    <h3 className={styles.memoTitle}>{truncateTitle(memo.title)}</h3>
                    <p className={styles.memoTags}>{truncateTags(renderTags(memo.tags))}</p>
                    <p className={styles.memoComment}>{truncateComment(memo.comment)}</p>
                    <p className={styles.memoDate}>{formatDate(memo.date)}</p>
                </button>
              </div>
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
