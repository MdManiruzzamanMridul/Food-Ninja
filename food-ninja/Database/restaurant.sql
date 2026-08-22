-- ========================================================
-- Table: restaurant
-- ========================================================

CREATE TABLE IF NOT EXISTS restaurant (
  restaurant_id VARCHAR(64) PRIMARY KEY,
  owner_id VARCHAR(64) NOT NULL,
  name VARCHAR(100) NOT NULL,
  location geography NOT NULL,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'closed'
);
