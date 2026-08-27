-- ========================================================
-- Table: foods
-- ========================================================

CREATE TABLE IF NOT EXISTS foods (
  food_id VARCHAR(64) PRIMARY KEY,
  restaurant_id VARCHAR(64) NOT NULL,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(5, 2) DEFAULT 0.00,
  description TEXT,
  picture BYTEA
);