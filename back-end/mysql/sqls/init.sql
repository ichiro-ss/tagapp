USE tagapp_database;
-- Userのテーブル生成
CREATE TABLE user (
    userid VARCHAR(50) PRIMARY KEY,
    hashpass VARCHAR(255) NOT NULL
);
-- Memoのテーブル生成
CREATE TABLE memo (
    id INT AUTO_INCREMENT NOT NULL,
    title     VARCHAR(128) NOT NULL,
	userId    VARCHAR(50) NOT NULL,
	content VARCHAR(255),
	createdAt DATETIME,
	picPath   VARCHAR(128),
    PRIMARY KEY (id)
);
-- Tagのテーブル生成
CREATE TABLE tag (
    id INT AUTO_INCREMENT NOT NULL,
    tagName VARCHAR(128) NOT NULL,
    userId VARCHAR(50),
    memosNum INT,
    PRIMARY KEY (id)
);
-- TagMapのテーブル生成
CREATE TABLE tag_map (
    id INT AUTO_INCREMENT NOT NULL,
    tagId INT,
    memoId INT,
    PRIMARY KEY (id)
);
