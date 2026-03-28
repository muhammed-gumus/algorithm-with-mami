-- CodeWars - Collect Tuition (SQL for Beginners #4)
--
-- From the students table (name, age, semester, mentor, tuition_received),
-- return all students who have NOT yet paid their tuition.

SELECT name, age, semester, mentor, tuition_received
FROM students
WHERE tuition_received = false;
