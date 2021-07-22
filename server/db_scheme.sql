--CREATE DATABASE codeevaluationdb;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS submissions;

DROP TABLE IF EXISTS user_submissions_insertUsername;
DROP TABLE IF EXISTS user_submissions_admin;


CREATE TABLE users(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(100) NOT NULL,
    password   VARCHAR(100) NOT NULL
);

INSERT INTO users (username, password)
    VALUES ('insertUsername', 'insertHashedPassword');  -- temporary user 1
INSERT INTO users (username, password)
    VALUES ('admin', 'admin');                          -- temporary user 2

CREATE TABLE submissions(
    index      INT NOT NULL,
    compiled   BOOLEAN NOT NULL,
    result     json NOT NULL,
    codepath   VARCHAR(100) NOT NULL,
    taskname   VARCHAR(100) NOT NULL,
    username   VARCHAR(100) NOT NULL,
    score      real
);

CREATE TABLE user_submissions_insertUsername(
    index      INT NOT NULL,
    task       VARCHAR(100) NOT NULL,
    time       timestamp default current_timestamp,
    name       VARCHAR(100) NOT NULL,
    score      real
);
CREATE TABLE user_submissions_admin(
    index      INT NOT NULL,
    task       VARCHAR(100) NOT NULL,
    time       timestamp default current_timestamp,
    name       VARCHAR(100) NOT NULL,
    score      real
);
