from flask import Blueprint, request, jsonify
import auth
from utils import getNearbyRestaurants, is_valid_food_cat
nearby_restaurants_bp = Blueprint("nearby_restaurants", __name__)


@nearby_restaurants_bp.route("/nearby_restaurants", methods=["GET"])
def get_nearby_restaurants():
    payload = auth.get_user_info()
    
    if payload is None:
        return jsonify({
            "success": False,
            "message": "Invalid token"
        }), 401

    # Extract information from JWT
    user_type = payload.get("user_type")
    username = payload.get("username")

    food_category = request.args.get("food_category")

    if food_category is not None:
        if not isinstance(food_category, str) or not is_valid_food_cat(food_category):
            return jsonify({
                "success": False,
                "message": "invalid food category"
            }), 400

    # under 5km path , under 120min delivery
    result = getNearbyRestaurants(username, food_category)

    if(result == "user not found"):
        return jsonify({
                        "success": True,
                        "message" : result
                    }), 200

    elif(result == "location not set"):
        return jsonify({
                "success": True,
                "message" : result
            }), 200
    

    return jsonify({
        "success": True,
        "restaurants": result,
        "message": "ok"
    }), 200


@nearby_restaurants_bp.route("/owner/status", methods=["GET"])
def get_owner_status():
    payload = auth.get_user_info()
    if payload is None or payload.get("user_type") != "owner":
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    username = payload.get("username")
    from db import get_connection
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT status, name, email, phone, nid FROM restaurant_owner WHERE owner_id = %s;", (username,))
            row = cur.fetchone()
            if not row:
                return jsonify({"success": False, "message": "Owner not found"}), 404
            return jsonify({
                "success": True,
                "status": row.get("status", "pending"),
                "name": row.get("name"),
                "email": row.get("email"),
                "phone": row.get("phone"),
                "nid": row.get("nid")
            }), 200


@nearby_restaurants_bp.route("/owner/restaurants", methods=["GET", "POST"])
def owner_restaurants():
    payload = auth.get_user_info()
    if payload is None or payload.get("user_type") != "owner":
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    username = payload.get("username")
    from db import get_connection

    if request.method == "GET":
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT restaurant_id, name, 
                           ST_Y(location::geometry) AS latitude, 
                           ST_X(location::geometry) AS longitude, 
                           open_time::text, close_time::text, status
                    FROM restaurant
                    WHERE owner_id = %s
                    ORDER BY name ASC;
                """, (username,))
                rows = cur.fetchall() or []
                return jsonify({"success": True, "restaurants": rows}), 200

    if request.method == "POST":
        data = request.get_json() or {}
        name = data.get("name")
        open_time = data.get("open_time") or "10:00:00"
        close_time = data.get("close_time") or "23:00:00"
        latitude = data.get("latitude") or 23.7925
        longitude = data.get("longitude") or 90.4078

        if not isinstance(name, str) or not name.strip():
            return jsonify({"success": False, "message": "Restaurant name is required"}), 400

        with get_connection() as conn:
            with conn.cursor() as cur:
                # Check if owner is approved
                cur.execute("SELECT status FROM restaurant_owner WHERE owner_id = %s;", (username,))
                owner_row = cur.fetchone()
                if not owner_row or owner_row.get("status") != "approved":
                    return jsonify({
                        "success": False,
                        "message": "Your account is pending admin verification. You cannot create a restaurant yet."
                    }), 403

                import time
                restaurant_id = f"REST-{int(time.time())}"

                cur.execute("""
                    INSERT INTO restaurant (restaurant_id, owner_id, name, location, open_time, close_time, status)
                    VALUES (%s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s, %s, 'pending');
                """, (restaurant_id, username, name.strip(), float(longitude), float(latitude), open_time, close_time))
                conn.commit()

                return jsonify({
                    "success": True,
                    "message": "Restaurant created and submitted for Admin verification",
                    "restaurant": {
                        "restaurant_id": restaurant_id,
                        "name": name.strip(),
                        "open_time": open_time,
                        "close_time": close_time,
                        "status": "pending"
                    }
                }), 201


@nearby_restaurants_bp.route("/owner/restaurants/<restaurant_id>", methods=["DELETE"])
def delete_owner_restaurant(restaurant_id):
    payload = auth.get_user_info()
    if payload is None:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    user_type = payload.get("user_type")
    username = payload.get("username")
    from db import get_connection

    with get_connection() as conn:
        with conn.cursor() as cur:
            if user_type == "admin":
                cur.execute("DELETE FROM restaurant WHERE restaurant_id = %s;", (restaurant_id,))
            else:
                cur.execute("DELETE FROM restaurant WHERE restaurant_id = %s AND owner_id = %s;", (restaurant_id, username))

            conn.commit()
            return jsonify({"success": True, "message": "Restaurant deleted successfully"}), 200


@nearby_restaurants_bp.route("/admin/users", methods=["GET"])
def admin_get_users():
    payload = auth.get_user_info()
    if payload is None or payload.get("user_type") != "admin":
        return jsonify({"success": False, "message": "Admin authorization required"}), 403

    from db import get_connection
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT username, name, email, phone, balance, status
                FROM users
                ORDER BY username ASC;
            """)
            rows = cur.fetchall() or []
            return jsonify({"success": True, "users": rows}), 200


@nearby_restaurants_bp.route("/admin/owners", methods=["GET"])
@nearby_restaurants_bp.route("/admin/pending_owners", methods=["GET"])
def admin_pending_owners():
    payload = auth.get_user_info()
    if payload is None or payload.get("user_type") != "admin":
        return jsonify({"success": False, "message": "Admin authorization required"}), 403

    from db import get_connection
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT owner_id, name, email, phone, nid, status
                FROM restaurant_owner
                ORDER BY owner_id ASC;
            """)
            rows = cur.fetchall() or []
            return jsonify({"success": True, "owners": rows}), 200


@nearby_restaurants_bp.route("/admin/verify_owner", methods=["POST"])
def admin_verify_owner():
    payload = auth.get_user_info()
    if payload is None or payload.get("user_type") != "admin":
        return jsonify({"success": False, "message": "Admin authorization required"}), 403

    data = request.get_json() or {}
    owner_id = data.get("owner_id")
    status = data.get("status")  # 'approved' or 'rejected'

    if not owner_id or status not in ("approved", "rejected", "banned", "pending"):
        return jsonify({"success": False, "message": "Invalid owner verification data"}), 400

    from db import get_connection
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE restaurant_owner SET status = %s WHERE owner_id = %s;", (status, owner_id))
            conn.commit()
            return jsonify({"success": True, "message": f"Owner {status} successfully"}), 200


@nearby_restaurants_bp.route("/admin/pending_restaurants", methods=["GET"])
def admin_pending_restaurants():
    payload = auth.get_user_info()
    if payload is None or payload.get("user_type") != "admin":
        return jsonify({"success": False, "message": "Admin authorization required"}), 403

    from db import get_connection
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT R.restaurant_id, R.name, R.owner_id, O.name AS owner_name, 
                       R.open_time::text, R.close_time::text, R.status
                FROM restaurant R
                LEFT JOIN restaurant_owner O ON R.owner_id = O.owner_id
                ORDER BY R.name ASC;
            """)
            rows = cur.fetchall() or []
            return jsonify({"success": True, "restaurants": rows}), 200


@nearby_restaurants_bp.route("/admin/verify_restaurant", methods=["POST"])
def admin_verify_restaurant():
    payload = auth.get_user_info()
    if payload is None or payload.get("user_type") != "admin":
        return jsonify({"success": False, "message": "Admin authorization required"}), 403

    data = request.get_json() or {}
    restaurant_id = data.get("restaurant_id")
    status = data.get("status")  # 'open' or 'rejected' or 'closed'

    if not restaurant_id or status not in ("open", "rejected", "closed", "banned", "pending"):
        return jsonify({"success": False, "message": "Invalid restaurant verification data"}), 400

    from db import get_connection
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE restaurant SET status = %s WHERE restaurant_id = %s;", (status, restaurant_id))
            conn.commit()
            return jsonify({"success": True, "message": f"Restaurant status updated to {status}"}), 200