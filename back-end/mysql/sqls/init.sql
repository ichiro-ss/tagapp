USE tagapp_database;

CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50)
);

INSERT INTO users (id , username) VALUES(1, "user1");
INSERT INTO users (id , username) VALUES(2, "user2");