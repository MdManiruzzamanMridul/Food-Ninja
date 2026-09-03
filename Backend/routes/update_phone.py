from flask import Blueprint, request, jsonify
import utils
import auth


update_phone_bp = Blueprint("update_phone", __name__)


@update_phone_bp.route("/users/me/phone", methods=["PATCH", "POST"])
def update_phone():
    payload = auth.get_user_info()

    if payload is None:
        return jsonify({
            "success": False,
            "message": "Invalid or missing token"
        }), 401

    # Extract information from JWT
    user_type = payload.get("user_type")
    username = payload.get("username")

    data = request.get_json() or {}
    new_phone = data.get("new_phone")
    password = data.get("password")

    # Password required to verify user identity
    if not isinstance(password, str) or not password:
        return jsonify({
            "success": False,
            "message": "Password is required"
        }), 400

    # Verify the user/admin/rider's password
    if not utils.verifyUserPassword(user_type, username, password):
        return jsonify({
            "success": False,
            "message": "Incorrect password"
        }), 401

    # Validate and normalize phone number
    new_phone = utils.normalize_bd_phone(new_phone)

    if new_phone is None:
        return jsonify({
            "success": False,
            "message": "Invalid phone number"
        }), 400

    # Update database
    result = utils.updatePhone(user_type, username, new_phone)

    if result == "success":
        return jsonify({
            "success": True,
            "message": "Phone number updated successfully"
        }), 200

    elif result == "phone_exists":
        return jsonify({
            "success": False,
            "message": "Phone number already registered"
        }), 409

    else:
        return jsonify({
            "success": False,
            "message": "Phone number update failed"
        }), 500