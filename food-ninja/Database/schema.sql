-- ========================================================
-- Food Ninja Schema
-- ========================================================

-- Table DDL: admin
CREATE TABLE IF NOT EXISTS admin (
  username VARCHAR(50) PRIMARY KEY,
  email VARCHAR(254) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(10) DEFAULT 'pending'
);
-- Table DDL: cart
CREATE TABLE IF NOT EXISTS cart (
  cart_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  restaurant_id VARCHAR(64) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending'
);

-- Table DDL: cart_item
CREATE TABLE IF NOT EXISTS cart_item (
  cart_id VARCHAR(64) NOT NULL,
  food_id VARCHAR(64) NOT NULL,
  quantity INTEGER NOT NULL,
  PRIMARY KEY (cart_id, food_id)
);

-- Table DDL: dhaka_restaurants
CREATE TABLE IF NOT EXISTS dhaka_restaurants (
  id BIGSERIAL NOT NULL,
  source_key TEXT UNIQUE NOT NULL,
  source_name TEXT NOT NULL DEFAULT 'dhaka-restaurant-directory',
  name TEXT NOT NULL,
  venue_type TEXT,
  cuisine TEXT,
  area TEXT,
  address TEXT,
  phone TEXT,
  website TEXT,
  opening_hours TEXT,
  rating NUMERIC(2, 1),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  maps_url TEXT,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table DDL: food_category
CREATE TABLE IF NOT EXISTS food_category (
  category VARCHAR(50) PRIMARY KEY,
  picture BYTEA
);

-- Table DDL: foods
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

-- Table DDL: orders
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

-- Table DDL: payment
CREATE TABLE IF NOT EXISTS payment (
  order_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Table DDL: restaurant
CREATE TABLE IF NOT EXISTS restaurant (
  restaurant_id VARCHAR(64) PRIMARY KEY,
  owner_id VARCHAR(64) NOT NULL,
  name VARCHAR(100) NOT NULL,
  location geography NOT NULL,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'closed'
);

-- Table DDL: restaurant_owner
CREATE TABLE IF NOT EXISTS restaurant_owner (
  owner_id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  nid VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);


-- Table DDL: review
CREATE TABLE IF NOT EXISTS review (
  order_id VARCHAR(64) PRIMARY KEY,
  rider_rating INTEGER,
  rider_review TEXT,
  restaurant_rating INTEGER,
  restaurant_review TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table DDL: rider
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


-- Table DDL: users
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
