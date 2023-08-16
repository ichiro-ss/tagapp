import React, { useState } from "react";

type SearchBarProps = {
  onSearch: (searchTerm: string, tagOnly: boolean, andOperator: boolean) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tagOnly, setTagOnly] = useState(false);
  const [andOperator, setAndOperator] = useState(true);

  const handleSearch = () => {
    onSearch(searchTerm, tagOnly, andOperator);
  };

  return (
    <div>
        <div>
        <input
            type="text"
            placeholder="ワードを入力..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
    </div>
  );
};

export default SearchBar;
