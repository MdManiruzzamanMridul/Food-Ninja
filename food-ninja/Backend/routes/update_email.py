from flask import Blueprint, request, jsonify
import utils
import auth


update_email_bp = Blueprint("update_email", __name__)

@update_email_bp.route("/users/me/email", methods=["PATCH", "POST"])
def update_email():
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
    new_email = data.get("new_email")
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

    if not isinstance(new_email, str) or not utils.is_valid_email(new_email):
        return jsonify({
            "success": False,
            "message": "Invalid email"
        }), 400
    
    result = utils.updateEmail(user_type, username, new_email.strip().lower())
    if result == "success":
        return jsonify({
            "success": True,
            "message": "Email updated successfully"
        }), 200
    elif result == "email_exists":
        return jsonify({
            "success": False,
            "message": "Email already registered"
        }), 409
    else:
        return jsonify({
            "success": False,
            "message": "Email update failed"
        }), 500