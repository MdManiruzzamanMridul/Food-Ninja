--name:update_user_location
UPDATE users
SET location = ST_SetSRID(ST_MakePoint(%s, %s), 4326)
WHERE username = %s;

--name:update_rider_location
UPDATE rider
SET location = ST_SetSRID(ST_MakePoint(%s, %s), 4326)
WHERE username = %s;

--name:get_user_password
SELECT password_hash
FROM users
WHERE username = %s;

--name:get_rider_password
SELECT password_hash
FROM rider
WHERE username = %s;

--name:get_admin_password
SELECT password_hash
FROM admin
WHERE username = %s;

--name:update_user_email
UPDATE users
SET email = %s
WHERE username = %s;

--name:update_rider_email
UPDATE rider
SET email = %s
WHERE username = %s;

--name:update_admin_email
UPDATE admin
SET email = %s
WHERE username = %s;

--name:update_user_phone
UPDATE users
SET phone = %s
WHERE username = %s;

--name:update_rider_phone
UPDATE rider
SET phone = %s
WHERE username = %s;

--name:update_admin_phone
UPDATE admin
SET phone = %s
WHERE username = %s;

--name:update_user_password
UPDATE users
SET password_hash = %s
WHERE username = %s;

--name:update_rider_password
UPDATE rider
SET password_hash = %s
WHERE username = %s;

--name:update_admin_password
UPDATE admin
SET password_hash = %s
WHERE username = %s;

--name:get_owner_password
SELECT password_hash
FROM restaurant_owner
WHERE owner_id = %s;

--name:update_owner_email
UPDATE restaurant_owner
SET email = %s
WHERE owner_id = %s;

--name:update_owner_phone
UPDATE restaurant_owner
SET phone = %s
WHERE owner_id = %s;

--name:update_owner_password
UPDATE restaurant_owner
SET password_hash = %s
WHERE owner_id = %s;
