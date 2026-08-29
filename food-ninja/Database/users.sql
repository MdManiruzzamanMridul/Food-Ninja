-- ========================================================
-- Table: users
-- ========================================================

CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(64) PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  pfp BYTEA,
  location geography,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(10) DEFAULT 'ok',
  reg_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);