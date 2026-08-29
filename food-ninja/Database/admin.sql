-- ========================================================
-- Table: admin
-- ========================================================

CREATE TABLE IF NOT EXISTS admin (
  username VARCHAR(50) PRIMARY KEY,
  email VARCHAR(254) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(10) DEFAULT 'pending'
);