import { useState } from "react";
import { MemoData, memos } from "./memoData";

interface PopupFormProps {
  onClose: () => void;
  onCreateMemo: (memo: MemoData) => void;
}

const PopupForm: React.FC<PopupFormProps> = ({ onClose, onCreateMemo }) => {
  const [newMemo, setNewMemo] = useState({
    title: "",
    tags: [] as string[],
    comment: "",
  });

  const handleNewMemoChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewMemo((prevMemo) => ({
      ...prevMemo,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    setNewMemo((prevMemo) => ({
      ...prevMemo,
      tags: [...prevMemo.tags, ""],
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    setNewMemo((prevMemo) => {
      const newTags = [...prevMemo.tags];
      newTags[index] = value;
      return {
        ...prevMemo,
        tags: newTags,
      };
    });
  };

  const handleCreateMemo = () => {
    const memo: MemoData = {
      title: newMemo.title,
      tag: newMemo.tags,
      comment: newMemo.comment,
      date: Date.now(),
    };
    onCreateMemo(memo);
    setNewMemo({
      title: "",
      tags: [],
      comment: "",
    });
    onClose();
  };

  return (
    <div className="popup">
        <div className="inputTitle">
            <input
                type="text"
                name="title"
                placeholder="タイトルを入力..."
                value={newMemo.title}
                onChange={handleNewMemoChange}
            />
        </div>
        <div className="inputTags">
            {newMemo.tags.map((tag, index) => (
                <input
                    type="text"
                    key={index}
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                />
            ))}
            <button className="tagButton" onClick={handleAddTag}>タグを追加</button>
        </div>
        <div className="inputComment">
            <textarea
                name="comment"
                placeholder="コメントを入力..."
                value={newMemo.comment}
                onChange={handleNewMemoChange}
            />
        <button onClick={handleCreateMemo}>メモを作成</button>
        <button onClick={onClose}>閉じる</button>
        </div>
    </div>
  );
};

export default PopupForm;
