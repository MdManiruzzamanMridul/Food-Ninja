--name:check_food_cat
SELECT 1
FROM food_category
WHERE category = %s
LIMIT 1;
