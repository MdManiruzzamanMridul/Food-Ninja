--name:get_user_location
SELECT
    ST_Y(location::geometry) AS latitude,
    ST_X(location::geometry) AS longitude
FROM users
WHERE username = %s