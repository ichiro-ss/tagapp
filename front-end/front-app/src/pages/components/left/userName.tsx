import React from 'react';
import iconPath from '../../../../public/icon.jpg';
import styles from '../../../styles/leftside.module.css';

type UserContainerProps = {
  username : string
};
  
  const UserContainer: React.FC<UserContainerProps> = (props) => {
    return (
    <div className={styles.userContainer}>
      <img src={iconPath.src} alt="User Icon" className={styles.userIcon}/>
      <p className={styles.userId}>{props.username}</p>
    </div>
  );
};

export default UserContainer;
