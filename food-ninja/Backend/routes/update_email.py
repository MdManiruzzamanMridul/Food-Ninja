from flask import Blueprint, request, jsonify
import utils
import auth


update_email_bp = Blueprint("update_email", __name__)

@update_email_bp.route("/users/me/email", methods=["PATCH"])
def update_email():
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
    new_email = data.get("new_email")

    if not isinstance(new_email, str) or not utils.is_valid_email(new_email):
        return jsonify({
            "success": False,
            "message": "invalid email"
        }), 400
    

    result = utils.updateEmail(user_type, username, new_email)
    if result == "success":
        return jsonify({
            "success": True,
            "message": "email updated successfully"
        }), 200
    elif result == "email_exists":
        return jsonify({
            "success": False,
            "message": "email already registered"
        }), 409
    else:
        return jsonify({
            "success": False,
            "message": "email update failed"
        }), 500
    
    
    

    