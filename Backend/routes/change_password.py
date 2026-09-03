from flask import Blueprint, request, jsonify
import utils
import auth


change_password_bp = Blueprint("change_password", __name__)


@change_password_bp.route("/users/me/password", methods=["PATCH", "POST"])
def change_password():
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
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if (
        not isinstance(old_password, str) or
        not old_password or
        not isinstance(new_password, str) or
        not new_password
    ):
        return jsonify({
            "success": False,
            "message": "Both old and new passwords are required"
        }), 400

    if old_password == new_password:
        return jsonify({
            "success": False,
            "message": "New password must be different from current password"
        }), 400

    # Verify the user/admin/rider's old password using the exact same verification structure
    if not utils.verifyUserPassword(user_type, username, old_password):
        return jsonify({
            "success": False,
            "message": "Incorrect current password"
        }), 401

    # Hash new password
    hashed_new_password = auth.hash_password(new_password)

    # Update database
    result = utils.updatePassword(user_type, username, hashed_new_password)

    if result == "success":
        return jsonify({
            "success": True,
            "message": "Password changed successfully"
        }), 200
    else:
        return jsonify({
            "success": False,
            "message": "Password update failed"
        }), 500
