import React from "react";
import styles from '../../styles/index.module.css';

interface FooterProps {
  className?: string; // className プロパティを追加
};

const Footer: React.FC<FooterProps> = (props) => {
    return (
      <div>
      <footer className={`${styles["footer"]} ${props.className || ''} `}>
        <p>&copy; 2023 Your Company Name</p>
      </footer>
      </div>
    )
  };
  
  export default Footer;