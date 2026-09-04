--name:admin_check
SELECT username, password_hash, status
FROM admin 
WHERE username = %s OR email = %s OR phone = %s 

--name:admin_register
INSERT INTO admin
(username, email, phone, password_hash) VALUES
(%s, %s, %s, %s)


--name:user_check
SELECT username, password_hash
FROM users
WHERE username = %s OR email = %s OR phone = %s

--name:user_register
INSERT INTO users
(username, name, email, phone, password_hash) VALUES
(%s, %s, %s, %s, %s)

--name:rider_check
SELECT username, password_hash, status
FROM rider
WHERE username = %s OR email = %s OR phone = %s

--name:rider_register
INSERT INTO rider
(username, name, email, phone, password_hash, vehicle) VALUES
(%s, %s, %s, %s, %s, %s)

--name:owner_check
SELECT owner_id AS username, password_hash, status
FROM restaurant_owner
WHERE owner_id = %s OR email = %s OR phone = %s

--name:owner_register
INSERT INTO restaurant_owner
(owner_id, name, email, phone, nid, password_hash, status) VALUES
(%s, %s, %s, %s, %s, %s, %s)
