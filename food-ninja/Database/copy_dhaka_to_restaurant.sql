-- ========================================================
-- Populate data from dhaka_restaurants into restaurant table
-- ========================================================

-- 1. Ensure mock_restaurant owner exists in restaurant_owner table if referenced
INSERT INTO restaurant_owner (owner_id, name, phone, email, nid, password_hash)
VALUES (
  'mock_restaurant',
  'Mock Owner',
  '01700000000',
  'mock_owner@foodninja.com',
  'NID_MOCK_12345',
  'pbkdf2:sha256:mock_hash'
)
ON CONFLICT (owner_id) DO NOTHING;

-- 2. Copy records from dhaka_restaurants into restaurant table
INSERT INTO restaurant (
  restaurant_id,
  owner_id,
  name,
  location,
  open_time,
  close_time,
  status
)
SELECT
  'REST_' || LPAD(ROW_NUMBER() OVER (ORDER BY id)::text, 5, '0') AS restaurant_id,
  'mock_restaurant' AS owner_id,
  SUBSTRING(name FROM 1 FOR 100) AS name,
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography AS location,
  '09:00:00'::TIME AS open_time,
  '22:00:00'::TIME AS close_time,
  'open' AS status
FROM dhaka_restaurants
WHERE latitude IS NOT NULL 
  AND longitude IS NOT NULL
ON CONFLICT (restaurant_id) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  open_time = EXCLUDED.open_time,
  close_time = EXCLUDED.close_time,
  status = EXCLUDED.status;
