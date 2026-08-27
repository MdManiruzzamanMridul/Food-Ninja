-- ========================================================
-- Table: review
-- ========================================================

CREATE TABLE IF NOT EXISTS review (
  order_id VARCHAR(64) PRIMARY KEY,
  rider_rating INTEGER,
  rider_review TEXT,
  restaurant_rating INTEGER,
  restaurant_review TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
