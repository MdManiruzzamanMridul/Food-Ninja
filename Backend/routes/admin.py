from flask import Blueprint, request, jsonify
from db import get_connection, load_query
import auth
import psycopg

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/admin/users", methods=["GET"])
def admin_get_users():
    payload = auth.get_user_info()

    if payload is None or payload.get("user_type") != "admin":
        return jsonify({
            "success": False,
            "message": "Admin authorization required"
        }), 403

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                query = load_query("admin.sql", "get_all_users")
                cur.execute(query)
                rows = cur.fetchall() or []

                return jsonify({
                    "success": True,
                    "users": rows
                }), 200

    except psycopg.Error:
        return jsonify({
            "success": False,
            "message": "Database error"
        }), 500


@admin_bp.route("/admin/owners", methods=["GET"])
@admin_bp.route("/admin/pending_owners", methods=["GET"])
def admin_pending_owners():
    payload = auth.get_user_info()

    if payload is None or payload.get("user_type") != "admin":
        return jsonify({
            "success": False,
            "message": "Admin authorization required"
        }), 403

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                query = load_query("admin.sql", "get_all_owners")
                cur.execute(query)
                rows = cur.fetchall() or []

                return jsonify({
                    "success": True,
                    "owners": rows
                }), 200

    except psycopg.Error:
        return jsonify({
            "success": False,
            "message": "Database error"
        }), 500


@admin_bp.route("/admin/verify_owner", methods=["POST"])
def admin_verify_owner():
    payload = auth.get_user_info()

    if payload is None or payload.get("user_type") != "admin":
        return jsonify({
            "success": False,
            "message": "Admin authorization required"
        }), 403

    data = request.get_json() or {}
    owner_id = data.get("owner_id")
    status = data.get("status")

    if not owner_id or status not in ("approved", "rejected", "banned", "pending"):
        return jsonify({
            "success": False,
            "message": "Invalid owner verification data"
        }), 400

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                query = load_query("admin.sql", "verify_owner")
                cur.execute(query, (status, owner_id))
                conn.commit()

                return jsonify({
                    "success": True,
                    "message": f"Owner {status} successfully"
                }), 200

    except psycopg.Error:
        return jsonify({
            "success": False,
            "message": "Database error"
        }), 500


@admin_bp.route("/admin/pending_restaurants", methods=["GET"])
def admin_pending_restaurants():
    payload = auth.get_user_info()

    if payload is None or payload.get("user_type") != "admin":
        return jsonify({
            "success": False,
            "message": "Admin authorization required"
        }), 403

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                query = load_query("admin.sql", "get_all_restaurants")
                cur.execute(query)
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


@admin_bp.route("/admin/verify_restaurant", methods=["POST"])
def admin_verify_restaurant():
    payload = auth.get_user_info()

    if payload is None or payload.get("user_type") != "admin":
        return jsonify({
            "success": False,
            "message": "Admin authorization required"
        }), 403

    data = request.get_json() or {}
    restaurant_id = data.get("restaurant_id")
    status = data.get("status")

    if not restaurant_id or status not in ("open", "rejected", "closed", "banned", "pending"):
        return jsonify({
            "success": False,
            "message": "Invalid restaurant verification data"
        }), 400

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                query = load_query("admin.sql", "verify_restaurant")
                cur.execute(query, (status, restaurant_id))
                conn.commit()

                return jsonify({
                    "success": True,
                    "message": f"Restaurant status updated to {status}"
                }), 200

    except psycopg.Error:
        return jsonify({
            "success": False,
            "message": "Database error"
        }), 500
