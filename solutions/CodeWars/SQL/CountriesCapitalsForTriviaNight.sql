-- CodeWars - Countries Capitals for Trivia Night (SQL for Beginners #6)
--
-- From the countries table (country, capital, continent), return the capitals
-- of African countries whose name starts with 'E', ordered alphabetically.
-- Return at most 3 results.
-- Note: continent may be stored as 'Africa' or 'Afrika'.

SELECT capital
FROM countries
WHERE country LIKE 'E%'
  AND continent IN ('Africa', 'Afrika')
ORDER BY capital ASC
LIMIT 3;
