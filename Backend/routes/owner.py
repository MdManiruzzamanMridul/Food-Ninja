from flask import Blueprint, request, jsonify
from db import get_connection, load_query
import auth
import psycopg
import time

owner_bp = Blueprint("owner", __name__)


@owner_bp.route("/owner/status", methods=["GET"])
def get_owner_status():
    payload = auth.get_user_info()

    if payload is None or payload.get("user_type") != "owner":
        return jsonify({
            "success": False,
            "message": "Unauthorized"
        }), 401

    username = payload.get("username")

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                query = load_query("owner.sql", "get_owner_status")
                cur.execute(query, (username,))
                row = cur.fetchone()

                if not row:
                    return jsonify({
                        "success": False,
                        "message": "Owner not found"
                    }), 404

                return jsonify({
                    "success": True,
                    "status": row.get("status", "pending"),
                    "name": row.get("name"),
                    "email": row.get("email"),
                    "phone": row.get("phone"),
                    "nid": row.get("nid")
                }), 200

    except psycopg.Error:
        return jsonify({
            "success": False,
            "message": "Database error"
        }), 500


@owner_bp.route("/owner/restaurants", methods=["GET", "POST"])
def owner_restaurants():
    payload = auth.get_user_info()

    if payload is None or payload.get("user_type") != "owner":
        return jsonify({
            "success": False,
            "message": "Unauthorized"
        }), 401

    username = payload.get("username")

    if request.method == "GET":
        try:
            with get_connection() as conn:
                with conn.cursor() as cur:
                    query = load_query("owner.sql", "get_owner_restaurants")
                    cur.execute(query, (username,))
                    rows = cur.fetchall() or []

                    return jsonify({
                        "success": True,
                        "restaurants": rows
                    }), 200

        except psycopg.Error:
            return jsonify({
                "success": False,
                "message": "Database error"
            }), 500

    if request.method == "POST":
        data = request.get_json() or {}
        name = data.get("name")
        open_time = data.get("open_time") or "10:00:00"
        close_time = data.get("close_time") or "23:00:00"
        latitude = data.get("latitude") or 23.7925
        longitude = data.get("longitude") or 90.4078

        if not isinstance(name, str) or not name.strip():
            return jsonify({
                "success": False,
                "message": "Restaurant name is required"
            }), 400

        try:
            with get_connection() as conn:
                with conn.cursor() as cur:
                    # Check whether owner is approved
                    status_query = load_query("owner.sql", "check_owner_status")
                    cur.execute(status_query, (username,))
                    owner_row = cur.fetchone()

                    if not owner_row or owner_row.get("status") != "approved":
                        return jsonify({
                            "success": False,
                            "message": "Your account is pending admin verification. You cannot create a restaurant yet."
                        }), 403

                    restaurant_id = f"REST-{int(time.time())}"
                    insert_query = load_query("owner.sql", "insert_restaurant")
                    cur.execute(
                        insert_query,
                        (
                            restaurant_id,
                            username,
                            name.strip(),
                            float(longitude),
                            float(latitude),
                            open_time,
                            close_time,
                            "pending"
                        )
                    )
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

        except psycopg.Error:
            return jsonify({
                "success": False,
                "message": "Database error"
            }), 500


@owner_bp.route("/owner/restaurants/<restaurant_id>", methods=["DELETE"])
def delete_owner_restaurant(restaurant_id):
    payload = auth.get_user_info()

    if payload is None:
        return jsonify({
            "success": False,
            "message": "Unauthorized"
        }), 401

    user_type = payload.get("user_type")
    username = payload.get("username")

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                if user_type == "admin":
                    query = load_query("owner.sql", "delete_restaurant_by_admin")
                    cur.execute(query, (restaurant_id,))
                else:
                    query = load_query("owner.sql", "delete_restaurant_by_owner")
                    cur.execute(query, (restaurant_id, username))

                conn.commit()
                return jsonify({
                    "success": True,
                    "message": "Restaurant deleted successfully"
                }), 200

    except psycopg.Error:
        return jsonify({
            "success": False,
            "message": "Database error"
        }), 500
