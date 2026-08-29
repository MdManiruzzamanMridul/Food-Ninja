--name:update_user_location
UPDATE users
SET location = ST_SetSRID(ST_MakePoint(%s, %s), 4326)
WHERE username = %s;

--name:update_rider_location
UPDATE rider
SET location = ST_SetSRID(ST_MakePoint(%s, %s), 4326)
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
WHERE username = %s

--name:update_user_phone
UPDATE users
SET phone = %s
WHERE username = %s

--name:update_rider_phone
UPDATE rider
SET phone = %s
WHERE username = %s

--name:update_admin_phone
UPDATE admin
SET phone = %s
WHERE username = %s
