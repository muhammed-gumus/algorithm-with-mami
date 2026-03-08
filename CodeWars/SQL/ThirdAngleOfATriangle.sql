-- CodeWars - Third Angle of a Triangle
--
-- Given a table 'otherangle' with columns 'a' and 'b' (two interior angles),
-- return a, b and the third angle as 'res'.
-- Sum of angles in a triangle = 180 degrees.

CREATE OR REPLACE FUNCTION res(x NUMERIC, y NUMERIC)
RETURNS INT AS $$
BEGIN
    RETURN 180 - (x + y);
END;
$$ LANGUAGE plpgsql;

SELECT a, b, res(a, b) FROM otherangle;
