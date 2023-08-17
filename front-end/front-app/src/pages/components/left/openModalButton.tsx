import React from 'react';
import { Button } from 'react-bootstrap';

type OpenModalButtonProps = {
    onOpen: () => void;
};

const OpenModalButton: React.FC<OpenModalButtonProps> = ({ onOpen }) => (
  <Button variant="secondary" onClick={onOpen}>
    新規メモを作成
  </Button>
);

export default OpenModalButton;
