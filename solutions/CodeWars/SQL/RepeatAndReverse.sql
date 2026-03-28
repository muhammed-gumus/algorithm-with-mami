-- CodeWars - SQL Basics: Repeat and Reverse
--
-- Using the monsters table (id, name, legs, arms, characteristics),
-- return name repeated three times and characteristics reversed.
--
-- Output: name, characteristics

SELECT
    name || name || name        AS name,
    REVERSE(characteristics)    AS characteristics
FROM monsters;
