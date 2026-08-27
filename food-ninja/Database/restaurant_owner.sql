-- ========================================================
-- Table: restaurant_owner
-- ========================================================

CREATE TABLE IF NOT EXISTS restaurant_owner (
  owner_id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  nid VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);
