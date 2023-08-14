USE tagapp_database;

-- Userのテーブル生成
CREATE TABLE user (
    userid VARCHAR(50) PRIMARY KEY,
    hashpass VARCHAR(255) NOT NULL
);
