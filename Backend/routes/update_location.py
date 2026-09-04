from flask import Blueprint, request, jsonify
import utils
import auth
import psycopg
from db import get_connection, load_query


update_location_bp = Blueprint("update_location", __name__)

@update_location_bp.route("/users/me/location", methods=["PATCH"])
def update_location():
    payload = auth.get_user_info()

    if payload is None:
        return jsonify({
            "success": False,
            "message": "Invalid token"
        }), 401

    # Extract information from JWT
    user_type = payload.get("user_type")
    username = payload.get("username")

    if user_type not in ("user", "rider"):
        return jsonify({
            "success": False,
            "message": "This role cannot update a delivery location"
        }), 403
    
    data = request.get_json() or {}
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "message": "insufficient location info"
        }), 400

    result = utils.updateLocation(user_type, username, longitude, latitude)
    if result == "success":
        return jsonify({
            "success": True,
            "message": "Location updated successfully"
        }), 200
    else:
        return jsonify({
            "success": False,
            "message": "Location update failed"
        }), 500


@update_location_bp.route("/users/me/location", methods=["GET"])
def get_location():
    payload = auth.get_user_info()
    if payload is None:
        return jsonify({"success": False, "message": "Invalid token"}), 401

    user_type = payload.get("user_type")
    username = payload.get("username")
    if user_type not in ("user", "rider"):
        return jsonify({"success": False, "message": "This role has no delivery location"}), 403

    query_file = "get_info.sql" if user_type == "user" else "rider.sql"
    query_name = "get_user_location" if user_type == "user" else "get_rider_location"
    try:
        with get_connection() as conn, conn.cursor() as cur:
            cur.execute(load_query(query_file, query_name), (username,))
            row = cur.fetchone() or {}
            latitude = row.get("latitude")
            longitude = row.get("longitude")
            return jsonify({
                "success": True,
                "has_location": latitude is not None and longitude is not None,
                "latitude": latitude,
                "longitude": longitude,
            }), 200
    except psycopg.Error:
        return jsonify({"success": False, "message": "Database error"}), 500
    
    

    