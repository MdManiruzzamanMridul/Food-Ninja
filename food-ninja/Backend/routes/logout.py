from flask import Blueprint, jsonify, request
import auth

logout_bp = Blueprint("logout", __name__)


@logout_bp.route("/logout", methods=["POST"])
def logout():

    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return jsonify({
            "success": False,
            "message": "Authorization token required"
        }), 401

    parts = auth_header.split(" ")

    if len(parts) != 2 or parts[0] != "Bearer":
        return jsonify({
            "success": False,
            "message": "Invalid authorization header"
        }), 401

    token = parts[1]

    if not auth.revoke_token(token):
        return jsonify({
            "success": False,
            "message": "Invalid token"
        }), 401

    return jsonify({
        "success": True,
        "message": "Logged out successfully"
    }), 200