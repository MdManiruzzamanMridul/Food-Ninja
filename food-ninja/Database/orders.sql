-- ========================================================
-- Table: orders
-- ========================================================

CREATE TABLE IF NOT EXISTS orders (
  order_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  cart_id VARCHAR(64) UNIQUE NOT NULL,
  rider_id VARCHAR(64),
  location geography NOT NULL,
  status VARCHAR(30) DEFAULT 'pending',
  order_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  final_timestamp TIMESTAMP,
  bill TEXT NOT NULL
);
