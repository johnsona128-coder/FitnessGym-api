drop database IF EXISTS gym_tracker;


CREATE DATABASE IF NOT EXISTS gym_tracker;
USE gym_tracker;

CREATE TABLE IF NOT EXISTS muscles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    muscle_name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO muscles (id,muscle_name) VALUES
(1,'abdominals'),
(2,'abductors'),
(3,'adductors'),
(4,'biceps'),
(5,'calves'),
(6,'chest'),
(7,'forearms'),
(8,'glutes'),
(9,'hamstrings'),
(10,'lats'),
(11,'lower back'),
(12,'middle back'),
(13,'neck'),
(14,'quadriceps'),
(15,'shoulders'),
(16,'traps'),
(17,'triceps'),
(18,'obliques'),
(19,'hip flexors');

-- Force types
CREATE TABLE force_types (
    force_type VARCHAR(20) PRIMARY KEY
);

INSERT INTO force_types (force_type) VALUES
('push'), ('pull'), ('static'), ('other');

-- Levels
CREATE TABLE levels (
    experience_level VARCHAR(20) PRIMARY KEY
);

INSERT INTO levels (experience_level) VALUES
('beginner'), ('intermediate'), ('advanced'), ('expert');

-- Mechanics
CREATE TABLE mechanics (
    mechanic VARCHAR(50) PRIMARY KEY
);

INSERT INTO mechanics (mechanic) VALUES
('isolation'), ('compound'), ('other');

-- Equipment
CREATE TABLE equipment (
    equipment VARCHAR(50) PRIMARY KEY
);

INSERT INTO equipment (equipment) VALUES
('barbell'), ('body only'), ('dumbbell'), ('kettlebell'), 
('cable'), ('medicine ball'), ('resistance band'), ('wheel'),
('machine'), ('smith machine'), ('stability ball'), ('bosu ball'),
('other'),('agility ladder'),('bench');

-- Categories
CREATE TABLE categories (
    category VARCHAR(50) PRIMARY KEY
);

INSERT INTO categories (category) VALUES
('strength'), ('cardio'), ('stretching'), ('plyometrics'),
('balance'), ('other');


CREATE TABLE exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_name VARCHAR(255) NOT NULL,
    force_type VARCHAR(20),
    experience_level VARCHAR(20),
    mechanic VARCHAR(50),
    equipment VARCHAR(50),
    category VARCHAR(50),
    FOREIGN KEY (force_type) REFERENCES force_types(force_type),
    FOREIGN KEY (experience_level) REFERENCES levels(experience_level),
    FOREIGN KEY (mechanic) REFERENCES mechanics(mechanic),
    FOREIGN KEY (equipment) REFERENCES equipment(equipment),
    FOREIGN KEY (category) REFERENCES categories(category)
);

USE gym_tracker;

INSERT INTO exercises (id, exercise_name, force_type, experience_level, mechanic, equipment, category) VALUES
(1,'3/4 Sit-Up','pull','beginner','compound','body only','strength'),
(2,'90/90 Hamstring','pull','beginner',NULL,'body only','stretching'),
(3,'Abdominal Bench Crunch','push','beginner','isolation','bench','strength'),
(4,'Abdominal Crossover','pull','beginner','isolation','body only','strength'),
(5,'Abdominal Hip Raise','pull','beginner','compound','body only','strength'),
(6,'Abdominal Roller','pull','intermediate','isolation','body only','strength'),
(7,'Abs Roller','pull','intermediate','isolation','body only','strength'),
(8,'Agility Ladder','other','beginner',NULL,'agility ladder','other'),
(9,'Air Bike','push','beginner','compound','body only','cardio'),
(10,'Alternating Dumbbell Bench Press','push','intermediate','compound','dumbbell','strength');



CREATE TABLE exercise_primary_muscles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id INT NOT NULL,
    muscle_id INT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id),
    FOREIGN KEY (muscle_id) REFERENCES muscles(id)
);

INSERT INTO exercise_primary_muscles (exercise_id, muscle_id) VALUES
(1,1),   -- 3/4 Sit‑Up → abdominals
(2,9),   -- 90/90 Hamstring → hamstrings
(3,1),   -- Abdominal Bench Crunch → abdominals
(4,1),   -- Abdominal Crossover → abdominals
(5,1),   -- Abdominal Hip Raise → abdominals
(6,1),   -- Abdominal Roller → abdominals
(7,1),   -- Abs Roller → abdominals
(8,14),  -- Agility Ladder → quads
(9,1),   -- Air Bike → abdominals
(10,6);  -- Alternating Dumbbell Bench Press → chest

CREATE TABLE exercise_secondary_muscles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id INT NOT NULL,
    muscle_id INT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id),
    FOREIGN KEY (muscle_id) REFERENCES muscles(id)
);

INSERT INTO exercise_secondary_muscles (exercise_id, muscle_id) VALUES
(2,5),   -- 90/90 Hamstring → calves
(3,19),  -- Abdominal Bench Crunch → hip flexors
(4,18),  -- Abdominal Crossover → obliques
(5,19),  -- Abdominal Hip Raise → hip flexors
(6,19),  -- Abdominal Roller → hip flexors
(7,19),  -- Abs Roller → hip flexors
(10,17); -- Alternating Dumbbell Bench Press → triceps

CREATE TABLE exercise_instructions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id INT NOT NULL,
    step_number INT NOT NULL,
    instruction TEXT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

INSERT INTO exercise_instructions (exercise_id, step_number, instruction) VALUES
(1,1,'Lie down on the floor and secure your feet. Your legs should be bent at the knees.'),
(1,2,'Place your hands behind or to the side of your head. You will begin with your back on the ground. This will be your starting position.'),
(1,3,'Flex your hips and spine to raise your torso toward your knees.'),
(1,4,'At the top of the contraction your torso should be perpendicular to the ground. Reverse the motion, going only ¾ of the way down.'),
(1,5,'Repeat for the recommended amount of repetitions.'),
(2,1,'Lie on your back, with one leg extended straight out.'),
(2,2,'With the other leg, bend the hip and knee to 90 degrees. You may brace your leg with your hands if necessary. This will be your starting position.'),
(2,3,'Extend your leg straight into the air, pausing briefly at the top.'),
(2,4,'Return the leg to the starting position.'),
(2,5,'Repeat for 10–20 repetitions, and then switch to the other leg.'),
(3,1,'Lie face up on a decline bench and secure your feet.'),
(3,2,'Place your hands behind your head or cross them over your chest. This will be your starting position.'),
(3,3,'Crunch up until your upper body is at approx. 30° relative to the bench, keeping the lower back on the bench pad.'),
(3,4,'Slowly lower back down to the start.'),
(3,5,'Repeat for the recommended reps.'),
(4,1,'Lie on your back on a bench, arms out wide, feet flat.'),
(4,2,'Bring one knee up and across your body toward the opposite elbow while lifting your torso.'),
(4,3,'Return to the starting position and repeat on the other side.'),
(4,4,'Continue alternating sides for the given reps.'),
(5,1,'Lie flat on your back with your legs extended overhead, toes pointing up.'),
(5,2,'Use your hip flexors and abdominals to raise your hips off the floor, bringing your legs up.'),
(5,3,'Pause at the top, then lower legs back to starting position.'),
(5,4,'Perform reps as advised.'),
(6,1,'Kneel on the floor holding the ab roller with both hands.'),
(6,2,'Roll forward by extending your body, keeping your abs tight.'),
(6,3,'Roll back to the start position.'),
(6,4,'Repeat for reps.'),
(7,1,'Kneel on the floor holding the roller.'),
(7,2,'Roll forward as far as you can while maintaining control.'),
(7,3,'Return to kneeling start.'),
(7,4,'Repeat.'),
(8,1,'Set out an agility ladder on the floor.'),
(8,2,'Run through the ladder performing fast footwork drills.'),
(8,3,'Continue for the designated time or pattern.'),
(9,1,'Sit on the air bike and begin pedaling with both arms and legs full motion.'),
(9,2,'Keep a consistent challenging pace.'),
(9,3,'Continue for the target duration.'),
(10,1,'Lie back on a flat bench holding a dumbbell in each hand.'),
(10,2,'Press one dumbbell up while keeping the other at start position.'),
(10,3,'Lower that dumbbell and press the other one.'),
(10,4,'Continue alternating for the session.');

CREATE TABLE exercise_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

INSERT INTO exercise_images (exercise_id, image_path) VALUES
(1,'3_4_Sit-Up.mp4'),
(2,'90_90_Hamstring.mp4'),
(3,'Abdominal_Bench_Crunch.mp4'),
(4,'Abdominal_Crossover.mp4'),
(5,'Abdominal_Hip_Raise.mp4'),
(6,'Abdominal_Roller.mp4'),
(7,'Abs_Roller.mp4'),
(8,'Agility_Ladder.mp4'),
(9,'Air_Bike.mp4'),
(10,'Alternating_Dumbbell_Bench_Press.mp4');

CREATE VIEW primary_muscle_group AS (
Select epm.exercise_id,
e.exercise_name,
epm.muscle_id,
m.muscle_name
FROM exercise_primary_muscles epm
LEFT JOIN exercises e on epm.exercise_id = e.id
LEFT JOIN muscles m on epm.muscle_id = m.id
);

CREATE VIEW secondary_muscle_group AS (
Select esm.exercise_id,
e.exercise_name,
esm.muscle_id,
m.muscle_name
FROM exercise_secondary_muscles esm
LEFT JOIN exercises e on esm.exercise_id = e.id
LEFT JOIN muscles m on esm.muscle_id = m.id);



