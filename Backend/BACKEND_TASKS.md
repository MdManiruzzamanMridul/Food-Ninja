# 📋 Food Ninja Backend — Status Audit & Action Items

> **Note for Teammate:** This document contains a comprehensive breakdown of the current backend progress, critical runtime bugs, SQL schema mismatches, and prioritized tasks to complete the full-stack integration for Food Ninja.

---

## 📊 1. Current Backend Progress Overview

### ✅ Implemented Modules & Endpoints
| Component | Route / Function | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Server Setup** | `Backend/app.py` | ✅ Working | Flask app with CORS enabled, blueprints registered, health endpoints `/` and `/api/health`. |
| **Connection Pool** | `Backend/db.py` | ✅ Working | `psycopg_pool.ConnectionPool` with `dict_row` factory and `load_query` utility. |
| **Auth & Security** | `Backend/auth.py` | ✅ Working | JWT encode/decode (HS256, 2h expiry), password hashing via `werkzeug.security`. |
| **Validation Helpers** | `Backend/utils.py` | ✅ Working | BD phone normalization (`+8801...`, `01...`), email regex, username & name regex. |
| **Registration** | `POST /register` (`routes/login.py`) | ⚠️ Partial | Supports `user`, `admin`, `rider`. Missing `restaurant_owner` support. |
| **Login** | `POST /login` (`routes/login.py`) | ⚠️ Partial | Authenticates with username/email/phone + password. Returns JWT token. |
| **Location Update** | `PATCH /users/me/location` (`routes/update_location.py`) | ⚠️ Buggy | Coordinate parameter order inverted in PostGIS query. |
| **Email Update** | `PATCH /users/me/email` (`routes/update_email.py`) | ✅ Working | Updates email for user, rider, or admin. |
| **Phone Update** | `PATCH /users/me/phone` (`routes/update_phone.py`) | ❌ Broken | Missing SQL queries in `update_info.sql` causes 500 error. |
| **Nearby Restaurants** | `GET /nearby_restaurents` (`routes/nearby_restaurents.py`) | ❌ Broken | SQL schema mismatches (`restaurents`, `card_id`, etc.) and unhandled Google Maps API errors. |
| **Pending Orders** | `GET /pending_orders_user` (`routes/orders.py`) | ⚠️ Partial | Works for `user_type == "user"`, but rider logic is empty (`# TO-DO`). |

---

## 🚨 2. Critical Bugs & Immediate Fixes Required

### 🔴 Bug 1: Missing Phone Update Queries in `update_info.sql`
- **File:** `Backend/Queries/update_info.sql` (called from `Backend/utils.py` lines 114–118)
- **Problem:** `utils.py` tries to load `update_user_phone`, `update_rider_phone`, and `update_admin_phone`, but they do not exist in `update_info.sql`. Calling `PATCH /users/me/phone` immediately crashes with `ValueError: Query 'update_user_phone' not found`.
- **Action Required:** Add the following queries to `Backend/Queries/update_info.sql`:
```sql
--name:update_user_phone
UPDATE users
SET phone = %s
WHERE username = %s;

--name:update_rider_phone
UPDATE rider
SET phone = %s
WHERE username = %s;

--name:update_admin_phone
UPDATE admin
SET phone = %s
WHERE username = %s;
```

---

### 🔴 Bug 2: Schema / Column Typo Mismatches in `nearby_restaurents.sql`
- **File:** `Backend/Queries/nearby_restaurents.sql`
- **Problem:**
  1. `FROM restaurents R` $\rightarrow$ Schema table name is `restaurant`.
  2. `R.restaurent_id = C.restaurent_id` $\rightarrow$ Schema column name is `restaurant_id`.
  3. `LEFT JOIN orders O ON (C.cart_id = O.card_id)` $\rightarrow$ Schema column is `O.cart_id` (typo: `card_id`).
  4. `COALESCE(AVG(RV.restaurent_rating), 0)` $\rightarrow$ Schema column is `RV.restaurant_rating`.
  5. `WHERE F.restaurent_id = R.restaurent_id` $\rightarrow$ Schema column is `F.restaurant_id`.
  6. `GROUP BY R.restaurent_id...` $\rightarrow$ Schema column is `R.restaurant_id`.
- **Action Required:** Update `Backend/Queries/nearby_restaurents.sql` to:
```sql
--name:get_nearby_restaurents
SELECT 
    R.restaurant_id,
    R.name, 
    ST_Y(R.location::geometry) AS latitude,
    ST_X(R.location::geometry) AS longitude,
    R.open_time, 
    R.close_time, 
    R.status, 
    COALESCE(AVG(RV.restaurant_rating), 0) AS avg_rating
FROM restaurant R 
LEFT JOIN cart C ON (R.restaurant_id = C.restaurant_id)
LEFT JOIN orders O ON (C.cart_id = O.cart_id)
LEFT JOIN review RV ON (O.order_id = RV.order_id)
WHERE ST_DWithin(
    R.location,
    ST_SetSRID(
        ST_MakePoint(%s, %s),
        4326
    )::geography,
    %s
)
AND (
    %s IS NULL
    OR EXISTS(
        SELECT 1 
        FROM foods F
        WHERE F.category = %s
        AND F.restaurant_id = R.restaurant_id
    )
)
GROUP BY
    R.restaurant_id,
    R.name,
    R.location,
    R.open_time,
    R.close_time,
    R.status;
```

---

### 🔴 Bug 3: Longitude / Latitude Inversion in PostGIS `ST_MakePoint`
- **File:** `Backend/utils.py` (line 79) and `Backend/Queries/update_info.sql` (lines 3, 8)
- **Problem:** PostGIS `ST_MakePoint(X, Y)` takes `(longitude, latitude)`.
  In `utils.py` line 79:
  `cur.execute(query, (latitude, longitude, username))` passes `latitude` as the first argument.
  This inverts the coordinates in PostgreSQL and causes spatial queries (`ST_DWithin`) to fail.
- **Action Required:** Change `utils.py` line 79 to pass `longitude` first:
```python
cur.execute(query, (longitude, latitude, username))
```
And verify in `update_info.sql`:
```sql
--name:update_user_location
UPDATE users
SET location = ST_SetSRID(ST_MakePoint(%s, %s), 4326)
WHERE username = %s;
```
*(%s #1 is longitude, %s #2 is latitude).*

---

### 🔴 Bug 4: Database Schema vs Query Primary Key / Column Inconsistencies
- **Files:** `Database/schema.sql` vs `Backend/Queries/login.sql` & `Backend/Queries/orders.sql`
- **Problem:**
  1. `Database/schema.sql` has `user_id VARCHAR(64)` on table `users`, but backend queries expect `username`.
  2. `Database/schema.sql` has `phone_no` on table `rider`, but backend queries expect `phone`.
  3. `orders` table in `Database/schema.sql` has `user_id`, but `orders.sql` queries `WHERE username = %s`.
- **Action Required:** Ensure PostgreSQL schema matches backend conventions:
  - Add `username VARCHAR(50) UNIQUE` to `users` and `rider` (or use `username` as PRIMARY KEY).
  - Rename `rider.phone_no` to `rider.phone`.
  - In `orders` table, link to `username VARCHAR(50)` or store `username`.

---

### 🔴 Bug 5: Unhandled Google Maps API Errors in `Backend/utils.py`
- **File:** `Backend/utils.py` (lines 159–235)
- **Problem:**
  - If `GOOGLE_MAPS_API_KEY` is not set or network/quota error occurs, `response.raise_for_status()` raises an unhandled HTTPError, returning a 500 error to the client.
  - If API response has missing routes, parsing `bicycle_routes[i]` throws `IndexError`.
- **Action Required:** Wrap Google Maps API calls in a `try...except` block with a local fallback distance calculation (Haversine formula + default average speed calculation) so the API continues working even without Google Maps API keys or when offline.

---

### 🔴 Bug 6: Incomplete Rider Handling in `routes/orders.py`
- **File:** `Backend/routes/orders.py` (lines 61–64)
- **Problem:**
```python
if(user_type == "rider"):
    # TO-DO
    pass
```
- **Action Required:** Implement rider order fetching query (fetching active orders assigned to the rider where status is `delivering` or `preparing`).

---

## 🛠️ 3. Missing Features & Endpoint Implementation Roadmap

To achieve full integration with the Next.js frontend, the following endpoints should be built:

### 🍱 Module A: Restaurant Owner Management
- [ ] `POST /register` & `POST /login`: Add `user_type: "restaurant_owner"` support with NID and restaurant verification fields.
- [ ] `GET /owner/restaurant`: Fetch restaurant profile for logged-in owner.
- [ ] `POST /owner/restaurant`: Create or update restaurant hours, address, and status (`open`/`closed`).
- [ ] `GET /owner/menu`: Fetch food items and categories for owner's restaurant.
- [ ] `POST /owner/menu/category`: Add new food category.
- [ ] `POST /owner/menu/item`: Add new food item (name, price, discount, description, picture).
- [ ] `PUT /owner/menu/item/<food_id>`: Update food item.
- [ ] `DELETE /owner/menu/item/<food_id>`: Delete/disable food item.
- [ ] `GET /owner/orders`: Fetch active and past orders for owner's restaurant.
- [ ] `PATCH /owner/orders/<order_id>/status`: Update order status (`preparing`, `ready_for_pickup`, `cancelled`).
- [ ] `GET /owner/analytics`: Daily/weekly sales, order counts, and revenue.

---

### 🛒 Module B: Cart & Ordering Flow
- [ ] `GET /restaurants/<restaurant_id>`: Fetch restaurant details and full food menu.
- [ ] `GET /restaurants`: Fetch/search restaurants with filters (cuisine, rating, status).
- [ ] `POST /cart`: Create or get active cart for logged-in user.
- [ ] `POST /cart/items`: Add/update item quantity in cart.
- [ ] `DELETE /cart/items/<food_id>`: Remove item from cart.
- [ ] `POST /orders/checkout`: Convert active cart into an order, calculate item prices, delivery fee, vat, and total bill.
- [ ] `GET /orders/<order_id>`: Get detailed order status and live tracking info.
- [ ] `POST /orders/<order_id>/cancel`: User order cancellation (allowed if order status is still `pending`).

---

### 💳 Module C: Payments & Reviews
- [ ] `POST /payments`: Process payment record (`order_id`, `payment_method`, `transaction_id`, `status`).
- [ ] `POST /reviews`: Submit customer review for order (`rider_rating`, `rider_review`, `restaurant_rating`, `restaurant_review`).

---

### 🛵 Module D: Rider Portal
- [ ] `GET /rider/available_deliveries`: List nearby orders with status `ready_for_pickup`.
- [ ] `POST /rider/orders/<order_id>/accept`: Assign order to logged-in rider.
- [ ] `PATCH /rider/orders/<order_id>/status`: Update delivery status (`picked_up`, `on_the_way`, `delivered`).
- [ ] `GET /rider/earnings`: Fetch trip history, daily earnings, and account balance.

---

### 🛡️ Module E: Admin Portal
- [ ] `GET /admin/metrics`: Platform totals (total orders, GMV, active users, online riders).
- [ ] `GET /admin/users` & `PATCH /admin/users/<username>/status`: Customer management.
- [ ] `GET /admin/restaurants` & `PATCH /admin/restaurants/<restaurant_id>/status`: Restaurant approvals.
- [ ] `GET /admin/riders` & `PATCH /admin/riders/<username>/status`: Rider verification & approvals.
- [ ] `GET /admin/orders`: Global order audit log.
- [ ] `GET /admin/payments`: Transaction and payout logs.

---

## 🎯 4. First-Time Onboarding & Location API Contract

The frontend now features a smooth 3-step onboarding flow for newly registered users on their first login:
1. **Step 1:** Foodie Persona & Avatar (`pfp`).
2. **Step 2:** Missing Database Fields (`name`, `nid`, `phone`).
3. **Step 3:** Interactive Map Pin & Live GPS Location (`latitude`, `longitude`).

### Location Endpoint Contract (`PATCH /users/me/location`)
- **Headers:** `Authorization: Bearer <jwt_token>`, `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "latitude": 23.792500,
    "longitude": 90.407800
  }
  ```
- **PostGIS Storage:**
  Stored in `users.location` (or `rider.location`) as `GEOGRAPHY(Point, 4326)`.
  Ensure `Backend/utils.py` and `Backend/Queries/update_info.sql` receive coordinates in correct order:
  `ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)` *(Notice longitude is X, latitude is Y)*.

---

## 📦 5. Missing Dependency in `Backend/requirements.txt`
- `Backend/utils.py` imports `requests` (for Google Maps API calls), but `requests` is missing from `requirements.txt`.
- **Action for Teammate:** Add `requests>=2.31.0` to `food-ninja/Backend/requirements.txt`.

---

## 👥 6. Role Selection & Simplified Registration Flow
The frontend registration now uses a modern role selection popup (**Customer**, **Restaurant Owner**, **Rider**, **Admin**).

### Payload Sent to `POST /register`:
- **Customer (`user`)**:
  `{ "user_type": "user", "email": "...", "phone": "...", "password": "...", "username": "...", "name": "..." }`
- **Rider (`rider`)**:
  `{ "user_type": "rider", "email": "...", "phone": "...", "password": "...", "username": "...", "name": "...", "vehicle": "bike"|"bicycle" }`
- **Admin (`admin`)**:
  `{ "user_type": "admin", "username": "...", "email": "...", "phone": "...", "password": "..." }`
- All remaining profile attributes (`nid`, `pfp`, exact legal name, and PostGIS `location`) are gathered upon first login in the onboarding sequence.

