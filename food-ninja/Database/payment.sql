-- ========================================================
-- Table: payment
-- ========================================================

CREATE TABLE IF NOT EXISTS payment (
  order_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
