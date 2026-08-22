-- ========================================================
-- Table: rider
-- ========================================================

CREATE TABLE IF NOT EXISTS rider (
  rider_id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone_no VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  vehicle VARCHAR(50) NOT NULL,
  location geography,
  balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  pfp BYTEA,
  status VARCHAR(20) DEFAULT 'online',
  reg_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
