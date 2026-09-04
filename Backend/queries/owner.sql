--name:get_owner_status
SELECT status, name, email, phone, nid
FROM restaurant_owner
WHERE owner_id = %s;

--name:get_owner_restaurants
SELECT restaurant_id, name,
       ST_Y(location::geometry) AS latitude,
       ST_X(location::geometry) AS longitude,
       open_time::text, close_time::text, status
FROM restaurant
WHERE owner_id = %s
ORDER BY name ASC;

--name:check_owner_status
SELECT status
FROM restaurant_owner
WHERE owner_id = %s;

--name:insert_restaurant
INSERT INTO restaurant
(restaurant_id, owner_id, name, location, open_time, close_time, status)
VALUES
(%s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s, %s, %s);

--name:delete_restaurant_by_owner
DELETE FROM restaurant
WHERE restaurant_id = %s AND owner_id = %s;

--name:delete_restaurant_by_admin
DELETE FROM restaurant
WHERE restaurant_id = %s;
