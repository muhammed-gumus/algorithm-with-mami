-- CodeWars - SQL Basics: Simple IN
--
-- Using departments (id, name) and sales (id, department_id, name, price,
-- card_name, card_number, transaction_date), return departments that have
-- had at least one sale with a price over $98.
--
-- Output: id, name

SELECT
    id,
    name
FROM departments
WHERE id IN (
    SELECT department_id
    FROM sales
    WHERE price > 98
);
