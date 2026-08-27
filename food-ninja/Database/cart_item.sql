-- ========================================================
-- Table: cart_item
-- ========================================================

CREATE TABLE IF NOT EXISTS cart_item (
  cart_id VARCHAR(64) NOT NULL,
  food_id VARCHAR(64) NOT NULL,
  quantity INTEGER NOT NULL,
  PRIMARY KEY (cart_id, food_id)
);

