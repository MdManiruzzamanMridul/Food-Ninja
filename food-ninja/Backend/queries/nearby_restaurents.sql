--name:get_nearby_restaurents
SELECT name, 
    ST_Y(R.location::geometry) AS latitude,
    ST_X(R.location::geometry) AS longitude,
    open_time, close_time, status, COALESCE( AVG(RV.restaurent_rating), 0) AS AVG_RATING
FROM restaurents R 
LEFT JOIN cart C ON (R.restaurent_id = C.restaurent_id)
LEFT JOIN orders O ON (C.cart_id = O.card_id)
LEFT JOIN review RV ON (O.order_id = RV.order_id)
WHERE ST_DWithin(
    R.location,
    ST_SetSRID(
        ST_MakePoint(%s, %s),
        4326
    )::geography,
    %s
)
AND (
    %s IS NULL
    OR EXISTS(
            SELECT 1 
            FROM foods F
            WHERE F.category = %s
            AND F.restaurent_id = R.restaurent_id
        )
)
GROUP BY
    R.restaurent_id,
    R.name,
    R.location,
    R.open_time,
    R.close_time,
    R.status;
