--name:admin_check
SELECT username, password_hash
FROM admin 
WHERE username = %s OR email = %s OR phone = %s 

--name: admin_register
INSERT INTO admin
(username, email, phone, password_hash) VALUES
(%s, %s, %s, %s)


--name: user_check
SELECT username, password_hash
FROM users
WHERE username = %s OR email = %s OR phone = %s

--name: user_register
INSERT INTO users
(username, name, email, phone, password_hash) VALUES
(%s, %s, %s, %s, %s)

--name: rider_check
SELECT username, password_hash
FROM rider
WHERE username = %s OR email = %s OR phone = %s

--name: rider_register
INSERT INTO rider
(username, name, email, phone, password_hash, vehicle) VALUES
(%s, %s, %s, %s, %s, %s)
