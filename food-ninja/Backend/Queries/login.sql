--name: admin_check
SELECT 1
FROM admin 
WHERE email = %s OR phone = %s 

