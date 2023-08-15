USE tagapp_database;

-- Userのテーブル生成
CREATE TABLE user (
    userid VARCHAR(50) PRIMARY KEY,
    hashpass VARCHAR(255) NOT NULL
);

-- Memoのテーブル生成
CREATE TABLE memo {
    id INT AUTO_INCREMENT PRIMARY KEY,
    title     VARCHAR(128) NOT NULL,
	userId    INT NOT NULL,
	content VARCHAR(255),
	createdAt DATETIME,
	picPath   VARCHAR(128)
}

--Tagのテーブル生成
CREATE TABLE tag {
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(128) NOT NULL,
    user_id INT,
    memos_num INT
}

--TagMapのテーブル生成
CREATE TABLE tag {
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag_id INT,
    memo_id INT
}
