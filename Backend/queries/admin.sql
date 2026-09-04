--name:get_admin_status
SELECT username, status
FROM admin
WHERE username = %s;

--name:get_all_admins
SELECT username, email, phone, status
FROM admin
WHERE status = 'pending'
ORDER BY username ASC;

--name:verify_admin
UPDATE admin
SET status = %s
WHERE username = %s;

--name:get_all_users
SELECT username, name, email, phone, balance, status
FROM users
ORDER BY username ASC;

--name:get_all_owners
SELECT owner_id, name, email, phone, nid, status
FROM restaurant_owner
WHERE status = 'pending'
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
WHERE R.status = 'pending'
ORDER BY R.name ASC;

--name:get_all_riders
SELECT username, name, email, phone, vehicle, location, balance, status
FROM rider
WHERE status = 'pending'
ORDER BY username ASC;

--name:verify_rider
UPDATE rider
SET status = %s
WHERE username = %s;

--name:verify_restaurant
UPDATE restaurant
SET status = %s
WHERE restaurant_id = %s;
