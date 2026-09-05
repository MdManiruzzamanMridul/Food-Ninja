from flask import Blueprint, request, jsonify
from db import get_connection, load_query
import auth
import psycopg

admin_bp = Blueprint("admin", __name__)


def approved_admin_required():
    payload = auth.get_user_info()
    if not auth.is_approved_admin(payload):
        return None, (jsonify({"success": False, "message": "Approved admin authorization required"}), 403)
    return payload, None


@admin_bp.route("/admin/status", methods=["GET"])
def admin_status():
    payload = auth.get_user_info()
    if payload is None or payload.get("user_type") != "admin":
        return jsonify({"success": False, "message": "Admin authorization required"}), 403

    try:
        with get_connection() as conn, conn.cursor() as cur:
            cur.execute(load_query("admin.sql", "get_admin_status"), (payload["username"],))
            row = cur.fetchone()
            if not row:
                return jsonify({"success": False, "message": "Admin not found"}), 404
            return jsonify({"success": True, "status": row["status"]}), 200
    except psycopg.Error:
        return jsonify({"success": False, "message": "Database error"}), 500


@admin_bp.route("/admin/pending_admins", methods=["GET"])
def admin_pending_admins():
    _, error = approved_admin_required()
    if error:
        return error
    try:
        with get_connection() as conn, conn.cursor() as cur:
            cur.execute(load_query("admin.sql", "get_all_admins"))
            return jsonify({"success": True, "admins": cur.fetchall() or []}), 200
    except psycopg.Error:
        return jsonify({"success": False, "message": "Database error"}), 500


@admin_bp.route("/admin/verify_admin", methods=["POST"])
def admin_verify_admin():
    _, error = approved_admin_required()
    if error:
        return error
    data = request.get_json() or {}
    username = data.get("username")
    status = data.get("status")
    if not username or status not in ("approved", "banned", "pending"):
        return jsonify({"success": False, "message": "Invalid admin verification data"}), 400
    try:
        with get_connection() as conn, conn.cursor() as cur:
            cur.execute(load_query("admin.sql", "verify_admin"), (status, username))
            conn.commit()
            return jsonify({"success": True, "message": f"Admin status updated to {status}"}), 200
    except psycopg.Error:
        return jsonify({"success": False, "message": "Database error"}), 500


@admin_bp.route("/admin/users", methods=["GET"])
def admin_get_users():
    _, error = approved_admin_required()
    if error:
        return error

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
    _, error = approved_admin_required()
    if error:
        return error

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
    _, error = approved_admin_required()
    if error:
        return error

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
    _, error = approved_admin_required()
    if error:
        return error

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


@admin_bp.route("/admin/pending_riders", methods=["GET"])
def admin_pending_riders():
    _, error = approved_admin_required()
    if error:
        return error

    try:
        with get_connection() as conn, conn.cursor() as cur:
            cur.execute(load_query("admin.sql", "get_all_riders"))
            return jsonify({"success": True, "riders": cur.fetchall() or []}), 200
    except psycopg.Error:
        return jsonify({"success": False, "message": "Database error"}), 500


@admin_bp.route("/admin/verify_rider", methods=["POST"])
def admin_verify_rider():
    _, error = approved_admin_required()
    if error:
        return error

    data = request.get_json() or {}
    rider_username = data.get("rider_username")
    status = data.get("status")
    if not rider_username or status not in ("offline", "banned", "pending"):
        return jsonify({"success": False, "message": "Invalid rider verification data"}), 400

    try:
        with get_connection() as conn, conn.cursor() as cur:
            cur.execute(load_query("admin.sql", "verify_rider"), (status, rider_username))
            conn.commit()
            return jsonify({"success": True, "message": f"Rider status updated to {status}"}), 200
    except psycopg.Error:
        return jsonify({"success": False, "message": "Database error"}), 500


@admin_bp.route("/admin/verify_restaurant", methods=["POST"])
def admin_verify_restaurant():
    _, error = approved_admin_required()
    if error:
        return error

    data = request.get_json() or {}
    restaurant_id = data.get("restaurant_id")
    status = data.get("status")

    if not restaurant_id or status not in ("closed", "banned", "pending"):
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
