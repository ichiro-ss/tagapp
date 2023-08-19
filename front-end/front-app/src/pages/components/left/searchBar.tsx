import React, { useState, useEffect } from "react";
import styles from '../../../styles/leftside.module.css'; 

type SearchBarProps = {
  onSearch: (searchTerm: string, tagOnly: boolean, andOperator: boolean) => void;
  initialSearchTerm: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [tagOnly, setTagOnly] = useState(false);
  const [andOperator, setAndOperator] = useState(true);
  const searchTermCondition = `検索条件: ${searchTerm}`
  const searchTagonlyCondition = `タグのみ: ${tagOnly}`
  const searchAndoperatorCondition = `AND検索: ${andOperator}`;

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleSearch = () => {
    console.log(searchTermCondition);
    onSearch(searchTerm, tagOnly, andOperator);
  };


  return (
    <div className={styles["search-bar-container"]}>
      <div>
        <input
          type="text"
          placeholder="ワードを入力..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <button onClick={handleSearch}>検索</button>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={tagOnly}
            onChange={() => setTagOnly(!tagOnly)}
          />
          タグのみ検索
        </label>
        <label>
          <input
            type="checkbox"
            checked={andOperator}
            onChange={() => setAndOperator(!andOperator)}
          />
          AND検索
        </label>
      </div>
      <div>
        {/* 検索条件の表示 */}
        <p> {searchTermCondition}</p>
        <p> {searchTagonlyCondition}</p>
        <p> {searchAndoperatorCondition}</p>
      </div>
    </div>
  );
};

export default SearchBar;
