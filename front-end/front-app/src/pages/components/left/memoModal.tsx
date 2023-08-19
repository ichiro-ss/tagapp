import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { MemoData } from '../memoData';

interface MemoModalProps {
    show: boolean;
    onClose: () => void;
    onCreate: (memo: MemoData) => void;
}

const MemoModal = ({ show, onClose, onCreate }: MemoModalProps) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileInputs, setFileInputs] = useState([0]); // 初期値として1つのファイル入力欄を表示

  const handleCreate = () => {
    const newMemo: MemoData = {
      title: title,
      tag: tags,
      comment: comment,
      date: Date.now(),
      files: files,
    };

    onCreate(newMemo);
    setTitle('');
    setTags([]);
    setComment('');
    setFiles([]); // ファイル情報をクリア
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setTags([]);
    setComment('');
    setFileInputs([0]); // ファイル入力欄の数も初期化
  };
  const handleCloseAndReset = () => {
    onClose();
    resetForm();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray); // ファイル情報を設定
    }
  };

  const addFileInput = () => {
    setFileInputs([...fileInputs, fileInputs.length]); // 新しいファイル入力欄を追加
  };


  return (
    <Modal show={show} onHide={handleCloseAndReset}>
    <Modal.Header closeButton>
      <Modal.Title>新しいメモを作成</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="title">
          <Form.Label>タイトル</Form.Label>
          <Form.Control
            type="text"
            placeholder="タイトルを入力..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="tags">
          <Form.Label>タグ</Form.Label>
          <Form.Control
            type="text"
            placeholder="タグを入力（カンマ区切り）..."
            value={tags.join(',')}
            onChange={(e) => setTags(e.target.value.split(','))}
          />
        </Form.Group>
        <Form.Group controlId="comment">
          <Form.Label>コメント</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="コメントを入力..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="files">
          <Form.Label>ファイル</Form.Label>
          {fileInputs.map((inputIndex) => (
            <Form.Control key={inputIndex} type="file" onChange={handleFileChange} />
          ))}
          <Button variant="secondary" onClick={addFileInput}>
            ファイルを追加
          </Button>
        </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleCreate}>
          作成
        </Button>
        <Button variant="secondary" onClick={onClose}>
          閉じる
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MemoModal;
