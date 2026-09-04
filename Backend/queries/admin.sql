--name:get_all_users
SELECT username, name, email, phone, balance, status
FROM users
ORDER BY username ASC;

--name:get_all_owners
SELECT owner_id, name, email, phone, nid, status
FROM restaurant_owner
ORDER BY owner_id ASC;

--name:verify_owner
UPDATE restaurant_owner
SET status = %s
WHERE owner_id = %s;

--name:get_all_restaurants
SELECT R.restaurant_id, R.name, R.owner_id, O.name AS owner_name,
       R.open_time::text, R.close_time::text, R.status
FROM restaurant R
LEFT JOIN restaurant_owner O ON R.owner_id = O.owner_id
ORDER BY R.name ASC;

--name:verify_restaurant
UPDATE restaurant
SET status = %s
WHERE restaurant_id = %s;
