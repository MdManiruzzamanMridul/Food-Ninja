from flask import Blueprint, jsonify
import psycopg

import auth
from db import get_connection, load_query


rider_bp = Blueprint("rider", __name__)


@rider_bp.get("/rider/status")
def rider_status():
    payload = auth.get_user_info()
    if payload is None:
        return jsonify({"success": False, "message": "Invalid or missing token"}), 401
    if payload.get("user_type") != "rider":
        return jsonify({"success": False, "message": "Rider authorization required"}), 403

    try:
        with get_connection() as conn, conn.cursor() as cur:
            cur.execute(load_query("rider.sql", "get_rider_status"), (payload["username"],))
            row = cur.fetchone()
            if not row:
                return jsonify({"success": False, "message": "Rider not found"}), 404
            return jsonify({
                "success": True,
                "status": row.get("status", "pending"),
                "has_location": row.get("location") is not None,
            }), 200
    except psycopg.Error:
        return jsonify({"success": False, "message": "Database error"}), 500