from flask import Blueprint, request, jsonify
import auth
from utils import getNearbyRestaurents, is_valid_food_cat
nearby_restaurents_bp = Blueprint("nearby_restaurents", __name__)


@nearby_restaurents_bp.route("/nearby_restaurents", methods=["GET"])
def get_nearby_restaurents():
    payload = auth.get_user_info()
    
    if payload is None:
        return jsonify({
            "success": False,
            "message": "Invalid token"
        }), 401

    # Extract information from JWT
    user_type = payload.get("user_type")
    username = payload.get("username")

    food_category = request.args.get("food_category")

    if food_category is not None:
        if not isinstance(food_category, str) or not is_valid_food_cat(food_category):
            return jsonify({
                "success": False,
                "message": "invalid food category"
            }), 400

    # under 5km path , under 120min delivery
    result = getNearbyRestaurents(username, food_category)

    if(result == "user not found"):
        return jsonify({
                        "success": True,
                        "message" : result
                    }), 200

    elif(result == "location not set"):
        return jsonify({
                "success": True,
                "message" : result
            }), 200
    

    return jsonify({
        "success": True,
        "restaurents": result,
        "message": "ok"
    }), 200