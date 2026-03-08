-- CodeWars - On the Canadian Border (SQL for Beginners #2)
--
-- From the travelers table (name, country), return travelers who need
-- a visa check — i.e. exclude citizens of USA, Canada, and Mexico.

SELECT name, country
FROM travelers
WHERE country NOT IN ('USA', 'Canada', 'Mexico');
