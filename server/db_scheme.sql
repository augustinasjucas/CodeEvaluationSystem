-- CREATE DATABASE codeevaluationdb;

CREATE TABLE users(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(100) NOT NULL,
    password   VARCHAR(100) NOT NULL
);