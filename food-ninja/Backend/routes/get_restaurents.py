from flask import Blueprint, request, jsonify
from db import get_connection, load_query
import auth

orders_bp = Blueprint("orders", __name__)


@orders_bp.route("/pending_orders_user", methods=["GET"])
def get_orders():

    # Receive token
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return jsonify({
            "success": False,
            "message": "Authentication required"
        }), 401

    # Extract token from:
    # Authorization: Bearer <token>
    parts = auth_header.split(" ")

    if len(parts) != 2 or parts[0] != "Bearer":
        return jsonify({
            "success": False,
            "message": "Invalid authorization header"
        }), 401

    token = parts[1]

    # Verify token
    payload = auth.verify_token(token)

    if payload is None:
        return jsonify({
            "success": False,
            "message": "Invalid or expired token"
        }), 401

    # Extract information from JWT
    user_type = payload["user_type"]

    with get_connection() as conn:     
            with conn.cursor() as cur: 

                if(user_type == "user"):
                    username = payload["username"]
                    query = load_query("orders.sql", "pending_orders_user")
                    
                    cur.execute(query, (username,))
                    rows = cur.fetchall()

                    return jsonify({
                        "success": True,
                        "orders": rows
                    }), 200



                if(user_type == "rider"):
                    # TO-DO
                    pass


    

    return jsonify({
        "success": True
    }), 200