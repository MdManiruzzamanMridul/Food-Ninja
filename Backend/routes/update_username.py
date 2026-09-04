from flask import Blueprint, request, jsonify
import utils
import auth

update_username_bp = Blueprint("update_username", __name__)


@update_username_bp.route("/users/check_username", methods=["GET"])
def check_username():
    username = request.args.get("username", "").strip().lower()
    if not username:
        return jsonify({
            "available": False,
            "message": "Username is required"
        }), 400

    normalized = utils.normalize_username(username)
    if not normalized:
        return jsonify({
            "available": False,
            "message": "Invalid username format. Must start with a letter and contain only letters, numbers, and underscores."
        }), 400

    taken = utils.is_username_taken(normalized)
    return jsonify({
        "available": not taken,
        "username": normalized,
        "message": f"Username '{normalized}' is already taken" if taken else f"Username '{normalized}' is available"
    }), 200


@update_username_bp.route("/users/me/username", methods=["PATCH", "POST"])
def update_username():
    payload = auth.get_user_info()

    if payload is None:
        return jsonify({
            "success": False,
            "message": "Invalid or missing token"
        }), 401

    user_type = payload.get("user_type")
    current_username = payload.get("username")

    data = request.get_json() or {}
    new_username = data.get("new_username")

    if not isinstance(new_username, str) or not new_username.strip():
        return jsonify({
            "success": False,
            "message": "Username is required"
        }), 400

    new_username = utils.normalize_username(new_username)
    if not new_username:
        return jsonify({
            "success": False,
            "message": "Invalid username format. Must start with a letter and contain only letters, numbers, and underscores."
        }), 400

    # If the user already has this username, return success
    if new_username == current_username:
        new_token = auth.create_token(current_username, user_type)
        return jsonify({
            "success": True,
            "message": "Username unchanged",
            "username": current_username,
            "token": new_token
        }), 200

    # Primary key uniqueness check across all tables
    if utils.is_username_taken(new_username):
        return jsonify({
            "success": False,
            "message": f"Username '{new_username}' is already taken. Please choose another."
        }), 409

    result = utils.updateUsername(user_type, current_username, new_username)
    if result == "success":
        new_token = auth.create_token(new_username, user_type)
        return jsonify({
            "success": True,
            "message": "Username set successfully",
            "username": new_username,
            "token": new_token
        }), 200
    elif result == "username_exists":
        return jsonify({
            "success": False,
            "message": f"Username '{new_username}' is already taken. Please choose another."
        }), 409
    else:
        return jsonify({
            "success": False,
            "message": "Database error while updating username"
        }), 500
