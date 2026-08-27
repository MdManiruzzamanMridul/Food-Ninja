from flask import Blueprint, request, jsonify
import utils
import auth


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
    
    data = request.get_json() or {}
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "message": "insufficient location info"
        }), 400

    result = utils.updateLocation(user_type, username, latitude, longitude)
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
    
    

    