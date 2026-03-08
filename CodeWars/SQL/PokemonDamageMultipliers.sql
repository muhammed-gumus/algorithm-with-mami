-- CodeWars - SQL with Pokemon: Damage Multipliers
--
-- You are battling Erika at the Celadon Gym (Grass-type).
-- Using the pokemon (id, pokemon_name, element_id, str) and
-- multipliers (id, element, multiplier) tables, return pokemon
-- whose modifiedStrength (multiplier * str) >= 40, ordered
-- from strongest to weakest.
--
-- Output: pokemon_name, modifiedStrength, element

-- i choose you! --

SELECT
    pokemon_name,
    (multiplier * str) AS modifiedStrength,
    element
FROM pokemon
JOIN multipliers ON pokemon.element_id = multipliers.id
WHERE (multiplier * str) >= 40
ORDER BY modifiedStrength DESC;
