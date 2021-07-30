--CREATE DATABASE codeevaluationdb;

drop schema public cascade;
create schema public;


CREATE TABLE users(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(100) NOT NULL,
    password   VARCHAR(100) NOT NULL,
    firstName  VARCHAR(100) NOT NULL,
    lastName   VARCHAR(100) NOT NULL,
    isAdmin    VARCHAR(100) NOT NULL
);

INSERT INTO users (username, password, firstName, lastName, isAdmin)
    VALUES ('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Admin', 'Admin', 'true');                          -- temporary user 2

CREATE TABLE submissions(
    index      INT NOT NULL,
    compiled   BOOLEAN NOT NULL,
    result     json NOT NULL,
    codepath   VARCHAR(100) NOT NULL,
    taskname   VARCHAR(100) NOT NULL,
    username   VARCHAR(100) NOT NULL,
    score      real,
    subtasks   json NOT NULL,
    time       timestamp default current_timestamp
);

CREATE TABLE user_submissions_admin(
    index      INT NOT NULL,
    task       VARCHAR(100) NOT NULL,
    time       timestamp default current_timestamp,
    name       VARCHAR(100) NOT NULL,
    score      real
);

CREATE TABLE contests (
    id         SERIAL PRIMARY KEY,
    hidden     BOOLEAN NOT NULL,
    name       VARCHAR(100) NOT NULL
);
