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
    PRIMARY KEY (id),
    FOREIGN KEY fk_memo_userId(userId) REFERENCES user(userid) ON UPDATE CASCADE ON DELETE CASCADE
);
-- Tagのテーブル生成
CREATE TABLE tag (
    id INT AUTO_INCREMENT NOT NULL,
    tagName VARCHAR(128) NOT NULL,
    userId VARCHAR(50),
    memosNum INT,
    PRIMARY KEY (id),
    FOREIGN KEY fk_tag_userId(userId) REFERENCES user(userid) ON UPDATE CASCADE ON DELETE CASCADE
);
-- TagMapのテーブル生成
CREATE TABLE tag_map (
    id INT AUTO_INCREMENT NOT NULL,
    tagId INT,
    memoId INT,
    PRIMARY KEY (id),
    FOREIGN KEY fk_tagmap_tagId(tagId) REFERENCES tag(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY fk_tagmap_memoId(memoId) REFERENCES memo(id) ON UPDATE CASCADE ON DELETE CASCADE
);
