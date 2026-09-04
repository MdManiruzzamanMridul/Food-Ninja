--name:check_food_cat
SELECT 1
FROM food_category
WHERE category = %s

--name:check_username_exists
SELECT 1 FROM (
    SELECT username FROM users WHERE username = %s
    UNION
    SELECT username FROM rider WHERE username = %s
    UNION
    SELECT username FROM admin WHERE username = %s
    UNION
    SELECT owner_id AS username FROM restaurant_owner WHERE owner_id = %s
) AS all_users LIMIT 1;