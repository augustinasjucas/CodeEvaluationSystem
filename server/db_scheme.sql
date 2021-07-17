--CREATE DATABASE codeevaluationdb;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS submissions;

CREATE TABLE users(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(100) NOT NULL,
    password   VARCHAR(100) NOT NULL
);

INSERT INTO users (username, password) 
    VALUES ('insertUsername', 'insertHashedPassword'); -- temporary user

CREATE TABLE submissions(
    index      INT NOT NULL,
    compiled   BOOLEAN NOT NULL,
    result     json NOT NULL,
    codepath   VARCHAR(100) NOT NULL,
    taskname   VARCHAR(100) NOT NULL
);