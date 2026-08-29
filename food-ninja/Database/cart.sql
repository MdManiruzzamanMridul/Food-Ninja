-- ========================================================
-- Table: cart
-- ========================================================

CREATE TABLE IF NOT EXISTS cart (
  cart_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  restaurant_id VARCHAR(64) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending'
);