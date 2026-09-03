from flask import Blueprint, jsonify
from db import get_connection, load_query
import auth

orders_bp = Blueprint("orders", __name__)


@orders_bp.route("/pending_orders_user", methods=["GET"])
def get_orders():
    payload = auth.get_user_info()

    if payload is None:
        return jsonify({
            "success": False,
            "message": "Invalid or missing token"
        }), 401

    username = payload.get("username")

    try:
        with get_connection() as conn:     
            with conn.cursor() as cur: 
                query = load_query("orders.sql", "pending_orders_user")
                cur.execute(query, (username,))
                rows = cur.fetchall()

                return jsonify({
                    "success": True,
                    "orders": rows
                }), 200
    except Exception:
        return jsonify({
            "success": True,
            "orders": []
        }), 200
