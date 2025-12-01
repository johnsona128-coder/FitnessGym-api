CREATE DATABASE IF NOT EXISTS gym_tracker;
USE gym_tracker;

CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_mobile VARCHAR(100) NOT NULL UNIQUE,
    date_birth VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS memberWorkOut (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workout_date VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS memberWorkOutDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id int not null,
    set_num int null,
    rep_num int null,
    weight int null,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);
