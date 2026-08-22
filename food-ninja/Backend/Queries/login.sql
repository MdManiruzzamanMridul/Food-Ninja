--name: insert_admin
INSERT INTO admin (username, email, phone, password_hash)
VALUES (%s, %s, %s, %s)
