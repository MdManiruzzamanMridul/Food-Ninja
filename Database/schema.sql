CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE food_category (
	category varchar(50) PRIMARY KEY,
	picture bytea
);

CREATE TABLE admin (
	username varchar(50) PRIMARY KEY,
	email varchar(254) NOT NULL UNIQUE,
	phone varchar(20) NOT NULL UNIQUE,
	password_hash varchar(255) NOT NULL,
	status varchar(10) DEFAULT 'pending' CHECK (status IN ('pending', 'banned', 'approved'))
);

CREATE TABLE restaurant_owner (
	owner_id varchar(64) PRIMARY KEY,
	name varchar(100) NOT NULL,
	phone varchar(20) NOT NULL UNIQUE,
	email varchar(254) NOT NULL UNIQUE,
	nid varchar(50) NOT NULL UNIQUE,
	password_hash varchar(255) NOT NULL,
	status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'banned'))
);

CREATE TABLE users (
	username varchar(64) PRIMARY KEY,
	phone varchar(20) NOT NULL UNIQUE,
	email varchar(254) NOT NULL UNIQUE,
	balance numeric(10, 2) DEFAULT 0.00 NOT NULL,
	pfp bytea,
	location geography(Point, 4326),
	name varchar(100) NOT NULL,
	password_hash varchar(255) NOT NULL,
	status varchar(10) DEFAULT 'ok' CHECK (status IN ('deleted', 'banned', 'ok')),
	reg_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE rider (
	username varchar(64) PRIMARY KEY,
	name varchar(100) NOT NULL,
	phone varchar(20) NOT NULL UNIQUE,
	email varchar(254) NOT NULL UNIQUE,
	password_hash varchar(255) NOT NULL,
	vehicle varchar(50) NOT NULL CHECK (vehicle IN ('bike', 'bicycle')),
	location geography(Point, 4326),
	balance numeric(10, 2) DEFAULT 0.00 NOT NULL,
	pfp bytea,
	status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'online', 'offline', 'banned', 'delivering')),
	reg_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE restaurant (
	restaurant_id varchar(64) PRIMARY KEY,
	owner_id varchar(64) NOT NULL REFERENCES restaurant_owner(owner_id) ON DELETE CASCADE,
	name varchar(100) NOT NULL,
	location geography(Point, 4326) NOT NULL,
	open_time time NOT NULL,
	close_time time NOT NULL,
	status varchar(20) DEFAULT 'closed' CHECK (status IN ('pending', 'open', 'closed', 'banned'))
);

CREATE TABLE foods (
	food_id varchar(64) PRIMARY KEY,
	restaurant_id varchar(64) NOT NULL REFERENCES restaurant(restaurant_id) ON DELETE CASCADE,
	category varchar(50) NOT NULL REFERENCES food_category(category) ON DELETE RESTRICT,
	name varchar(100) NOT NULL,
	price numeric(10, 2) NOT NULL CHECK (price >= 0),
	discount numeric(5, 2) DEFAULT 0.00 CHECK (discount >= 0 AND discount <= 100),
	description text,
	picture bytea
);

CREATE TABLE cart (
	cart_id varchar(64) PRIMARY KEY,
	username varchar(64) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
	restaurant_id varchar(64) NOT NULL REFERENCES restaurant(restaurant_id) ON DELETE CASCADE,
	status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'unavailable', 'ordered'))
);

CREATE TABLE cart_item (
	cart_id varchar(64) REFERENCES cart(cart_id) ON DELETE CASCADE,
	food_id varchar(64) REFERENCES foods(food_id) ON DELETE CASCADE,
	quantity integer NOT NULL CHECK (quantity > 0),
	PRIMARY KEY (cart_id, food_id)
);

CREATE TABLE orders (
	order_id varchar(64) PRIMARY KEY,
	username varchar(64) NOT NULL REFERENCES users(username),
	cart_id varchar(64) NOT NULL UNIQUE REFERENCES cart(cart_id),
	rider_username varchar(64) REFERENCES rider(username),
	location geography(Point, 4326) NOT NULL,
	status varchar(30) DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'delivering', 'delivered', 'cancelled')),
	order_timestamp timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	final_timestamp timestamp,
	bill text NOT NULL
);

CREATE TABLE payment (
	order_id varchar(64) PRIMARY KEY REFERENCES orders(order_id),
	username varchar(64) NOT NULL REFERENCES users(username),
	transaction_id varchar(100) NOT NULL UNIQUE,
	payment_method varchar(50) NOT NULL,
	status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
	timestamp timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE review (
	order_id varchar(64) PRIMARY KEY REFERENCES orders(order_id),
	rider_rating integer CHECK (rider_rating >= 1 AND rider_rating <= 5),
	rider_review text,
	restaurant_rating integer CHECK (restaurant_rating >= 1 AND restaurant_rating <= 5),
	restaurant_review text,
	timestamp timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE revoked_tokens (
    jti UUID PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_revoked_tokens_expires_at
ON revoked_tokens(expires_at);
