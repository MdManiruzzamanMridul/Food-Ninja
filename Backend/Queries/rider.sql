--name:get_rider_status
SELECT status, location
FROM rider
WHERE username = %s;

--name:get_rider_location
SELECT
	ST_Y(location::geometry) AS latitude,
	ST_X(location::geometry) AS longitude
FROM rider
WHERE username = %s;