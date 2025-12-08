Select version;

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

INSERT INTO members (first_name,last_name,email,phone_mobile,date_birth) VALUES
('Annetta','Johnson','johnsona128@vcu.edu','540295000','1971-07-04');


DROP TABLE memberWorkOut;

CREATE TABLE IF NOT EXISTS memberWorkOut (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id int,
    workout_date date,
    notes text,
    FOREIGN KEY (member_id) REFERENCES members(id)
);

INSERT INTO memberWorkOut (member_id,workout_date,notes) VALUES
(1,'2025-07-04','This sucks');


DROP TABLE memberWorkOutDetails;

CREATE TABLE IF NOT EXISTS memberWorkOutDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workout_id int not null,
    exercise_id int not null,
    set_num int null,
    rep_num int null,
    weight int null,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id),
    FOREIGN KEY (workout_id) REFERENCES memberWorkOut(id)
);

INSERT INTO memberWorkOutDetails (workout_id,exercise_id,set_num, rep_num, weight) VALUES
(1,10,3,10,50);

Select CONCAT(first_name, ' ', last_name) as member_name,
workout_date,
notes
FROM members m
LEFT JOIN memberWorkOut mwo
ON m.id = mwo.member_id
Order by workout_date;

   Select 
        workout_id,
        exercise_id,
        set_num,
        rep_num,
        weight
        FROM memberWorkOutDetails mwod
        LEFT JOIN exercises e
        ON e.id = mwod.exercise_id;
        
        Select * FROM memberWorkOutDetails
