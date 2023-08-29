import React, { useState, useEffect } from 'react';
import Header from '../header';
import { Back_Index } from '@/pages/constants';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { MemoData } from '../memoData';



// CORSリクエストを作成するヘルパー関数
const makeCROSRequest = (request : any) => {
  request.credentials = "include"
  request.headers = {
      "Access-Control-Allow-Credentials": "true",
  }
  return request
}

interface MemoModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (memo: MemoData) => void;
}

const MemoModal = ({ show, onClose, onCreate }: MemoModalProps) => {
  // ユーザーID，IDがない．ファイルはある
  const url = Back_Index + "/api/memo"
  const [memoTitle, setMemoTitle] = useState('');
  const [memoComment, setMemoComment] = useState('');
  const [userId, setUserId] = useState("");
  const [memoId, setMemoId] = useState(0);
  const [memoTags, setMemoTags] = useState<string[]>([]);
  const [memoFiles, setMemoFiles] = useState<File[]>([]);
  const [memoFileInputs, setMemoFileInputs] = useState([0]); // 初期値として1つのファイル入力欄を表示

  // ユーザー情報を取得するためのEffect
  const getUser = useEffect( () => {
    console.log("GetUser")
    fetch(Back_Index+"/api/login", makeCROSRequest({}))
    .then( res => res.json() )
    .then( data => {
        setUserId(data.id)
        console.log("userId:", userId) })
  }, []);

  const OnSubmitEvent = (e : any ) => {
    e.preventDefault()
    const date : Date = new Date()

    const form: HTMLFormElement = document.getElementById("create") as HTMLFormElement;
    const formData: FormData = new FormData(form)

    for ( const tag  of memoTags ){
        formData.append("tags", tag)
    }
    formData.append("username", userId)
    formData.append("dateiso", date.toISOString())
    console.log("username:",userId)

    const req = {
        method: "POST",
        body: formData,
    }

    fetch( url, makeCROSRequest(req))
    .then(res => {
        if ( !res.ok ) {
            res.text().then( text => {
                console.log(text)
            })
            return
        }
        console.log("Fetch Finished")
    })
    .catch( err => {
        console.error(err)
    })

    onClose();
 }



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setMemoFiles(fileArray); // ファイル情報を設定
    }
  };
  // const handleCreate = () => {
  //   const newMemo: MemoData = {
  //     title: memoTitle,
  //     tag: memoTags,
  //     comment: memoComment,
  //     date: Date.now(),
  //     // files: files,
  //   };

  //   onCreate(newMemo);
  //   setTitle('');
  //   setTags([]);
  //   setComment('');
  //   setFiles([]); // ファイル情報をクリア
  //   onClose();
  // };

  const resetForm = () => {
    setMemoTitle('');
    setMemoTags([]);
    setMemoComment('');
    setMemoFileInputs([0]); // ファイル入力欄の数も初期化
  };
  const handleCloseAndReset = () => {
    onClose();
    resetForm();
  };



  // const addFileInput = () => {
  //   setFileInputs([...fileInputs, fileInputs.length]); // 新しいファイル入力欄を追加
  // };


  return (
    <Modal show={show} onHide={handleCloseAndReset}>
    {/* <Modal> */}
      <Modal.Header closeButton>
        <Modal.Title>新しいメモを作成</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="create">
          <Form.Group controlId="title">
            <Form.Label>タイトル</Form.Label>
            <Form.Control
              type="text"
              placeholder="タイトルを入力..."
              value={memoTitle}
              name="memotitle"
              onChange={(e) => setMemoTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="tags">
            <Form.Label>タグ</Form.Label>
            <Form.Control
              type="text"
              placeholder="タグを入力 ( 半角スペース区切り ) ..."
              value={memoTags.join(' ')}
              onChange={(e) => setMemoTags(e.target.value.split(' '))}
            />
          </Form.Group>
          <Form.Group controlId="comment">
            <Form.Label>コメント</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="コメントを入力..."
              value={memoComment}
              name="memocontent"
              onChange={(e) => setMemoComment(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="files">
            <Form.Label>ファイル</Form.Label>
            {memoFileInputs.map((inputIndex) => (
              <Form.Control key={inputIndex} type="file" onChange={handleFileChange} name="thumbnail"/>
            ))}
            {/* <Button variant="secondary" onClick={addFileInput}>
              ファイルを追加
            </Button> */}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={OnSubmitEvent}>作成</Button>
        {/* <Button variant="secondary" onClick={onClose}>
          閉じる
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};

export default MemoModal;
