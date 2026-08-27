--name:pending_orders_user
SELECT order_id, status, bill
FROM orders
WHERE username = %s AND (STATUS = 'delivering' OR STATUS = 'preparing' OR STATUS = 'pending');