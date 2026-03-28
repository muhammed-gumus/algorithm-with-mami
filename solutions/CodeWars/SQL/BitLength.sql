-- CodeWars - Easy SQL: Bit Length
--
-- Given a demographics table (id, name, birthday, race),
-- return the same table where all text fields (name & race)
-- are replaced with the bit length of the string.

SELECT
    id,
    BIT_LENGTH(name) AS name,
    birthday,
    BIT_LENGTH(race) AS race
FROM demographics;
