import React from 'react';
import iconPath from '../../../../public/icon.jpg';
import styles from '../../../styles/leftside.module.css';

type UserContainerProps = {};
  
  const UserContainer: React.FC<UserContainerProps> = () => {
    const username="user123";
    return (
    <div className={styles.userContainer}>
      <img src={iconPath.src} alt="User Icon" className={styles.userIcon}/>
      <p className={styles.userId}>{username}</p>
    </div>
  );
};

export default UserContainer;
