import React, { useState } from "react";

type TagToggleProps = {
  onToggle: () => void;
  showTags: boolean;
};

const TagToggle: React.FC<TagToggleProps> = ({ onToggle, showTags }) => {
  return (
    <div>
      <button
        onClick={onToggle}
        style={{ border: "none", background: "none", color: "#808080"}} // ボーダーと背景を非表示に
        >
        {showTags ? "タグ一覧▲" : "タグ一覧▼"}
      </button>
    </div>
  );
};

export default TagToggle;
