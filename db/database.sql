CREATE DATABASE dev_time_manager_db;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    refresh_token VARCHAR(512) NOT NULL,
);

CREATE TABLE tasks(
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL,
    time TIME(0) NOT NULL,
    is_finished VARCHAR(20) NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    email VARCHAR(320) NOT NULL,
);

CREATE TABLE progress_tasks(
    task_id SERIAL PRIMARY KEY,
    date TIMESTAMPTZ NOT NULL,
    value NUMERIC(3, 1),
    email VARCHAR(320) NOT NULL,
);