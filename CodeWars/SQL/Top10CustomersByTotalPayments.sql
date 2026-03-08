-- CodeWars - Top 10 customers by total payments
--
-- Using the DVD Rental database, return the top 10 customers ordered by
-- total amount spent (highest to lowest).
--
-- Output columns:
--   customer_id [int]
--   email       [varchar]
--   payments_count [int]
--   total_amount   [float]

SELECT
    customer.customer_id,
    customer.email,
    COUNT(payment.payment_id)          AS payments_count,
    CAST(SUM(payment.amount) AS float) AS total_amount
FROM payment
JOIN customer ON payment.customer_id = customer.customer_id
GROUP BY customer.customer_id, customer.email
ORDER BY total_amount DESC
LIMIT 10;
