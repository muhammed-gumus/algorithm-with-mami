-- CodeWars - Best-Selling Books (SQL for Beginners #5)
--
-- From the books table (name, author, copies_sold), return the top 5
-- best-selling books ordered by copies sold (highest to lowest).

SELECT name, author, copies_sold
FROM books
ORDER BY copies_sold DESC
LIMIT 5;
