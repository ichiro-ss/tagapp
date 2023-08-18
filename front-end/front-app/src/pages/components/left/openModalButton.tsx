import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../../../styles/leftside.module.css';

type OpenModalButtonProps = {
    onOpen: () => void;
};

const OpenModalButton: React.FC<OpenModalButtonProps> = ({ onOpen }) => (
  <Button className={styles["new-memo-button"]} variant="secondary" onClick={onOpen}>
    新規メモを作成
  </Button>
);

export default OpenModalButton;
