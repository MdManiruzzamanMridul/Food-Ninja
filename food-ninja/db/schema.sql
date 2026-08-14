CREATE TABLE IF NOT EXISTS dhaka_restaurants (
  id BIGSERIAL PRIMARY KEY,
  source_key TEXT NOT NULL UNIQUE,
  source_name TEXT NOT NULL DEFAULT 'dhaka-restaurant-directory',
  name TEXT NOT NULL,
  venue_type TEXT,
  cuisine TEXT,
  area TEXT,
  address TEXT,
  phone TEXT,
  website TEXT,
  opening_hours TEXT,
  rating NUMERIC(2, 1),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  maps_url TEXT,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dhaka_restaurants_area_idx ON dhaka_restaurants (area);
CREATE INDEX IF NOT EXISTS dhaka_restaurants_coordinates_idx ON dhaka_restaurants (latitude, longitude);
